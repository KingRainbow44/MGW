import { useEffect, useState } from "react";

import { MdSkipNext } from "react-icons/md";

import { FastAverageColor } from "fast-average-color";

import ProgressBar from "@components/ProgressBar.tsx";

import usePlayer from "@stores/player.tsx";
import { AvailableUsers, TrackInfo } from "@backend/types.ts";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";

const dummyData: AvailableUsers = {
    timestamp: 0,
    code: 200,
    message: "",
    onlineUsers: [
        {
            "username": "Magix",
            "userId": "85b7e6b8-6ac3-4009-ac50-98f4ad578940",
            "avatar": "https://cdn.discordapp.com/avatars/252090676068614145/6a6959288e5bd9fe4a27a29fb112843b.png",
            "socialStatus": "Everyone",
            "listeningTo": {
                "id": "0JuI1v1eIuM",
                "title": "Celebration (feat. Toko Miura)",
                "artist": "RADWIMPS",
                "icon": "https://app.seikimo.moe/proxy/oesPpZgxatxCd9XA3Kbz0ZrvB9tR7tPIWha3mMfsQAWMC5X9n3HGtZzeDOHkz7KZSf5asi-8q8KGArkC=w544-h544-l90-rj?from=cart",
                "url": "https://youtu.be/0JuI1v1eIuM",
                "duration": 275
            },
            "progress": 7.71E-4
        }
    ]
};

/**
 * Responsible for changing the player volume.
 */
function changeVolume(delta: number): void {
    console.log(delta);
}

/**
 * Source inspiration from:
 * https://github.com/seiKiMo-Inc/Laudiolin/blob/react-v3/src/ui/components/player/EmbedPlayer.tsx
 */
function MusicPlayer() {
    const player = usePlayer();

    const [interacted, setInteracted] = useState(false);

    const [self, setSelf] = useState<TrackInfo | undefined>(undefined);
    const [color, setColor] = useState<string | undefined>(undefined);

    useEffect(() => {
        (async () => {
            if (!self) return;

            setColor(undefined); // Clear it so we hide the previous color.

            const fac = new FastAverageColor();
            const { rgb } = await fac.getColorAsync(self.icon);
            setColor(rgb.substring(4, rgb.length - 1));
        })();
    }, [self]);

    useEffect(() => {
        // Play the new track.
        if (self && interacted) {
            player.play(self);
        }
    }, [self, interacted]);

    useEffect(() => {
        // TODO: Find data from the backend.
        setSelf(dummyData.onlineUsers[0].listeningTo);

        const play = () => setInteracted(true);
        window.addEventListener("click", play);

        return () => {
            window.removeEventListener("click", play);
        };
    }, []);

    return self && color ? (
        <div
            className={"absolute left-1/2 -translate-x-1/2 bottom-[5%] rounded-lg p-2" +
                " flex flex-row gap-3 text-white border-2 border-white border-opacity-50" +
                " select-none"}
            onContextMenu={(e) => e.preventDefault()}
            onWheel={e => changeVolume(Math.sign(e.deltaY))}
            style={{ backgroundColor: `rgba(${color}, 0.5)` }}
        >
            <img
                src={self.icon}
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

            <div className={"flex flex-row items-end gap-1"}>
                <MdSkipNext
                    className={"logo_button"}
                    onClick={() => console.log("skip to next")}
                />

                { player.paused() ?
                    <IoPlayCircle
                        className={"logo_button"}
                        onClick={() => player.resume()}
                    />
                    :
                    <IoPauseCircle
                        className={"logo_button"}
                        onClick={() => player.pause()}
                    />
                }
            </div>
        </div>
    ) : undefined;
}

export default MusicPlayer;
