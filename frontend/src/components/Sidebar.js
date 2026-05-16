'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

const navItems = [
  { href: '/', icon: '⚡', label: 'Playground' },
  { href: '/compare', icon: '⚖️', label: 'Compare' },
  { href: '/sweep', icon: '📊', label: 'Sweep' },
  { href: '/library', icon: '📚', label: 'Library' },
  { href: '/history', icon: '🕐', label: 'History' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex-col z-50 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-yellow-400">🧪 PromptLab</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prompt Engineering Playground</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
                  ${isActive
                    ? 'bg-yellow-400 text-gray-900 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}>
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm font-medium"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Branding */}
          <div className="text-xs text-gray-600 dark:text-gray-500 text-center">
            <p>Assignment #2</p>
            <p className="text-yellow-400 mt-1">Excellence Technologies</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs py-2 rounded-t-md transition-colors
                  ${isActive ? 'text-yellow-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                <span className={`text-lg ${isActive ? 'text-yellow-400' : ''}`}>{item.icon}</span>
                <span className="truncate w-full text-[11px]">{item.label}</span>
              </Link>
            );
          })}
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center gap-1 text-xs py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            title="Toggle theme"
          >
            <span className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="text-[11px]">Theme</span>
          </button>
        </div>
      </nav>
    </>
  );
}