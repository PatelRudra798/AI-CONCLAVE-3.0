import { useEffect } from 'react';

export default function useTheme() {
  const isDark = true;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }, []);

  const toggle = () => {};
  return { isDark, toggle };
}
