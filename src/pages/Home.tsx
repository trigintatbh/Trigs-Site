import { useState, useEffect } from "react";
import icon from "../assets/icon.webp";
import az from "../assets/az.png";
import am1 from "../assets/am1.png";
import am2 from "../assets/am2.png";
import am3 from "../assets/am3.png";
import am4 from "../assets/am4.png";
import { SiJavascript, SiCss3, SiHtml5, SiReact, SiFirebase } from "react-icons/si";
import { FaArrowDown, FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import Card from "../components/Card";
import SocialLinks from "../components/SocialLinks";

import CometbrickThumbnail from "../assets/thumb/Cometbrick.png";
import DefragThumbnail from "../assets/thumb/Defr4g.png";
import LuxThumbnail from "../assets/thumb/Lux.png";
import ImposterThumbnail from "../assets/thumb/Imposter.png";
import RunningGameThumbnail from "../assets/thumb/Running Game.png";
import TerramThumbnail from "../assets/thumb/Terram.png";
import TrigCafeThumbnail from "../assets/thumb/Trigs Cafe.png";
import MarmoraThumbnail from "../assets/thumb/Marmora.png";
import SlotzThumbnail from "../assets/thumb/Slotz.png";
import NibblThumbnail from "../assets/thumb/Nibbl.png";
import AtomboxThumbnail from "../assets/thumb/Atombox.png";
import DownloadaireThumbnail from "../assets/thumb/Downloadaire.png";
import AlloyThumbnail from "../assets/thumb/Alloy.png";
import Astra97Thumbnail from "../assets/thumb/Astra97.png";
import OrionThumbnail from "../assets/thumb/Orion.png";
import RankrThumbnail from "../assets/thumb/Rankr.png";
import TrigsSystemsThumbnail from "../assets/thumb/TrigsSystems.png";
import HtmlInlinerThumbnail from "../assets/thumb/trigs-html-inliner.png";
import WhiteboardThumbnail from "../assets/thumb/Whiteboard.png";

const classes = [
    "English 10",
    "Psychology",
    "Digital Photography II",
    "Honors Geometry",
    "Engineering I",
    "Honors Chemistry",
];

const skills = [
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "CSS", icon: SiCss3, color: "#1572B6" },
    { name: "HTML", icon: SiHtml5, color: "#E34F26" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
];

export default function Home() {
    const [windowURL, setWindowURL] = useState<string | null>(null);
    const [windowTitle, setWindowTitle] = useState<string | null>(null);
    const [windowThumbnail, setWindowThumbnail] = useState<string | null>(null);

    useEffect(() => {
        if (windowURL) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [windowURL]);

    return (
        <div className="flex flex-col">
            {/* ── Game window overlay ──────────────────────────────────────── */}
            <div className="games--window" style={{ visibility: windowURL ? "visible" : "hidden" }}>
                <div className="flex flex-col w-9/10 h-9/10">
                    <div className="games--window--bar">
                        <span />
                        <div className="flex items-center justify-center gap-2">
                            {windowThumbnail && <img src={windowThumbnail} className="w-5 h-5 object-cover rounded-sm" alt="Game Thumbnail" />}
                            <span>{windowTitle}</span>
                        </div>
                        <span className="close-icon-wrapper" onClick={() => setWindowURL(null)}>
                            <IoClose />
                        </span>
                    </div>
                    <iframe src={windowURL || ""} />
                </div>
            </div>

            {/* ── Identity ──────────────────────────────────────────────────── */}
            <section className="page-container hero">
                <img src={icon} className="w-20 h-20 rounded-2xl" alt="Triginta" />

                <div className="flex flex-col gap-2">
                    <h1 className="hero--name text-6xl md:text-7xl leading-[1.15] pb-1">Logan Ellingson</h1>
                    <div className="flex items-center gap-2">
                        <img src={az} className="w-7 h-5 rounded-sm border border-neutral-800 object-cover" alt="Arizona flag" />
                        <span className="text-neutral-300! font-semibold text-sm">Proudly from Arizona</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="hero--grade text-5xl md:text-6xl text-white">10th Grade</span>
                    <span className="text-neutral-400! text-sm mt-1 tracking-wide">Class of 2029</span>
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="section-eyebrow">Currently Taking</h3>
                    <div className="flex flex-wrap gap-2 max-w-xl">
                        {classes.map((c) => (
                            <span key={c} className="text-sm px-4 py-1.5 rounded-full bg-white/5 border border-neutral-800 text-neutral-300!">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="section-eyebrow">Skills</h3>
                    <div className="flex rounded-3xl overflow-hidden liquid-glass">
                        {skills.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.name}
                                    title={s.name}
                                    className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center ${i !== 0 ? "border-l border-neutral-800" : ""}`}
                                >
                                    <Icon size={28} color={s.color} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── About (the fat 'ol version) ──────────────────────────────── */}
            <section id="about" className="wide-container about">
                <div className="flex flex-col gap-2">
                    <span className="section-eyebrow">About</span>
                    <h2 className="text-3xl font-bold">Heya, it's me, Triginta</h2>
                </div>

                <div className="about--block">
                    <img src={am1} className="about--image" alt="Triginta illustration 1" />
                    <div className="about--text">
                        <p>
                            You can call me <strong>Trig</strong>. I'm 14, I live in Arizona, and most of my free
                            time gets funneled into building things that have absolutely no business being made
                            by one person in a single HTML file, such as chat apps, map editors, planetariums,
                            fake operating systems, you name it. If it can be built in a browser tab, I've
                            probably tried it at some point.
                        </p>
                        <p>
                            I got into this because I liked games more than I liked being good at anything else,
                            so eventually "liking games" turned into "making games," which turned into "making
                            way too many other dumb clunky things."
                        </p>
                    </div>
                </div>

                <div className="about--block">
                    <img src={am2} className="about--image" alt="Triginta illustration 2" />
                    <div className="about--text">
                        <p>
                            Some more info about me is that I was born on <strong>Independence Day</strong>. Fun
                            fact, I came out a week earlier than expected (Jul. 11), so, you can't say I'm not
                            patriotic. America runs through my veins. Oh, I also skipped a grade (Kindergarten).
                            I guess I was going through school a little too fast, because apparently skipping
                            another one (3rd grade) was on the table too. They ended up deciding that making me
                            two years younger than everyone else would probably be a little weird, though. Hey,
                            if that happened, I would have never met most of the friends I know to this day!
                            Additionally, I'm Arizonan. Did I mention I'm Arizonan?
                        </p>
                        <p>
                            Anyways, I have these little <strong>hyper-fixations</strong> where I must make
                            something, then get bored of them, and give up on working on it after a month.
                            Frequently, I pick those games back up weeks or even months later to start tinkering
                            with it again for a month. For instance, I had a hyper-fixation on old technology,
                            which inspired me to make Astra 97 and Nibbl.
                        </p>
                    </div>
                </div>

                <div className="about--block">
                    <img src={am3} className="about--image" alt="Triginta illustration 3" />
                    <div className="about--text">
                        <p>
                            I mostly work in JavaScript, HTML, and CSS, with Firebase in the mix once a project
                            needs to actually talk to a server or sync between people. I've started a game in
                            Unreal Engine and C++ too, but I never took time to learn them.
                        </p>
                        <p>
                            Most of what I build lives as a <strong>single self-contained file</strong> that I
                            iterate on obsessively, tweaking tiny details that most people would never notice
                            until they feel exactly right, then immediately finding six more things to fix. I don't work in a
                            studio, on a team, or for anyone in particular. It's just me, 17 tabs, and whatever
                            dumb game idea I won't let go of.
                        </p>
                    </div>
                </div>

                <div className="about--block">
                    <img src={am4} className="about--image" alt="Triginta illustration 4" />
                    <div className="about--text">
                        <p>
                            So, uh, yeah. That's the gist of it. Go play the games, I know that's what you're
                            actually here for.
                        </p>
                        <p>
                            Or you're here for me. That'd be cool too. Either way, thanks for reading all of this.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Games ─────────────────────────────────────────────────────── */}
            <section id="games" className="wide-container flex flex-col gap-8 py-20">
                <div className="flex flex-col gap-2">
                    <span className="section-eyebrow">Projects</span>
                    <h2 className="text-3xl font-bold">Games &amp; things</h2>
                </div>

                <div className="games">
                    <Card title="Orion" description="a chat app, basically" thumbnail={OrionThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/Orion/index.html");
                                setWindowTitle("Orion");
                                setWindowThumbnail(OrionThumbnail);
                            }} />
                            <a href="/downloads/Orion.zip" download="Orion.zip" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
                    <Card title="Astra 97" description="windows 9x, but it's a browser tab" thumbnail={Astra97Thumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/Astra%2097/index.html");
                                setWindowTitle("Astra 97");
                                setWindowThumbnail(Astra97Thumbnail);
                            }} />
                            <a href="/downloads/Astra 97.zip" download="Astra 97.zip" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
                    <Card title="Alloy" description="idk it sounded cool" thumbnail={AlloyThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/Alloy/index.html");
                                setWindowTitle("Alloy");
                                setWindowThumbnail(AlloyThumbnail);
                            }} />
                            <a href="/downloads/Alloy.zip" download="Alloy.zip" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
                    <Card title="Rankr" description="rank stuff, chart stuff, you know the drill" thumbnail={RankrThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/Rankr/index.html");
                                setWindowTitle("Rankr");
                                setWindowThumbnail(RankrThumbnail);
                            }} />
                            <a href="/downloads/Rankr.zip" download="Rankr.zip" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
                    <Card title="Trig's Systems" description="my calendar, my units, my rules" thumbnail={TrigsSystemsThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/Trig's%20Systems/index.html");
                                setWindowTitle("Trig's Systems");
                                setWindowThumbnail(TrigsSystemsThumbnail);
                            }} />
                            <a href="/downloads/Trig's Systems.zip" download="Trig's Systems.zip" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
                    <Card title="Whiteboard" description="draw on stuff with friends" thumbnail={WhiteboardThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/whiteboard/index.html");
                                setWindowTitle("Whiteboard");
                                setWindowThumbnail(WhiteboardThumbnail);
                            }} />
                            <a href="/downloads/Whiteboard.zip" download="Whiteboard.zip" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
                    <Card title="trigs-html-inliner" description="squishes your html files into one, download only" thumbnail={HtmlInlinerThumbnail} footer={
                        <div className="flex gap-2">
                            <a href="/downloads/trigs-html-inliner.exe" download="trigs-html-inliner.exe" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
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
                    <Card title="Downloadaire" description="download files man idk what you're expect" thumbnail={DownloadaireThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/Downloadaire/downloadaire.html");
                                setWindowTitle("Downloadaire");
                                setWindowThumbnail(DownloadaireThumbnail);
                            }} />
                            <a href="/downloads/Downloadaire.zip" download="Downloadaire.zip" className="cursor-pointer">
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
                    <Card title="Imposter" description="who's the cow?" thumbnail={ImposterThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/Imposter/imposter.html");
                                setWindowTitle("Imposter");
                                setWindowThumbnail(ImposterThumbnail);
                            }} />
                            <a href="/downloads/Imposter.zip" download="Imposter.zip" className="cursor-pointer">
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
                    <Card title="Lux" description="the worst light ray simulation you've ever seen" thumbnail={LuxThumbnail} footer={
                        <div className="flex gap-2">
                            <FaPlay className="cursor-pointer" onClick={() => {
                                setWindowURL("games/lux/lux.html");
                                setWindowTitle("Lux");
                                setWindowThumbnail(LuxThumbnail);
                            }} />
                            <a href="/downloads/Lux.zip" download="Lux.zip" className="cursor-pointer">
                                <FaArrowDown />
                            </a>
                        </div>
                    } />
                </div>
            </section>

            {/* ── Elsewhere (YouTube / GitHub) ─────────────────────────────── */}
            <SocialLinks />
        </div>
    );
}
