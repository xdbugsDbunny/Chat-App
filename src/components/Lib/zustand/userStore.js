import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { database } from "../Firebase";

export const useUserStore = create((set) => ({
  currentUser: null, //State
  isLoading: true, //State
  //   Action
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(database, "users", uid);
      const response = await getDoc(docRef);

      if (response.exists()) {
        set({ currentUser: response.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.log(error);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
