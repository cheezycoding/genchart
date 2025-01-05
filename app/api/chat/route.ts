import { createClient } from '@/utils/supabase/server';
import { generateResponse } from '@/utils/ai/chat';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('API request received');
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user?.id);

    // Read the body ONCE and store it
    const body = await request.json();
    console.log('Request body:', body);

    // Destructure from the stored body
    let { message, conversationId } = body;

    // If conversationId provided, verify it exists
    if (conversationId) {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id, user_id')
        .eq('id', conversationId)
        .single();

      // Verify conversation exists and belongs to user
      if (!existingConv || existingConv.user_id !== user?.id) {
        console.log('Conversation not found or unauthorized');
        conversationId = null;
      }
    }

    // Create new conversation if needed
    if (!conversationId) {
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
      console.log('Created new conversation:', conversationId);
    }

    // Save user message
    const { error: messageError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      content: message,
      role: 'user'
    });

    if (messageError) {
      console.error('Error saving user message:', messageError);
      throw messageError;
    }

    // Get conversation history
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('Error fetching history:', historyError);
      throw historyError;
    }

    // Generate AI response
    console.log('Generating AI response...');
    const response = await generateResponse(message, history || []);
    console.log('Raw AI response:', response);
    
    // Extract flowchart data and clean node text
    let cleanContent = response.content;
    let flowchartData = null;

    if (response.flowchart_data) {
      flowchartData = response.flowchart_data
        .replace(/```mermaid\n?|```/g, '')
        .replace(/\[(.*?)\]/g, (match, p1) => `[${p1.replace(/\s+/g, '_')}]`)
        .replace(/\((.*?)\)/g, (match, p1) => `(${p1.replace(/\s+/g, '_')})`)
        .trim();
      console.log('Found flowchart data in response object:', flowchartData);
    } else {
      const mermaidMatch = response.content.match(/```mermaid([\s\S]*?)```/);
      if (mermaidMatch) {
        flowchartData = mermaidMatch[1]
          .replace(/\[(.*?)\]/g, (match, p1) => `[${p1.replace(/\s+/g, '_')}]`)
          .replace(/\((.*?)\)/g, (match, p1) => `(${p1.replace(/\s+/g, '_')})`)
          .trim();
        cleanContent = response.content.replace(/```mermaid[\s\S]*?```/g, '').trim();
        console.log('Extracted flowchart data from content:', flowchartData);
      }
    }

    console.log('Final flowchart data:', flowchartData);

    // Save to Supabase
    const { error: aiMessageError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      content: cleanContent,
      role: 'assistant',
      flowchart_data: flowchartData
    });

    if (aiMessageError) throw aiMessageError;

    return NextResponse.json({
      content: cleanContent,
      flowchart_data: flowchartData,
      conversation_id: conversationId
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}