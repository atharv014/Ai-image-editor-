import React, { useState, useCallback, useRef } from 'react';
import { DEFAULT_FILTERS, FilterState, ToolMode, HistoryItem } from './types';
import Toolbar from './components/Toolbar';
import Panel from './components/Panel';
import CanvasArea from './components/CanvasArea';
import { editImageWithGemini } from './services/geminiService';
import { processImageWithFilters, downloadImage } from './utils/imageUtils';

const App: React.FC = () => {
  // State
  const [currentMode, setCurrentMode] = useState<ToolMode>(ToolMode.FILTERS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Current active state (derived from history or defaults)
  const currentItem = currentHistoryIndex >= 0 ? history[currentHistoryIndex] : null;
  const imageData = currentItem?.imageData || null;
  const filters = currentItem?.filters || DEFAULT_FILTERS;
  
  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState("");

  // Helper to push new state to history
  const pushHistory = useCallback((newImageData: string, newFilters: FilterState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, { imageData: newImageData, filters: newFilters }];
    });
    setCurrentHistoryIndex(prev => prev + 1);
  }, [currentHistoryIndex]);

  // Handlers
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
           // Reset history on new upload
           setHistory([{ imageData: event.target.result, filters: DEFAULT_FILTERS }]);
           setCurrentHistoryIndex(0);
           setAiPrompt("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateFilters = (newFilters: FilterState) => {
    if (!imageData) return;
    
    // We update the current history item in place for smooth slider dragging,
    // effectively "debouncing" history pushes could be better but for now instant update:
    // Actually, creating a new history item on every slide is bad. 
    // Let's keep local state for filters and only commit to history on "Apply" or mode switch?
    // OR: just update the current item in the array directly for performance, 
    // but that breaks immutability for Undo. 
    // Simpler approach: Just update React state for display, but only push to history on MouseUp?
    // For this demo, let's just update state. A full undo implementation for sliders requires debounce.
    
    // Simplification for this task: Update the current history item directly (replace it).
    // Real "Undo" will just step back through discrete actions like "AI Edit" or "New Image".
    // If we want to undo filter changes, we need to push a new state.
    
    // Strategy: Update current item.
    const newHistory = [...history];
    newHistory[currentHistoryIndex] = { ...newHistory[currentHistoryIndex], filters: newFilters };
    setHistory(newHistory);
  };

  const handleResetFilters = () => {
      handleUpdateFilters(DEFAULT_FILTERS);
  }

  const handleAIEdit = async () => {
    if (!imageData || !aiPrompt.trim()) return;
    
    setIsProcessing(true);
    try {
      // 1. Bake current filters into the image so the AI sees what the user sees
      const bakedImage = await processImageWithFilters(imageData, filters);
      
      // 2. Send to Gemini
      const newImage = await editImageWithGemini(bakedImage, aiPrompt);
      
      // 3. Push new image to history. Reset filters because the "look" is now baked into the pixel data by the AI (mostly).
      // However, usually we might want to keep filters 0'd out or keep them if they are stylistic overlays. 
      // Let's reset filters to default to avoid double-application confusion.
      pushHistory(newImage, DEFAULT_FILTERS);
      setAiPrompt("");
    } catch (error) {
      alert("AI Editing Failed. Please try again or check your API Key.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!imageData) return;
    try {
      // Bake filters before download
      const result = await processImageWithFilters(imageData, filters);
      downloadImage(result);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
    }
  };

  const triggerUpload = () => {
     const input = document.querySelector('input[type="file"]') as HTMLInputElement;
     if (input) input.click();
  }

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden font-sans">
      <Toolbar 
        currentMode={currentMode} 
        setMode={setCurrentMode} 
        onUndo={handleUndo}
        canUndo={currentHistoryIndex > 0}
        onDownload={handleDownload}
        onUploadClick={triggerUpload}
      />
      
      <CanvasArea 
        imageData={imageData} 
        filters={filters} 
        onUpload={handleUpload}
        isProcessing={isProcessing}
      />
      
      <Panel 
        mode={currentMode}
        filters={filters}
        setFilters={handleUpdateFilters}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        onGenerate={handleAIEdit}
        isGenerating={isProcessing}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default App;
