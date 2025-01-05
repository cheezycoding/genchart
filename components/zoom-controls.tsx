import { Plus, Minus, RotateCcw } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  currentZoom: number;
  showReset: boolean;
}

export default function ZoomControls({ 
  onZoomIn, 
  onZoomOut, 
  onReset,
  currentZoom,
  showReset 
}: ZoomControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-foreground/10">
      <button
        onClick={onZoomOut}
        className="p-1 hover:bg-muted rounded-md transition-colors"
        aria-label="Zoom out"
      >
        <Minus size={16} />
      </button>
      <span className="text-sm font-mono w-16 text-center">
        {Math.round(currentZoom * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="p-1 hover:bg-muted rounded-md transition-colors"
        aria-label="Zoom in"
      >
        <Plus size={16} />
      </button>
      {showReset && (
        <>
          <div className="w-px h-4 bg-foreground/10" /> {/* Divider */}
          <button
            onClick={onReset}
            className="p-1 hover:bg-muted rounded-md transition-colors text-foreground/80 hover:text-foreground"
            aria-label="Reset view"
          >
            <RotateCcw size={16} />
          </button>
        </>
      )}
    </div>
  );
}