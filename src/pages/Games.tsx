import CometbrickThumbnail from "../assets/thumb/Cometbrick.png";
import DefragThumbnail from "../assets/thumb/Defr4g.png";
import LightsimThumbnail from "../assets/thumb/Lightsim.png";
import RunningGameThumbnail from "../assets/thumb/Running Game.png";
import TerramThumbnail from "../assets/thumb/Terram.png";
import TrigCafeThumbnail from "../assets/thumb/Trigs Cafe.png";
import MarmoraThumbnail from "../assets/thumb/Marmora.png";
import SlotzThumbnail from "../assets/thumb/Slotz.png";
import NibblThumbnail from "../assets/thumb/Nibbl.png";
import AtomboxThumbnail from "../assets/thumb/Atombox.png";

import Card from "../components/Card";
import { FaArrowDown, FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function Games() {
    const [windowURL, setWindowURL] = useState<string | null>(null);
    const [windowTitle, setWindowTitle] = useState<string | null>(null);
    const [windowThumbnail, setWindowThumbnail] = useState<string | null>(null);

    // This effect handles the body scroll based on the game window's state
    useEffect(() => {
        if (windowURL) {
            // When a game is open, disable scrolling on the body
            document.body.classList.add("overflow-hidden");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // When the game is closed, re-enable scrolling
            document.body.classList.remove("overflow-hidden");
        }

        // Cleanup function to remove the class if the component unmounts
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [windowURL]); // Rerun the effect whenever windowURL changes

    return (
        <div className="games">
            <div className="games--window" style={{ visibility: windowURL ? "visible" : "hidden" }}>
                <div className="flex flex-col w-9/10 h-9/10">
                    <div className="games--window--bar">
                        <span/>
                        <div className="flex items-center justify-center gap-2">
                            {windowThumbnail && <img src={windowThumbnail} className="w-5 h-5 object-cover rounded-sm" alt="Game Thumbnail"/>}
                            <span>{windowTitle}</span>
                        </div>
                        <span className="close-icon-wrapper" onClick={() => setWindowURL(null)}>
                            <IoClose />
                        </span>
                    </div>
                    <iframe src={windowURL || ""} />
                </div>
            </div>
            <Card title="Trig's Cafe" description="drink up pal it's laced" thumbnail={TrigCafeThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Trig's%20Cafe/index.html");
                        setWindowTitle("Trig's Cafe");
                        setWindowThumbnail(TrigCafeThumbnail);
                    }} />
                    <a href="/downloads/Trig's Cafe.zip" download="Trig's Cafe.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title="Cometbrick" description="bounce balls on bricks" thumbnail={CometbrickThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Cometbrick/index.html");
                        setWindowTitle("Cometbrick");
                        setWindowThumbnail(CometbrickThumbnail);
                    }} />
                    <a href="/downloads/Cometbrick.zip" download="Cometbrick.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title="Nibbl" description="upgrade your pc idk" thumbnail={NibblThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Nibbl/index.html");
                        setWindowTitle("Nibbl");
                        setWindowThumbnail(NibblThumbnail);
                    }} />
                    <a href="/downloads/Nibbl.zip" download="Nibbl.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title="Atombox" description="we goin atomic with this one 🗣️" thumbnail={AtomboxThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Atombox/index.html");
                        setWindowTitle("Atombox");
                        setWindowThumbnail(AtomboxThumbnail);
                    }} />
                    <a href="/downloads/Atombox.zip" download="Atombox.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title='Slotz' description="LETS GO GAMBLING" thumbnail={SlotzThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Slotz/index.html");
                        setWindowTitle("Slotz");
                        setWindowThumbnail(SlotzThumbnail);
                    }} />
                    <a href="/downloads/Slotz.zip" download="Slotz.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title="Marmora" description="a game about marbles" thumbnail={MarmoraThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Marmora/index.html");
                        setWindowTitle("Marmora");
                        setWindowThumbnail(MarmoraThumbnail);
                    }} />
                    <a href="/downloads/Marmora.zip" download="Marmora.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
                } />
            <Card title="Defr4g" description="defragment like it's 2001" thumbnail={DefragThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Defrag/index.html");
                        setWindowTitle("Defrag");
                        setWindowThumbnail(DefragThumbnail);
                    }} />
                    <a href="/downloads/Defrag.zip" download="Defrag.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title="Terram" description="didn't know you could make terraria so bad" thumbnail={TerramThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Terram/index.html");
                        setWindowTitle("Terram");
                        setWindowThumbnail(TerramThumbnail);
                    }} />
                    <a href="/downloads/Terram.zip" download="Terram.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title="Running Game" description="chrome dino? where are you?" thumbnail={RunningGameThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/Running%20Game/index.html");
                        setWindowTitle("Running Game");
                        setWindowThumbnail(RunningGameThumbnail);
                    }} />
                    <a href="/downloads/Running Game.zip" download="Running Game.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
            <Card title="Lightsim" description="the worst light ray simulation you've ever seen" thumbnail={LightsimThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay className="cursor-pointer" onClick={() => {
                        setWindowURL("games/lightsim/lightsim.html");
                        setWindowTitle("Lightsim");
                        setWindowThumbnail(LightsimThumbnail);
                    }} />
                    <a href="/downloads/Lightsim.zip" download="Lightsim.zip" className="cursor-pointer">
                        <FaArrowDown />
                    </a>
                </div>
            } />
        </div>
    )
}