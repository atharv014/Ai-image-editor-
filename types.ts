export interface FilterState {
  brightness: number; // 0-200, default 100
  contrast: number;   // 0-200, default 100
  saturation: number; // 0-200, default 100
  blur: number;       // 0-20, default 0
  grayscale: number;  // 0-100, default 0
  sepia: number;      // 0-100, default 0
}

export const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
};

export interface HistoryItem {
  imageData: string; // Base64
  filters: FilterState;
}

export enum ToolMode {
  SELECT = 'SELECT',
  CROP = 'CROP', // Placeholder for future
  AI_EDIT = 'AI_EDIT',
  FILTERS = 'FILTERS',
}

export interface AIState {
  isGenerating: boolean;
  error: string | null;
  prompt: string;
}
