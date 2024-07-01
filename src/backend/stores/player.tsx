import { create } from "zustand";
import { Howl } from "howler";

import Laudiolin from "@backend/api/laudiolin.ts";
import type { TrackInfo } from "@backend/types.ts";

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

    pause: () => void;
    resume: () => void;
    seek: (time: number) => void;
    play: (track: TrackInfo) => void;
};
const usePlayer = create<PlayerStore>()(() => ({
    handle: undefined,

    currentlyPlaying: undefined,
    progress: 0,
    volume: 1,

    paused(): boolean {
        return !this.handle?.playing();
    },
    duration(): number | undefined {
        return this.handle?.duration();
    },

    pause(): void {
        this.handle?.pause();
    },
    resume(): void {
        this.handle?.play();
    },
    seek(time: number): void {
        this.handle?.seek(time);
    },
    play(track: TrackInfo): void {
        if (this.handle) {
            this.handle.stop();
        }

        this.currentlyPlaying = track;
        this.handle = new Howl({
            src: [Laudiolin.getTrackUrl(track)],
            volume: 0.05,
            html5: true
        });

        this.handle.play();
    }
}));

export default usePlayer;
