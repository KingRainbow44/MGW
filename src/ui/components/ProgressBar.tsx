import { useState } from "react";

import Slider from "rc-slider";

/**
 * Formats a duration in seconds to a human-readable format.
 * @param seconds
 */
function formatDuration(seconds: number): string {
    const date = new Date(seconds * 1000);

    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    } else {
        return `${mm}:${ss}`;
    }
}

function Duration({ time }: { time: string }) {
    return (
        <span className={"text-white text-center"}>
            {time}
        </span>
    );
}

interface IProps {
    progress: number; // This is the current progress in seconds.
    duration: number; // This is the total duration in seconds.

    onUpdate: (value: number) => void;
}

function ProgressBar(props: IProps) {
    const { progress, duration } = props;

    const [thumbActive, setThumbActive] = useState(false);
    const [localProgress, setProgress] = useState(0);

    return (
        <div
            className={"flex flex-row items-center gap-5 min-w-64"}
            onMouseEnter={() => {
                setThumbActive(true);
                setProgress(props.progress);
            }}
            onMouseLeave={() => setThumbActive(false)}
        >
            <Duration time={formatDuration(progress)} />

            <Slider
                draggableTrack
                min={0} max={duration == 0 ? 1 : duration}
                value={thumbActive ? localProgress : progress}
                onChange={(value) => setProgress(value as number)}
                onChangeComplete={(value) => props.onUpdate(value as number)}
                styles={{
                    handle: { display: thumbActive ? "block" : "none" }
                }}
                classNames={{
                    track: "bg-accent",
                    handle: "bg-white border-accent",
                    rail: "!bg-white"
                }}
            />

            <Duration time={formatDuration(duration)} />
        </div>
    );
}

export default ProgressBar;
