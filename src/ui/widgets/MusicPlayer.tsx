import { useEffect, useState } from "react";

import { MdSkipNext } from "react-icons/md";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";

import { FastAverageColor } from "fast-average-color";

import ProgressBar from "@components/ProgressBar.tsx";

import usePlayer from "@stores/player.ts";

import { random } from "@app/utils.ts";
import Laudiolin from "@backend/api/laudiolin.ts";
import { TrackInfo } from "@backend/types.ts";

import data from "@cfg/data.json";

/**
 * Returns a random track from the backup playlists.
 */
async function randomTrack(): Promise<TrackInfo> {
    const playlist = random(data.backupPlaylists);
    const tracks = await Laudiolin.getPlaylistTracks(playlist);

    return random(tracks);
}

/**
 * Fetches the current track to play.
 */
async function fetchCurrent(): Promise<TrackInfo> {
    const { onlineUsers } = await Laudiolin.getOnlineUsers();

    // Try to find the target user.
    const target = onlineUsers.find((user) => user.userId == data.userId);

    if (!target) {
        // Load an assortment of playlist tracks & pick a random one.
        return await randomTrack();
    } else {
        // Load the user's current track.
        return target.listeningTo;
    }
}

/**
 * Responsible for changing the player volume.
 */
function changeVolume(delta: number): void {
    Howler.volume(
        Howler.volume() + (-delta / 100)
    );
}

/**
 * Source inspiration from:
 * https://github.com/seiKiMo-Inc/Laudiolin/blob/react-v3/src/ui/components/player/EmbedPlayer.tsx
 */
function MusicPlayer() {
    const player = usePlayer();

    const [skipped, setSkipped] = useState(false);
    const [paused, setPaused] = useState(false);

    const [interacted, setInteracted] = useState(false);

    const [self, setSelf] = useState<TrackInfo | undefined>(undefined);
    const [color, setColor] = useState<string | undefined>(undefined);

    useEffect(() => {
        (async () => {
            if (!self) return;

            setColor(undefined); // Clear it so we hide the previous color.

            const fac = new FastAverageColor();
            const { rgb } = await fac.getColorAsync(
                Laudiolin.iconUrl(self.icon));
            setColor(rgb.substring(4, rgb.length - 1));
        })();
    }, [self]);

    useEffect(() => {
        // Play the new track.
        if (self && interacted) {
            player.play(self, interacted);
        }
    }, [interacted]);

    useEffect(() => {
        (async () => setSelf(await fetchCurrent()))();

        const play = () => setInteracted(true);
        window.addEventListener("click", play);

        return () => {
            window.removeEventListener("click", play);
        };
    }, []);

    useEffect(() => {
        const int = setInterval(() => {
            if (paused || !player.paused()) return;

            ((async () => {
                const next = await fetchCurrent();
                if (next.id != self?.id) {
                    player.play(next, interacted);
                    setSelf(player.currentlyPlaying);
                }
            }))();
        }, 120e3);

        return () => clearInterval(int);
    }, [self]);

    useEffect(() => {
        return () => player.stop();
    }, []);

    return self && color ? (
        <div
            className={"absolute left-1/2 -translate-x-1/2 bottom-[5%] rounded-lg p-2" +
                " flex flex-row gap-3 text-white border-2 border-white border-opacity-50" +
                " overflow-x-clip min-w-[305px] items-center select-none"}
            onContextMenu={(e) => e.preventDefault()}
            onWheel={e => changeVolume(Math.sign(e.deltaY))}
            style={{ backgroundColor: `rgba(${color}, 0.5)` }}
        >
            <img
                src={Laudiolin.iconUrl(self.icon)}
                alt={self.title}
                draggable={false}
                className={"rounded-lg w-20 h-20"}
            />

            <div className={"flex flex-col justify-between"}>
                <div className={"flex flex-col"}>
                    <span className={"font-medium"}>{self.title}</span>
                    <span>{self.artist}</span>
                </div>

                <ProgressBar
                    progress={player.progress}
                    duration={player.duration() ?? self.duration}
                    onUpdate={(to) => player.seek(to)}
                />
            </div>

            <div className={"h-20 flex flex-row items-end gap-1"}>
                <MdSkipNext
                    className={"logo_button"}
                    onClick={async () => {
                        const next = await fetchCurrent();
                        if (skipped || (next.id == self?.id ?? next.id)) {
                            player.play(await randomTrack(), interacted);
                        } else {
                            player.play(next, interacted);
                        }
                        setSelf(player.currentlyPlaying);

                        setSkipped(true);
                    }}
                />

                { player.paused() ?
                    <IoPlayCircle
                        className={"logo_button"}
                        onClick={() => {
                            player.resume();
                            setPaused(false);
                        }}
                    />
                    :
                    <IoPauseCircle
                        className={"logo_button"}
                        onClick={() => {
                            player.pause();
                            setPaused(true);
                        }}
                    />
                }
            </div>
        </div>
    ) : undefined;
}

export default MusicPlayer;
