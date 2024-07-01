import { AvailableUsers, TrackInfo } from "@backend/types.ts";

const baseRoute = "https://app.seikimo.moe";

/**
 * Fetches the online users.
 */
async function getOnlineUsers(): Promise<AvailableUsers> {
    const response = await fetch(`${baseRoute}/social/available`);
    return await response.json() as AvailableUsers;
}

/**
 * Fetches the track URL.
 *
 * @param track The track information.
 */
function getTrackUrl(track: TrackInfo): string {
    return `${baseRoute}/stream?id=${track.id}`;
}

export default {
    getOnlineUsers,
    getTrackUrl
};
