'use client';

import { useState } from 'react';
import MermaidViewer from '@/components/mermaid-viewer';

const TEST_MARKDOWN = `graph TD;
    A[How to Make Coffee] --> B(Prepare the Coffee Maker)
    A --> C(Add Water)
    A --> D(Add Coffee Grounds)
    A --> E(Brew)
    A --> F(Serve)
    
    click A callback "How to Make Coffee"
    click B callback "Prepare the Coffee Maker"
    click C callback "Add Water"
    click D callback "Add Coffee Grounds"
    click E callback "Brew"
    click F callback "Serve"`;

export default function TestMermaid() {
  const [markdown, setMarkdown] = useState(TEST_MARKDOWN);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Mermaid Viewer Test</h1>
      
      {/* Markdown Input */}
      <div className="mb-4">
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-48 p-2 border rounded bg-muted"
        />
      </div>

      {/* Preview */}
      <div className="border rounded p-4 bg-muted min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <MermaidViewer markdown={markdown} />
      </div>
    </div>
  );
} 