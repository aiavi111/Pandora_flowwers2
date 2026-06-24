'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  ids: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id) => {
        const ids = get().ids;
        if (ids.includes(id)) {
          set({ ids: ids.filter((i) => i !== id) });
        } else {
          set({ ids: [...ids, id] });
        }
      },

      isFavorite: (id) => get().ids.includes(id),

      clear: () => set({ ids: [] }),
    }),
    { name: 'pandora-favorites' }
  )
);
