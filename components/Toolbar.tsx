import React from 'react';
import { MousePointer, Wand2, Sliders, ImagePlus, RotateCcw, Download } from 'lucide-react';
import { ToolMode } from '../types';

interface ToolbarProps {
  currentMode: ToolMode;
  setMode: (mode: ToolMode) => void;
  onUndo: () => void;
  canUndo: boolean;
  onDownload: () => void;
  onUploadClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentMode,
  setMode,
  onUndo,
  canUndo,
  onDownload,
  onUploadClick
}) => {
  const tools = [
    { id: ToolMode.SELECT, icon: MousePointer, label: 'View' },
    { id: ToolMode.FILTERS, icon: Sliders, label: 'Adjust' },
    { id: ToolMode.AI_EDIT, icon: Wand2, label: 'AI Edit' },
  ];

  return (
    <div className="w-20 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-6 gap-6 z-20">
      <div className="mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Wand2 className="text-white w-6 h-6" />
        </div>
      </div>

      <div className="w-full px-2 flex flex-col gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setMode(tool.id)}
            className={`
              w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200
              ${currentMode === tool.id 
                ? 'bg-gray-800 text-indigo-400 ring-1 ring-gray-700' 
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}
            `}
            title={tool.label}
          >
            <tool.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto w-full px-2 flex flex-col gap-4">
         <button
          onClick={onUploadClick}
          className="w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-gray-900 hover:text-green-400 transition-all"
          title="New Image"
        >
          <ImagePlus className="w-6 h-6" />
        </button>

        <div className="h-px bg-gray-800 w-full" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            w-full aspect-square rounded-xl flex items-center justify-center transition-all
            ${canUndo 
              ? 'text-gray-400 hover:bg-gray-900 hover:text-gray-200' 
              : 'text-gray-700 cursor-not-allowed'}
          `}
          title="Undo"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <button
          onClick={onDownload}
          className="w-full aspect-square rounded-xl bg-gray-800 text-gray-200 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
          title="Download"
        >
          <Download className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
