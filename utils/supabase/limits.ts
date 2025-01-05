import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function checkUserLimits(userId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Check if user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (userData?.role === 'admin') {
    return { allowed: true };
  }

  // Count user's conversations
  const { count: conversationCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  // Count user's messages
  const { count: messageCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  return {
    allowed: (conversationCount || 0) < 1 && (messageCount || 0) < 5,
    conversationCount: conversationCount || 0,
    messageCount: messageCount || 0,
    remaining: {
      conversations: Math.max(0, 1 - (conversationCount || 0)),
      messages: Math.max(0, 5 - (messageCount || 0))
    }
  };
} 