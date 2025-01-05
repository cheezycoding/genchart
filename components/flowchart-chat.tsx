'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  flowchart?: string;
}

interface FlowchartChatProps {
  onFlowchartUpdate: (flowchart: string) => void;
  conversationId: string | null;
}

// Mermaid syntax cleaning function
const cleanMermaidSyntax = (flowchartData: string) => {
  // Remove any mermaid code block markers
  let cleaned = flowchartData.replace(/```mermaid\n?|```/g, '').trim();
  
  // Remove the class definition lines that are causing issues
  cleaned = cleaned.split('\n')
    .filter(line => !line.includes('classDef') && !line.includes('class '))
    .join('\n');
  
  // Clean up node text by replacing spaces with underscores in node definitions
  cleaned = cleaned
    .replace(/\[(.*?)\]/g, (match, p1) => `[${p1.replace(/\s+/g, '_')}]`)
    .replace(/\((.*?)\)/g, (match, p1) => `(${p1.replace(/\s+/g, '_')})`);
  
  console.log('Cleaned mermaid syntax:', cleaned);
  return cleaned;
};

export default function FlowchartChat({ onFlowchartUpdate, conversationId }: FlowchartChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "nearest"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      fetchConversationHistory();
    }
  }, [conversationId]);

  const fetchConversationHistory = async () => {
    if (!conversationId) return;
    
    const supabase = createClient();
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data.map(msg => ({
        role: msg.role,
        content: msg.content,
        flowchart: msg.flowchart_data
      })));
      
      // Get the last assistant message with a flowchart
      const lastAssistantMessage = [...data]
        .reverse()
        .find(msg => msg.role === 'assistant' && msg.flowchart_data);

      if (lastAssistantMessage?.flowchart_data) {
        // Clean the flowchart data before updating
        const cleanedFlowchart = cleanMermaidSyntax(lastAssistantMessage.flowchart_data);
        onFlowchartUpdate(cleanedFlowchart);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !conversationId) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage 
    }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.content,
          flowchart: data.flowchart_data
        }]);

        // Clean the flowchart data before updating
        if (data.flowchart_data) {
          const cleanedFlowchart = cleanMermaidSyntax(data.flowchart_data);
          onFlowchartUpdate(cleanedFlowchart);
        }
      } else {
        console.error('Response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-foreground/10 scrollbar-track-transparent hover:scrollbar-thumb-foreground/20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-foreground/5 ml-8'
                : 'bg-foreground/10 mr-8'
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'AI'}
            </div>
            <div className="text-foreground/80 whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="p-4 bg-foreground/10 rounded-lg mr-8">
            <div className="font-semibold mb-1">AI</div>
            <div className="text-foreground/80">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-4 border-t border-foreground/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-background rounded-lg border border-foreground/10 
                     focus:border-foreground/20 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-foreground text-background rounded-lg
                     disabled:opacity-50 hover:bg-foreground/90 transition-colors"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}