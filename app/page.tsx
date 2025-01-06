'use client';

import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link"; 
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';

export default function Home() { 
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setIsOpen } = useSidebar();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl lg:text-4xl font-bold">
          Welcome to GenChart
        </h1>
        <p className="text-center text-lg max-w-[600px]">
          Turn conversations into flowcharts, effortlessly, <span className="">powered </span>by <span className="font-bold">AI</span>.
        </p>
        <div className="flex gap-4">
          <RainbowButton  asChild className="px-6">
            <Link  href="/new">
              New Chat
            </Link>
          </RainbowButton>
          {!loading && (
            user ? (
              <RainbowButton 
                className="px-6"
                
                onClick={() => setIsOpen(true)}
              >
                See Conversations
              </RainbowButton>
            ) : (
              <RainbowButton asChild className="px-6">
                <Link href="/sign-up">
                  Sign Up
                </Link>
              </RainbowButton>
            )
          )}
        </div>
      </div>
    </div>
  );
}
