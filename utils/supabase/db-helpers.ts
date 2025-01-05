import { createClient } from '@/utils/supabase/server';

export async function createNewConversation(userId: string, title: string) {
  const supabase = await createClient();
  
  return await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title: title,
    })
    .select()
    .single();
}

export async function saveMessage(
  conversationId: string, 
  content: string, 
  role: 'user' | 'assistant',
  flowchart_data?: string
) {
  const supabase = await createClient();
  
  return await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      content: content,
      role: role,
      flowchart_data: flowchart_data
    });
}

export async function getConversationHistory(conversationId: string) {
  const supabase = await createClient();
  
  return await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
}