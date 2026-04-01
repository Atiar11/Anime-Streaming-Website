import { create } from "zustand";

const useSearchStore = create((set) => ({
	searchQuery: "",
	setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

export default useSearchStore;
