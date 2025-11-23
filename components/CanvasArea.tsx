import React from 'react';
import { FilterState } from '../types';
import { ImagePlus } from 'lucide-react';

interface CanvasAreaProps {
  imageData: string | null;
  filters: FilterState;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  imageData,
  filters,
  onUpload,
  isProcessing
}) => {
  // Construct CSS filter string dynamically
  const filterString = `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    saturate(${filters.saturation}%)
    blur(${filters.blur}px)
    grayscale(${filters.grayscale}%)
    sepia(${filters.sepia}%)
  `;

  return (
    <div className="flex-1 bg-gray-950 relative overflow-hidden flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)',
             backgroundSize: '24px 24px'
           }} 
      />

      {!imageData ? (
        <div className="relative z-10 text-center">
          <label className="cursor-pointer group">
            <div className="w-64 h-64 border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center bg-gray-900/50 hover:bg-gray-800/50 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Upload Image</h3>
              <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
          </label>
        </div>
      ) : (
        <div className="relative z-10 max-w-full max-h-full shadow-2xl rounded-sm overflow-hidden ring-1 ring-gray-800">
          <img
            src={imageData}
            alt="Work in progress"
            className="max-w-full max-h-[85vh] object-contain transition-all duration-200"
            style={{ filter: filterString }}
          />
          {isProcessing && (
             <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="mt-4 text-indigo-200 font-medium animate-pulse">Magic in progress...</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
