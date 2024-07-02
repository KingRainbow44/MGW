import { create } from "zustand";

export type SettingsStore = {
    showMusicPlayer: boolean;
};
const useSettings = create<SettingsStore>()(() => ({
    showMusicPlayer: true
}));

export default useSettings;
