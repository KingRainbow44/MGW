import { Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage.tsx";

import Notification from "@widgets/Notification.tsx";
import MusicPlayer from "@widgets/MusicPlayer.tsx";

import "rc-slider/assets/index.css";

import "@css/App.scss";
import "@css/Text.scss";

function App() {
    return (
        <div className={"App bg-blue"}>
            <Routes>
                <Route path={"/"} element={<HomePage />} />
            </Routes>

            <MusicPlayer />
            <Notification />
        </div>
    );
}

export default App;
