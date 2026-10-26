import { Activity, Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/hooks/use-theme";

const Header = () => {
  const { setTheme, theme } = useTheme();

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex min-h-19 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Activity className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h1 className="text-foreground truncate text-base font-semibold tracking-tight sm:text-lg">
              Windscope
            </h1>
            <p className="text-muted-foreground truncate text-xs sm:text-sm">
              Wind generation analytics
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Change appearance"
              title="Change appearance"
              className="size-9 shrink-0"
            >
              <ThemeIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              <DropdownMenuRadioItem value="light">
                <Sun className="mr-2 size-4" aria-hidden="true" />
                Light
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="dark">
                <Moon className="mr-2 size-4" aria-hidden="true" />
                Dark
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="system">
                <Monitor className="mr-2 size-4" aria-hidden="true" />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
