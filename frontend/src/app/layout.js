import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prompt Playground",
  description: "Prompt Engineering Playground - Assignment #2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors`}>
        <ThemeProvider>
          <div className="flex">
            {/* Sidebar - har page pe dikhega (hidden on mobile) */}
            <Sidebar />

            {/* Main Content - remove left margin on mobile, add bottom padding for mobile nav */}
            <main className="ml-0 md:ml-56 flex-1 min-h-screen p-6 pb-20 md:pb-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}