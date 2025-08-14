import { create } from 'zustand'

export const useFilters = create(set => ({
  preset: 'last24h',
  customFrom: null,
  customTo: null,
  setPreset: (p) => set({ preset: p, customFrom: null, customTo: null }),
  setCustomRange: (f, t) => set({ preset: null, customFrom: f, customTo: t }),
  tableFilters: { interfaceName: '', integrationKey: '', status: '', severity: '', search: '' },
  setTableFilter: (k, v) => set(state => ({ tableFilters: { ...state.tableFilters, [k]: v } }))
}))
