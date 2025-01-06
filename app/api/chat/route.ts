import { createClient } from '@/utils/supabase/server';
import { generateResponse } from '@/utils/ai/chat';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    console.log('=== API Request Started ===', new Date().toISOString());
    const supabase = await createClient();
    
    // Get the authenticated user
    console.log('Fetching user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('User auth error:', userError);
      throw userError;
    }
    console.log('User ID:', user?.id);

    // Add timeout check
    if (Date.now() - startTime > 25000) {
      throw new Error('Request timeout - user auth took too long');
    }

    // Parse request body
    const body = await request.json();
    let { message, conversationId } = body;
    console.log('Processing request for conversation:', conversationId);

    // Conversation handling
    console.log('Handling conversation...', { conversationId });
    if (conversationId) {
      console.log('Verifying existing conversation...');
      const { data: existingConv, error: convCheckError } = await supabase
        .from('conversations')
        .select('id, user_id')
        .eq('id', conversationId)
        .single();

      if (convCheckError) {
        console.error('Conversation check error:', convCheckError);
        throw convCheckError;
      }

      if (!existingConv || existingConv.user_id !== user?.id) {
        console.log('Creating new conversation as verification failed');
        conversationId = null;
      }
    }

    if (!conversationId) {
      console.log('Creating new conversation...');
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user?.id,
          title: 'New Chat',
        })
        .select()
        .single();

      if (convError) {
        console.error('Conversation creation error:', convError);
        throw convError;
      }
      conversationId = conversation.id;
      console.log('New conversation created:', conversationId);
    }

    // Save user message
    console.log('Saving user message...');
    const { error: messageError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      content: message,
      role: 'user'
    });

    if (messageError) {
      console.error('User message save error:', messageError);
      throw messageError;
    }
    console.log('User message saved successfully');

    // Get conversation history
    console.log('Fetching conversation history...');
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('History fetch error:', historyError);
      throw historyError;
    }
    console.log('History fetched, message count:', history?.length);

    // Generate AI response
    console.log('Generating AI response...');
    const response = await generateResponse(message, history || []);
    console.log('AI response received:', JSON.stringify(response, null, 2));
    
    // Process flowchart data
    console.log('Processing flowchart data...');
    let cleanContent = response.content;
    let flowchartData = null;

    if (response.flowchart_data) {
      flowchartData = response.flowchart_data
        .replace(/```mermaid\n?|```/g, '')
        .replace(/\[(.*?)\]/g, (match, p1) => `[${p1.replace(/\s+/g, '_')}]`)
        .replace(/\((.*?)\)/g, (match, p1) => `(${p1.replace(/\s+/g, '_')})`)
        .trim();
      console.log('Processed flowchart data from response object');
    } else {
      const mermaidMatch = response.content.match(/```mermaid([\s\S]*?)```/);
      if (mermaidMatch) {
        flowchartData = mermaidMatch[1]
          .replace(/\[(.*?)\]/g, (match, p1) => `[${p1.replace(/\s+/g, '_')}]`)
          .replace(/\((.*?)\)/g, (match, p1) => `(${p1.replace(/\s+/g, '_')})`)
          .trim();
        cleanContent = response.content.replace(/```mermaid[\s\S]*?```/g, '').trim();
        console.log('Extracted and processed flowchart data from content');
      }
    }

    console.log('Final flowchart data present:', !!flowchartData);

    // Save AI response
    console.log('Saving AI response...');
    const { error: aiMessageError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      content: cleanContent,
      role: 'assistant',
      flowchart_data: flowchartData
    });

    if (aiMessageError) {
      console.error('AI message save error:', aiMessageError);
      throw aiMessageError;
    }
    console.log('AI response saved successfully');

    // Add more timeout checks at key points
    if (Date.now() - startTime > 25000) {
      throw new Error('Request timeout - processing took too long');
    }

    console.log('=== API Request Completed Successfully ===');
    console.log('Total time:', Date.now() - startTime, 'ms');
    
    return NextResponse.json({
      content: cleanContent,
      flowchart_data: flowchartData,
      conversation_id: conversationId
    });

  } catch (error) {
    console.error('=== API Error Details ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Total time until error:', Date.now() - startTime, 'ms');
    
    // Return appropriate status code
    const status = error.message?.includes('timeout') ? 504 : 500;
    
    return NextResponse.json(
      { 
        error: error.message,
        errorType: error.name,
        errorDetails: JSON.stringify(error, null, 2)
      }, 
      { status }
    );
  }
}