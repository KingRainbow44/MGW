import { AvailableUsers, PlaylistData, TrackInfo } from "@backend/types.ts";

const baseRoute = "https://app.seikimo.moe";
const iconRoute = `${baseRoute}/proxy/{ico}?from={src}`;

/**
 * Fetches the online users.
 */
async function getOnlineUsers(): Promise<AvailableUsers> {
    const response = await fetch(`${baseRoute}/social/available`);
    return await response.json() as AvailableUsers;
}

/**
 * Fetches the playlist tracks of a playlist.
 *
 * @param playlistId The playlist ID.
 */
async function getPlaylistTracks(playlistId: string): Promise<TrackInfo[]> {
    const response = await fetch(`${baseRoute}/playlist/${playlistId}`);
    const data = await response.json() as PlaylistData;

    return data.code == 404 ? [] : data.tracks;
}

/**
 * Verifies an icon URL as CORS-safe.
 *
 * @param data The icon URL.
 */
function iconUrl(data: string): string {
    if (data.includes(baseRoute)) {
        return data;
    }

    const split = data.split("/");
    if (data.includes("i.ytimg.com")) {
        return iconRoute.replace("{ico}", split[4]).replace("{src}", "yt");
    }
    if (data.includes("i.scdn.co")) {
        return iconRoute.replace("{ico}", split[4]).replace("{src}", "spot");
    }
    if (data.includes("lh3.googleusercontent.com")) {
        return iconRoute.replace("{ico}", split[3]).replace("{src}", "cart");
    }

    console.warn("Unknown icon URL:", data);
    return data;
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
    getPlaylistTracks,

    iconUrl,
    getTrackUrl
};
