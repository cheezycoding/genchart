'use client'

import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import ConversationSidebar from './conversation-sidebar'
import { useSidebar } from '@/context/SidebarContext'

export default function SidebarButton() {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="mr-4 z-50"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar with Conversations */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border pt-16 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="h-full" onClick={(e) => e.stopPropagation()}>
              <ConversationSidebar />
            </div>
          </div>
        </>
      )}
    </>
  )
} 