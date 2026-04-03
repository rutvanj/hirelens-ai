import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Technical Project Evaluator",
  description: "AI-powered technical evaluation aligned with industry expectations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background flex flex-col`}>
        {/* Global Navigation Shell */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex h-16 items-center px-4 md:px-6">
            <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              <span className="text-primary">{"{ }"}</span> Evaluator
            </div>
            <nav className="ml-auto flex gap-4 sm:gap-6">
              <a className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" href="/">
                Home
              </a>
              <a className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" href="/analyze">
                New Analysis
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-border py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>Built with Next.js, explicitly no emojis.</p>
            <p className="font-medium">Strict data hierarchy compliance.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
