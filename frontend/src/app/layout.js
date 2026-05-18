import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Prompt Playground",
  description: "Prompt Engineering Playground - Assignment #2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
        <ThemeProvider>
          <div className="flex">
            <Sidebar />
            <main className="ml-0 md:ml-56 flex-1 min-h-screen p-6 pb-20 md:pb-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}