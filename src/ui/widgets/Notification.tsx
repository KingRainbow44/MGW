import usePrevious from "@hooks/usePrevious.ts";

import { useAlert } from "@stores/alert.ts";

function Notification() {
    const alert = useAlert();
    const prevAlert = usePrevious(alert);

    return (
        <div
            className={"alert p-2.5 bg-accent rounded-xl drop-shadow-lg absolute text-white right-5 top-5"}
            style={{ transform: `scale(${alert == undefined ? 0 : 1})` }}
        >
            <span style={{ fontFamily: "mhy" }}>{alert ?? prevAlert}</span>
        </div>
    );
}

export default Notification;
