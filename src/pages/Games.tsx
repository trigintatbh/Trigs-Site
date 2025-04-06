import Chatroom from "../assets/games/Chatroom/chatroom.html";
import ChatroomThumbnail from "../assets/thumb/Chatroom.png";

import Cometbrick from "../assets/games/Cometbrick/index.html"
import CometbrickThumbnail from "../assets/thumb/Cometbrick.png";

import Defrag from "../assets/games/Defrag/index.html"
import Lightsim from "../assets/games/lightsim/lightsim.html"
import RunningGame from "../assets/games/Running Game/index.html"

import Terram from "../assets/games/Terram/index.html"
import TerramThumbnail from "../assets/thumb/Terram.png";

import TrigCafe from "../assets/games/Trig's Cafe/index.html"
import TrigCafeThumbnail from "../assets/thumb/Trigs Cafe.png";

import Card from "../components/Card";
import { FaArrowDown, FaPlay } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useState } from "react";

export default function Games() {

    const [windowURL, setWindowURL] = useState<string | null>(null);
    const [windowTitle, setWindowTitle] = useState<string | null>(null);

    return (
        <div className="games">
            <div className="games--window" style={{ visibility: windowURL ? "visible" : "hidden" }}>
                <div className="flex flex-col w-9/10 h-9/10">
                    <div className="games--window--bar">
                        <span/>
                        <span>{windowTitle}</span>
                        <MdClose onClick={() => setWindowURL(null)} />
                    </div>
                    <iframe src={windowURL || ""} />
                </div>
            </div>
            <Card title="Chatroom" description="talk to people! except it's not discord." thumbnail={ChatroomThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay onClick={() => {
                        setWindowURL(Chatroom);
                        setWindowTitle("Chatroom");
                    }} />
                    <FaArrowDown />
                </div>
            } />
            <Card title="Cometbrick" description="bounce balls on bricks" thumbnail={CometbrickThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay onClick={() => {
                        setWindowURL(Cometbrick);
                        setWindowTitle("Cometbrick");
                    }} />
                    <FaArrowDown />
                </div>
            } />
            <Card title="Defrag" description="defragment like it's 2001" footer={
                <div className="flex gap-2">
                    <FaPlay onClick={() => {
                        setWindowURL(Defrag);
                        setWindowTitle("Defrag");
                    }} />
                    <FaArrowDown />
                </div>
            } />
            <Card title="Lightsim" description="the worst light ray simulation you've ever seen" footer={
                <div className="flex gap-2">
                    <FaPlay onClick={() => {
                        setWindowURL(Lightsim);
                        setWindowTitle("Lightsim");
                    }} />
                    <FaArrowDown />
                </div>
            } />
            <Card title="Running Game" description="chrome dino? where are you?" footer={
                <div className="flex gap-2">
                    <FaPlay onClick={() => {
                        setWindowURL(RunningGame);
                        setWindowTitle("Running Game");
                    }} />
                    <FaArrowDown />
                </div>
            } />
            <Card title="Terram" description="didn't know you could make terraria so bad" thumbnail={TerramThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay onClick={() => {
                        setWindowURL(Terram);
                        setWindowTitle("Terram");
                    }} />
                    <FaArrowDown />
                </div>
            } />
            <Card title="Trig's Cafe" description="a cafe that crashes a lot for some reason" thumbnail={TrigCafeThumbnail} footer={
                <div className="flex gap-2">
                    <FaPlay onClick={() => {
                        setWindowURL(TrigCafe);
                        setWindowTitle("Trig's Cafe");
                    }} />
                    <FaArrowDown />
                </div>
            } />
        </div>
    )
}