'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PlusCircle, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export default function ConversationSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function loadConversations() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/sign-in');
          return;
        }

        const { data: conversations, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setConversations(conversations || []);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();

    // Set up real-time subscription
    const channel = supabase
      .channel('conversation_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations' 
        }, 
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const handleNewChat = () => {
    router.push('/new');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2"
          variant="ghost"
        >
          <PlusCircle size={16} />
          <span>New Chat</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <Button
                key={conv.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === `/chat/${conv.id}` && "bg-accent"
                )}
                asChild
              >
                <Link href={`/chat/${conv.id}`}>
                  <MessageSquare size={16} />
                  <span className="truncate">{conv.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 