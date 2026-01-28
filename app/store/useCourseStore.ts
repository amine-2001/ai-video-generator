import { create } from 'zustand';

interface CourseState {
  durationbySlideId: Record<string, number>;
  isCalculated: boolean;
  setDurations: (durations: Record<string, number>) => void;
  reset: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  durationbySlideId: {},
  isCalculated: false,
  setDurations: (durations) => set({ 
    durationbySlideId: durations, 
    isCalculated: true 
  }),
  reset: () => set({ durationbySlideId: {}, isCalculated: false }),
}));