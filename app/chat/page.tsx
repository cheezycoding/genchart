// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import MermaidViewer from '@/components/mermaid-viewer';
// import FlowchartChat from '@/components/flowchart-chat';
// import { createClient } from '@/utils/supabase/client';

// export default function TestMermaid() {
//   const [currentFlowchart, setCurrentFlowchart] = useState('');
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const supabase = createClient();

//   useEffect(() => {
//     async function initializeConversation() {
//       try {
//         const urlConversationId = searchParams.get('conversation_id');

//         if (urlConversationId) {
//           const { data: conversation } = await supabase
//             .from('conversations')
//             .select('*')
//             .eq('id', urlConversationId)
//             .single();

//           if (conversation) {
//             setConversationId(urlConversationId);
            
//             const { data: lastMessage } = await supabase
//               .from('messages')
//               .select('flowchart_data')
//               .eq('conversation_id', urlConversationId)
//               .eq('role', 'assistant')
//               .order('created_at', { ascending: false })
//               .limit(1)
//               .single();

//             if (lastMessage?.flowchart_data) {
//               setCurrentFlowchart(lastMessage.flowchart_data);
//             }
//           } else {
//             await createNewConversation();
//           }
//         } else {
//           await createNewConversation();
//         }
//       } catch (error) {
//         console.error('Error initializing conversation:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     initializeConversation();
//   }, [searchParams]);

//   async function createNewConversation() {
//     const { data: newConversation } = await supabase
//       .from('conversations')
//       .insert({
//         title: 'New Conversation',
//         user_id: (await supabase.auth.getUser()).data.user?.id
//       })
//       .select()
//       .single();

//     if (newConversation) {
//       setConversationId(newConversation.id);
//       router.replace(`/mermaid-test?conversation_id=${newConversation.id}`);
//     }
//   }

//   const handleFlowchartUpdate = (flowchart: string) => {
//     setCurrentFlowchart(flowchart);
//   };

//   if (isLoading) {
//     return (
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground/50"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="absolute inset-0 mt-16"> {/* Change absolute to fixed */}
//       <div className="h-[calc(100%-4rem)] container mx-auto px-4 pt-8"> {/* Explicit height calculation */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"> {/* Use h-full instead of calc */}
//           <div className="w-full h-full flex flex-col overflow-hidden"> {/* Add overflow-hidden */}
//             <h2 className="text-xl font-semibold mb-4 flex-none">Chat</h2>
//             <div className="flex-1 min-h-0 overflow-hidden"> {/* Add overflow-hidden */}
//               <div className="h-full bg-muted/50 rounded-xl border border-foreground/10">
//                 <FlowchartChat 
//                   onFlowchartUpdate={handleFlowchartUpdate}
//                   conversationId={conversationId}
//                 />
//               </div>
//             </div>
//           </div>
  
//           <div className="w-full h-full flex flex-col overflow-hidden"> {/* Add overflow-hidden */}
//             <h2 className="text-xl font-semibold mb-4 flex-none">Preview</h2>
//             <div className="flex-1 min-h-0 overflow-hidden"> {/* Add overflow-hidden */}
//               <div className="h-full bg-muted/50 rounded-xl border border-foreground/10 relative">
//                 {currentFlowchart ? (
//                   <MermaidViewer 
//                     markdown={currentFlowchart} 
//                     className="absolute inset-0"
//                   />
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-foreground/50">
//                     Start chatting to generate a flowchart
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MermaidViewer from '@/components/mermaid-viewer';
import FlowchartChat from '@/components/flowchart-chat';
import { createClient } from '@/utils/supabase/client';

export default function ChatPage() {
  const [currentFlowchart, setCurrentFlowchart] = useState('');
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
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('flowchart_data')
            .eq('conversation_id', conversationId)
            .eq('role', 'assistant')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (lastMessage?.flowchart_data) {
            setCurrentFlowchart(lastMessage.flowchart_data);
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
  }, [conversationId]);

  const handleFlowchartUpdate = (flowchart: string) => {
    setCurrentFlowchart(flowchart);
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