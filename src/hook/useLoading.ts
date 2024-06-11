import { create } from 'zustand'

interface LoadingState {
    loading: boolean
    setLoadingFalse: (status: boolean) => void
    setLoadingTrue: (status: boolean) => void
  }
  
  export const useLoadingStore = create<LoadingState>()((set) => ({
    loading: false,
    setLoadingFalse: (by) => set((state) => ({ loading: false})),
    setLoadingTrue: (by) => set((state) => ({ loading: true})),
  }))