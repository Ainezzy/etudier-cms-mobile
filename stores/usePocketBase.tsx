import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import PocketBase, { AsyncAuthStore, AuthRecord } from "pocketbase";
import Client from "pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PocketBaseStore {
  instance?: Client;
  isLoggedIn?: boolean;
  user_record?: AuthRecord;
  initializePocketBase: () => void;
  setIsLoggedIn: (val: boolean) => void;
  setUserRecord: (record: any) => void;
}

const usePocketBase = create<PocketBaseStore>()(
  immer((set, get) => ({
    instance: undefined,
    isLoggedIn: undefined,
    user_record: undefined,
    initializePocketBase: async () => {
      const store = new AsyncAuthStore({
        save: async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
        initial: (await AsyncStorage.getItem("pb_auth")) || "",
        clear: async () => AsyncStorage.removeItem("pb_auth"),
      });

      set((state) => {
        state.instance = new PocketBase(
          "https://etudier-cms.pockethost.io/",
          store
        );
      });

      set((state) => {
        state.isLoggedIn = get().instance?.authStore.isValid ?? false;
        state.user_record = get().instance?.authStore.isValid
          ? get().instance!.authStore.record
          : null;
      });

    },
    setIsLoggedIn: (val: boolean) => {
      set((state) => {
        state.isLoggedIn = val;
      });
    },
    setUserRecord: (record: any) => {
      set((state) => {
        state.user_record = record;
      });
    },
  }))
);

export default usePocketBase;
