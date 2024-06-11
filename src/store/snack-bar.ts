import {create} from 'zustand';

interface State {
    text: string;
    isShow: boolean;
    toggleSnackBar: (isShow: boolean, text: string) => void;
}

export const useSnackBar = create<State>(set => ({
    text: '',
    isShow: false,
    toggleSnackBar: (isShow: boolean, text: string) => set(() => ({isShow: isShow, text: text})),
  }));