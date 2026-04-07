import { Moon, Sun, Monitor } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = [
      'light',
      'dark',
      'system',
    ];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const Icon = themeIcons[theme];

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={cycleTheme}
      title={`Theme: ${themeLabels[theme]}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
