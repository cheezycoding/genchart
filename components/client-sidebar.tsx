'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import ConversationSidebar from './conversation-sidebar';

export default function ClientSidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-background border-r border-border transition-transform duration-200 ease-in-out z-50 pt-16`}>
        <ConversationSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar with Toggle Button */}
        <nav className="w-full border-b border-border h-16 fixed top-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="h-full max-w-7xl mx-auto flex items-center px-4">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              {children}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
} 