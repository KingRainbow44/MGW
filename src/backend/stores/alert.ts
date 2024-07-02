import { create } from "zustand";

let currentAlert: number | undefined;

export const useAlert = create<string | undefined>()(() => undefined);

/**
 * Displays an alert message.
 *
 * @param message The message to display.
 * @param duration The amount of milliseconds to display the message.
 */
export default function alert(message: string, duration: number = 3e3): void {
    useAlert.setState(message);

    if (currentAlert) {
        clearTimeout(currentAlert);
    }

    // @ts-ignore
    currentAlert = setTimeout(() => {
        useAlert.setState(undefined);
    }, duration);
}

window.alert = alert;
