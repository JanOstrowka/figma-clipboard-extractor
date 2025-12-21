interface HeaderProps {
  onAboutClick: () => void;
}

export function Header({ onAboutClick }: HeaderProps) {
  return (
    <header>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Figma clipboard extractor
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Extract Figma clipboard data to add "Copy to Figma" buttons to your design system.{" "}
          <button
            onClick={onAboutClick}
            className="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            Learn more
          </button>
        </p>
      </div>
    </header>
  );
}
