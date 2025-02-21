'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MermaidViewer from '@/components/mermaid-viewer';
import FlowchartChat from '@/components/flowchart-chat';
import { createClient } from '@/utils/supabase/client';

interface Message {
  flowchart_data: string;
  conversation_id: string;
  role: 'user' | 'assistant';
}

export default function ChatPage() {
  const [currentFlowchart, setCurrentFlowchart] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const conversationId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function initializeConversation() {
      try {
        const { data: conversation } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (conversation) {
          const { data: lastMessages } = await supabase
            .from('messages')
            .select('flowchart_data')
            .eq('conversation_id', conversationId)
            .eq('role', 'assistant')
            .order('created_at', { ascending: false })
            .limit(1);

          const lastMessage = lastMessages?.[0];

          console.log('Last message data:', lastMessage);
          console.log('Flowchart data type:', typeof lastMessage?.flowchart_data);

          if (lastMessage?.flowchart_data) {
            // Ensure we're setting a string
            const flowchartString = typeof lastMessage.flowchart_data === 'object' 
              ? JSON.stringify(lastMessage.flowchart_data)
              : String(lastMessage.flowchart_data);
            
            setCurrentFlowchart(flowchartString);
          }
        }
      } catch (error) {
        console.error('Error initializing conversation:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (conversationId) {
      initializeConversation();
    }
  }, [conversationId, supabase]);

  const handleFlowchartUpdate = (flowchart: string) => {
    console.log('Updating flowchart, type:', typeof flowchart);
    console.log('Flowchart content:', flowchart);
    
    // Ensure we're setting a string
    const flowchartString = typeof flowchart === 'object' 
      ? JSON.stringify(flowchart)
      : String(flowchart);

    setCurrentFlowchart(flowchartString);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground/50"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 mt-16">
      <div className="h-[calc(100%-4rem)] container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="w-full h-full flex flex-col overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 flex-none">Chat</h2>
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full bg-muted/50 rounded-xl border border-foreground/10">
                <FlowchartChat 
                  onFlowchartUpdate={handleFlowchartUpdate}
                  conversationId={conversationId}
                />
              </div>
            </div>
          </div>

          <div className="w-full h-full flex flex-col overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 flex-none">Preview</h2>
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full bg-muted/50 rounded-xl border border-foreground/10 relative">
                {currentFlowchart ? (
                  <MermaidViewer 
                    markdown={currentFlowchart} 
                    className="absolute inset-0"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-foreground/50">
                    Start chatting to generate a flowchart
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}