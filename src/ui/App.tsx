import { Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage.tsx";
import MusicPlayer from "@ui/widgets/MusicPlayer.tsx";

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
        </div>
    );
}

export default App;
