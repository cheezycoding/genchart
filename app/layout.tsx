import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import SidebarButton from '@/components/sidebar-button'
import { SidebarProvider } from '@/context/SidebarContext';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <main className="min-h-screen flex flex-col">
              <nav className="w-full border-b border-border h-16">
                <div className="h-full px-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 ">
                    <SidebarButton />
                    <Link href="/" className="font-semibold">
                      GenChart
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    <ThemeSwitcher />
                  </div>
                </div>
              </nav>

              <div className="flex-1">
                {children}
              </div>

              <footer className="border-t border-border">
                <div className="py-6 px-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Powered by{" "}
                    
                      Wazir Labs
                 
                  </p>
                  <ThemeSwitcher />
                </div>
              </footer>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
