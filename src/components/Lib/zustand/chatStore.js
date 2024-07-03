import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { database } from "../Firebase";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null, //State
  user: null, //State
  isCurrentUserBlocked: false, //State
  isReceiverBlocked: false, //State
  user: null, //State
  //   Action
  changeChat: async (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // CHECK IF CURRENT USER IS BLOCKED
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
}));
