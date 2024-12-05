import {create} from "zustand";

export enum ModalType {
  EDIT_USER_INFO,
}


interface ModelData {
}

interface ModalStore {
  type: ModalType | null;
  data: ModelData | null;
  isOpen: boolean;
  open: (type : ModalType, data?: ModelData) => void;
  close: () => void;
}

export const useModal = create<ModalStore>(
  (set) => ({
    type: null,
    isOpen: false,
    data: null,
    open(type, data) {
      set({
        isOpen: true, type , data
      });
    },
    close() {
      set({
        isOpen: false, type: null
      });
    },
  })
);