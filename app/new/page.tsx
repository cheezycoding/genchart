'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewChatPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function createAndRedirect() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/sign-in'); // Redirect to sign in if no user
          return;
        }

        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            title: 'New Conversation',
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        if (newConversation) {
          router.replace(`/chat/${newConversation.id}`);
        }
      } catch (error) {
        console.error('Error creating new conversation:', error);
      }
    }

    createAndRedirect();
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground/50"></div>
    </div>
  );
}