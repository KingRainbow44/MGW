import { create } from "zustand";
import { Howl } from "howler";

import Laudiolin from "@backend/api/laudiolin.ts";
import type { TrackInfo } from "@backend/types.ts";

Howler.volume(0.05);

setInterval(() => {
    const state = usePlayer.getState();
    if (!state.handle) return;

    usePlayer.setState({ progress: state.handle.seek() });
}, 250);

export type PlayerStore = {
    handle?: Howl;

    currentlyPlaying?: TrackInfo;
    progress: number;
    volume: number;

    paused: () => boolean;
    duration: () => number | undefined;

    stop: () => void;
    pause: () => void;
    resume: () => void;
    seek: (time: number) => void;
    play: (track: TrackInfo, autoPlay: boolean) => void;
};
const usePlayer = create<PlayerStore>()((set, get) => ({
    handle: undefined,

    currentlyPlaying: undefined,
    progress: 0,
    volume: 1,

    paused: () => !get().handle?.playing(),
    duration: () => get().handle?.duration(),

    stop: () => get().handle?.stop(),
    pause: () => get().handle?.pause(),
    resume: () => get().handle?.play(),
    seek: (time: number) => get().handle?.seek(time),
    play: (track: TrackInfo, autoPlay: boolean) => {
        Howler.unload();

        const handle = new Howl({
            src: [Laudiolin.getTrackUrl(track)],
            volume: 1,
            html5: true,
            autoplay: autoPlay
        });
        handle.once("play", () => {
            set({ progress: 0 });
        });
        handle.play();

        set({ handle, currentlyPlaying: track });
    }
}));

export default usePlayer;
