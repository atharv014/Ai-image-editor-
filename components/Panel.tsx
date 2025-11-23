import React from 'react';
import { FilterState, ToolMode, DEFAULT_FILTERS } from '../types';
import { Wand2, RefreshCcw, Loader2, Info } from 'lucide-react';

interface PanelProps {
  mode: ToolMode;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  aiPrompt: string;
  setAiPrompt: (s: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onResetFilters: () => void;
}

const SliderControl: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  unit?: string;
}> = ({ label, value, min, max, onChange, unit = "" }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-xs text-gray-500 font-mono">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
    />
  </div>
);

const Panel: React.FC<PanelProps> = ({
  mode,
  filters,
  setFilters,
  aiPrompt,
  setAiPrompt,
  onGenerate,
  isGenerating,
  onResetFilters
}) => {
  const handleFilterChange = (key: keyof FilterState, value: number) => {
    setFilters({ ...filters, [key]: value });
  };

  if (mode === ToolMode.SELECT) {
     return (
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 flex flex-col h-full overflow-y-auto">
             <h2 className="text-lg font-semibold text-white mb-2">Project Info</h2>
             <p className="text-gray-400 text-sm mb-6">Upload an image to get started. Use the toolbar to apply adjustments or AI edits.</p>
             
             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div className="text-sm text-gray-300">
                        <p className="font-medium text-white mb-1">Tip</p>
                        <p>Changes made in the 'Adjust' tab are visual only until you apply an AI edit or download the image.</p>
                    </div>
                </div>
             </div>
        </div>
     )
  }

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full overflow-hidden transition-all">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {mode === ToolMode.FILTERS ? 'Adjustments' : 'Generative Edit'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {mode === ToolMode.FILTERS && (
          <div className="animate-fade-in">
            <SliderControl
              label="Brightness"
              value={filters.brightness}
              min={0}
              max={200}
              onChange={(v) => handleFilterChange('brightness', v)}
              unit="%"
            />
            <SliderControl
              label="Contrast"
              value={filters.contrast}
              min={0}
              max={200}
              onChange={(v) => handleFilterChange('contrast', v)}
              unit="%"
            />
            <SliderControl
              label="Saturation"
              value={filters.saturation}
              min={0}
              max={200}
              onChange={(v) => handleFilterChange('saturation', v)}
              unit="%"
            />
             <div className="h-px bg-gray-800 my-6" />
             <SliderControl
              label="Blur"
              value={filters.blur}
              min={0}
              max={20}
              onChange={(v) => handleFilterChange('blur', v)}
              unit="px"
            />
             <SliderControl
              label="Grayscale"
              value={filters.grayscale}
              min={0}
              max={100}
              onChange={(v) => handleFilterChange('grayscale', v)}
              unit="%"
            />
            <SliderControl
              label="Sepia"
              value={filters.sepia}
              min={0}
              max={100}
              onChange={(v) => handleFilterChange('sepia', v)}
              unit="%"
            />

            <button
              onClick={onResetFilters}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <RefreshCcw className="w-3 h-3" />
              Reset Adjustments
            </button>
          </div>
        )}

        {mode === ToolMode.AI_EDIT && (
          <div className="animate-fade-in flex flex-col gap-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 text-sm text-indigo-200">
              Describe how you want to change the image. The AI will transform the image while maintaining its structure.
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase">Prompt</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., Make it look like a cyberpunk city, Add fireworks in the sky..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                disabled={isGenerating}
              />
            </div>

            <button
              onClick={onGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              className={`
                relative w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 overflow-hidden group
                ${isGenerating || !aiPrompt.trim() ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25'}
              `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate</span>
                </>
              )}
            </button>
            
            {/* Quick Prompts */}
            <div className="mt-4">
                 <label className="text-xs font-medium text-gray-400 uppercase mb-2 block">Suggestions</label>
                 <div className="flex flex-wrap gap-2">
                    {["Turn into a sketch", "Cyberpunk style", "Oil painting", "Make it snowy"].map(p => (
                        <button
                            key={p}
                            onClick={() => setAiPrompt(p)}
                            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors"
                        >
                            {p}
                        </button>
                    ))}
                 </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;
