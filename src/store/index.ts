import { create } from 'zustand'

export interface Project {
  id: string
  name: string
  description: string
  industry: string
}

export interface AppState {
  currentProject: Project | null
  currentIdea: string | null
  innovationIndex: number
  timelineProgress: number
  setCurrentProject: (p: Project) => void
  setIdea: (idea: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentProject: null,
  currentIdea: null,
  innovationIndex: 84,
  timelineProgress: 45,
  setCurrentProject: (p) => set({ currentProject: p }),
  setIdea: (idea) => set({ currentIdea: idea })
}))
