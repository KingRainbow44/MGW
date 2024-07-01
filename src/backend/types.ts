/// <editor-fold defaultstate="collapsed" desc="Laudiolin">

export type LaudiolinResponse = {
    timestamp: number;
    code: number;
    message: string;
};

export type TrackInfo = {
    id: string;
    title: string;
    artist: string;
    icon: string;
    url: string;
    duration: number;
};

export type AvailableUsers = LaudiolinResponse & {
    onlineUsers: {
        username: string;
        userId: string;
        avatar: string;
        socialStatus: string;
        listeningTo: TrackInfo;
        progress: number;
    }[];
};

/// </editor-fold>
