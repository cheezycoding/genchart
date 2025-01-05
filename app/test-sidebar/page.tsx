'use client';

import ConversationSidebar from '@/components/conversation-sidebar';

export default function TestSidebar() {
  return (
    <div className="flex h-screen">
      <ConversationSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Sidebar Test Page</h1>
        <p>Select a conversation from the sidebar or create a new one.</p>
      </div>
    </div>
  );
} 