// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import mermaid from 'mermaid';

// interface MermaidViewerProps {
//   markdown: string;
//   className?: string;
// }

// export default function MermaidViewer({ markdown, className = '' }: MermaidViewerProps) {
//   const [zoom, setZoom] = useState(1);
//   const [optimalZoom, setOptimalZoom] = useState(1);
//   const [isPanning, setIsPanning] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const lastPosition = useRef({ x: 0, y: 0 });
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [error, setError] = useState<string | null>(null);

//   const calculateBounds = (newPosition: { x: number; y: number }) => {
//     if (!containerRef.current) return newPosition;

//     const container = containerRef.current;
//     const diagram = container.querySelector('.mermaid svg');
//     if (!diagram) return newPosition;

//     const containerBounds = container.getBoundingClientRect();
//     const diagramBounds = diagram.getBoundingClientRect();

//     const scaledWidth = diagramBounds.width * zoom;
//     const scaledHeight = diagramBounds.height * zoom;

//     const maxX = Math.max(scaledWidth - containerBounds.width, 0) / 2;
//     const maxY = Math.max(scaledHeight - containerBounds.height, 0) / 2;

//     return {
//       x: Math.min(Math.max(newPosition.x, -maxX), maxX),
//       y: Math.min(Math.max(newPosition.y, -maxY), maxY)
//     };
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (e.button === 0) {
//       e.preventDefault();
//       setIsPanning(true);
//       lastPosition.current = { x: e.clientX, y: e.clientY };
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (isPanning) {
//       e.preventDefault();
//       const deltaX = e.clientX - lastPosition.current.x;
//       const deltaY = e.clientY - lastPosition.current.y;
//       lastPosition.current = { x: e.clientX, y: e.clientY };

//       requestAnimationFrame(() => {
//         setPosition(prev => {
//           const newPosition = {
//             x: prev.x + deltaX,
//             y: prev.y + deltaY
//           };
//           return calculateBounds(newPosition);
//         });
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsPanning(false);
//   };

//   // Initialize mermaid once
//   useEffect(() => {
//     try {
//       mermaid.initialize({
//         startOnLoad: true,
//         theme: 'dark',
//         securityLevel: 'loose',
//         flowchart: {
//           htmlLabels: true,
//           curve: 'basis',
//           padding: 15
//         }
//       });
//     } catch (err) {
//       console.error('Mermaid initialization error:', err);
//     }
//   }, []);

//   // Render diagram and calculate optimal zoom
//   useEffect(() => {
//     if (!containerRef.current || !markdown) return;

//     const renderDiagram = async () => {
//       try {
//         // Clear previous content
//         containerRef.current!.innerHTML = '';

//         // Create wrapper
//         const wrapper = document.createElement('div');
//         wrapper.className = 'mermaid';
//         wrapper.textContent = markdown.replace(/```mermaid\n?|```/g, '').trim();
//         containerRef.current!.appendChild(wrapper);

//         // Render diagram
//         await mermaid.run();

//         // Calculate optimal zoom immediately after render
//         const containerBounds = containerRef.current.getBoundingClientRect();
//         const diagram = containerRef.current.querySelector('.mermaid svg');
        
//         if (diagram) {
//           const diagramBounds = diagram.getBoundingClientRect();
//           const scaleWidth = containerBounds.width / diagramBounds.width;
//           const scaleHeight = containerBounds.height / diagramBounds.height;
//           const newOptimalZoom = Math.min(scaleWidth, scaleHeight) * 0.9;
          
//           setOptimalZoom(newOptimalZoom);
//           setZoom(newOptimalZoom);
//           setPosition({ x: 0, y: 0 });
//         }

//         setError(null);
//       } catch (err) {
//         setError('Failed to render diagram. Please check the syntax.');
//         console.error('Mermaid render error:', err);
//       }
//     };

//     renderDiagram();
//   }, [markdown]);

//   const resetToOptimalZoom = () => {
//     setZoom(optimalZoom);
//     setPosition({ x: 0, y: 0 });
//   };

//   return (
//     <div className="relative w-full h-full">
//       <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 rounded-lg p-2 z-10">
//         <button 
//           onClick={() => setZoom(prev => Math.max(prev - (optimalZoom * 0.1), optimalZoom * 0.5))} 
//           className="p-1 hover:bg-foreground/10 rounded"
//         >
//           <span className="text-lg">-</span>
//         </button>
//         <span className="min-w-[3ch] text-center">
//           {Math.round((zoom / optimalZoom) * 100)}%
//         </span>
//         <button 
//           onClick={() => setZoom(prev => Math.min(prev + (optimalZoom * 0.1), optimalZoom * 2))} 
//           className="p-1 hover:bg-foreground/10 rounded"
//         >
//           <span className="text-lg">+</span>
//         </button>
//         <button onClick={resetToOptimalZoom} className="p-1 hover:bg-foreground/10 rounded ml-2">
//           <span className="text-sm">↺</span>
//         </button>
//       </div>

//       <div 
//         className={`absolute inset-0 ${className} cursor-grab ${isPanning ? 'cursor-grabbing' : ''}`}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//       >
//         <div
//           ref={containerRef}
//           style={{
//             transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
//             transformOrigin: 'center center',
//             transition: isPanning ? 'none' : 'transform 0.1s ease-out',
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             userSelect: 'none',
//             touchAction: 'none',
//           }}
//         />
        
//         {error && (
//           <div className="absolute inset-0 flex items-center justify-center bg-background/80">
//             <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 max-w-md">
//               <h3 className="font-semibold mb-2">Diagram Rendering Error</h3>
//               <p className="text-sm opacity-80">{error}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  markdown: string;
  className?: string;
}

export default function MermaidViewer({ markdown, className = '' }: MermaidViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [optimalZoom, setOptimalZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateBounds = (newPosition: { x: number; y: number }) => {
    if (!containerRef.current) return newPosition;

    const container = containerRef.current;
    const diagram = container.querySelector('.mermaid svg');
    if (!diagram) return newPosition;

    const containerBounds = container.getBoundingClientRect();
    const diagramBounds = diagram.getBoundingClientRect();

    const scaledWidth = diagramBounds.width * zoom;
    const scaledHeight = diagramBounds.height * zoom;

    const maxX = Math.max(scaledWidth - containerBounds.width, 0) / 2;
    const maxY = Math.max(scaledHeight - containerBounds.height, 0) / 2;

    return {
      x: Math.min(Math.max(newPosition.x, -maxX), maxX),
      y: Math.min(Math.max(newPosition.y, -maxY), maxY)
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;
      lastPosition.current = { x: e.clientX, y: e.clientY };

      requestAnimationFrame(() => {
        setPosition(prev => {
          const newPosition = {
            x: prev.x + deltaX,
            y: prev.y + deltaY
          };
          return calculateBounds(newPosition);
        });
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Initialize mermaid once
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        securityLevel: 'loose',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 15,
          useMaxWidth: false
        },
        logLevel: 5
      });
    } catch (err) {
      console.error('Mermaid initialization error:', err);
    }
  }, []);

  // Render diagram and calculate optimal zoom
  useEffect(() => {
    if (!containerRef.current || !markdown) return;

    const renderDiagram = async () => {
      try {
        // Clear previous content
        containerRef.current!.innerHTML = '';

        // Clean the markdown input
        const cleanedMarkdown = markdown.replace(/```mermaid\n?|```/g, '').trim();

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid';
        wrapper.textContent = cleanedMarkdown;
        containerRef.current!.appendChild(wrapper);

        // Wait for the next frame to ensure DOM is ready
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Render diagram
        try {
          await mermaid.run({
            querySelector: '.mermaid'
          });

          // Wait for the next frame to ensure SVG is rendered
          await new Promise(resolve => requestAnimationFrame(resolve));

          // Calculate optimal zoom immediately after render
          const containerBounds = containerRef.current?.getBoundingClientRect();
          const diagram = containerRef.current?.querySelector('.mermaid svg');
          
          if (containerRef.current && diagram && containerBounds) {
            const diagramBounds = diagram.getBoundingClientRect();
            const scaleWidth = containerBounds.width / diagramBounds.width;
            const scaleHeight = containerBounds.height / diagramBounds.height;
            const newOptimalZoom = Math.min(scaleWidth, scaleHeight) * 0.9;
            
            setOptimalZoom(newOptimalZoom);
            setZoom(newOptimalZoom);
            setPosition({ x: 0, y: 0 });
          }

          setError(null);
        } catch (renderError) {
          if (renderError && Object.keys(renderError).length > 0) {
            console.error('Mermaid render error:', renderError);
            throw renderError;
          }
        }
      } catch (err) {
        if (err && Object.keys(err).length > 0) {
          console.error('Mermaid processing error:', err);
          setError('Failed to render diagram. Please check the syntax.');
        } else {
          setError(null);
        }
      }
    };

    // Add a small delay before rendering
    const timeoutId = setTimeout(() => {
      renderDiagram();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [markdown]);

  const resetToOptimalZoom = () => {
    setZoom(optimalZoom);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 rounded-lg p-2 z-10">
        <button 
          onClick={() => setZoom(prev => Math.max(prev - (optimalZoom * 0.1), optimalZoom * 0.5))} 
          className="p-1 hover:bg-foreground/10 rounded"
        >
          <span className="text-lg">-</span>
        </button>
        <span className="min-w-[3ch] text-center">
          {Math.round((zoom / optimalZoom) * 100)}%
        </span>
        <button 
          onClick={() => setZoom(prev => Math.min(prev + (optimalZoom * 0.1), optimalZoom * 2))} 
          className="p-1 hover:bg-foreground/10 rounded"
        >
          <span className="text-lg">+</span>
        </button>
        <button onClick={resetToOptimalZoom} className="p-1 hover:bg-foreground/10 rounded ml-2">
          <span className="text-sm">↺</span>
        </button>
      </div>

      <div 
        className={`absolute inset-0 ${className} cursor-grab ${isPanning ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={containerRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            touchAction: 'none',
          }}
        />
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 max-w-md">
              <h3 className="font-semibold mb-2">Diagram Rendering Error</h3>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}