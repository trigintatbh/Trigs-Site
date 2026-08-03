import { useState, useEffect } from "react";
import icon from "../assets/icon.webp";
import az from "../assets/az.png";
import am1 from "../assets/am1.png";
import am2 from "../assets/am2.png";
import am3 from "../assets/am3.png";
import am4 from "../assets/am4.png";
import { SiJavascript, SiCss3, SiHtml5, SiReact, SiFirebase } from "react-icons/si";
import { FaArrowDown, FaPlay, FaExpand, FaCompress } from "react-icons/fa";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";

import Card from "../components/Card";
import GameInfoModal, { GameInfo } from "../components/GameInfoModal";
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
import ZincThumbnail from "../assets/thumb/Zinc.png";
import TrigsSystemsThumbnail from "../assets/thumb/TrigsSystems.png";
import HtmlInlinerThumbnail from "../assets/thumb/trigs-html-inliner.png";
import WhiteboardThumbnail from "../assets/thumb/Whiteboard.png";

// ── Imports for howTo images ──
import astra97_1 from "../assets/howTo/astra97-1.png";
import astra97_2 from "../assets/howTo/astra97-2.png";
import astra97_3 from "../assets/howTo/astra97-3.png";
import astra97_4 from "../assets/howTo/astra97-4.png";
import astra97_5 from "../assets/howTo/astra97-5.png";
import astra97_6 from "../assets/howTo/astra97-6.png";
import astra97_7 from "../assets/howTo/astra97-7.png";
import marmora_1 from "../assets/howTo/marmora-1.mp4";

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
    const [windowDescription, setWindowDescription] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [infoGame, setInfoGame] = useState<GameInfo | null>(null);

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

    function closeWindow() {
        setWindowURL(null);
        setIsFullscreen(false);
        setWindowDescription(null);
    }

    return (
        <div className="flex flex-col">
            {/* ── Game window overlay ──────────────────────────────────────── */}
            <div className="games--window" style={{ visibility: windowURL ? "visible" : "hidden" }}>
                <div className={`games--window--frame${isFullscreen ? " fullscreen" : ""}`}>
                    {isFullscreen && <div className="games--window--hover-zone" />}
                    <div className="games--window--bar">
                        <span />
                        <div className="flex items-center justify-center gap-2">
                            {windowThumbnail && <img src={windowThumbnail} className="w-5 h-5 object-cover rounded-sm" alt="Game Thumbnail" />}
                            <span>{windowTitle}</span>
                            {windowDescription && (
                                <IoInformationCircleOutline
                                    onClick={() => setInfoGame({ title: windowTitle || "", thumbnail: windowThumbnail || "", description: windowDescription || "" })}
                                    className="opacity-60 hover:opacity-100 cursor-pointer shrink-0"
                                    style={{ width: "15px", height: "15px" }}
                                />
                            )}
                        </div>
                        <div className="games--window--bar-actions">
                            <span className="fullscreen-icon-wrapper" onClick={() => setIsFullscreen((f) => !f)}>
                                {isFullscreen ? <FaCompress /> : <FaExpand />}
                            </span>
                            <span className="close-icon-wrapper" onClick={closeWindow}>
                                <IoClose />
                            </span>
                        </div>
                    </div>
                    <iframe src={windowURL || ""} />
                </div>
            </div>

            <GameInfoModal game={infoGame} onClose={() => setInfoGame(null)} />

            {/* ── Identity ──────────────────────────────────────────────────── */}
            <section className="page-container hero">
                <img src={icon} className="w-20 h-20 rounded-2xl" alt="Triginta" />

                <div className="flex flex-col gap-2">
                    <h1 className="hero--name text-6xl md:text-7xl leading-[1.15] pb-1">Logan Ellingson</h1>
                    <div className="flex items-center gap-2">
                        <img src={az} className="w-12 h-8 rounded-sm border border-neutral-800 object-fit" alt="Arizona flag" />
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

                <div className="about--block reveal">
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

                <div className="about--block reveal">
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

                <div className="about--block reveal">
                    <img src={am1} className="about--image" alt="Triginta illustration 5" />
                    <div className="about--text">
                        <p>
                            One of my weirder hyper-fixations is mapping out scenarios that will, hopefully,
                            never actually happen. Think a second US Civil War, or what WWIII would look like if
                            it kicked off next week. I map the whole thing out, occupation and all, entirely in{" "}
                            <strong>Paint.NET</strong>.
                        </p>
                        <p>
                            I'm also a huge <strong>science, space, and astronomy</strong> nerd, which is probably obvious
                            if you look at how many of my projects end up being planets, stars, atoms, etc.
                        </p>
                    </div>
                </div>

                <div className="about--block reveal">
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

                <div className="about--block reveal">
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
                <div className="flex flex-col gap-2 reveal">
                    <span className="section-eyebrow">Projects</span>
                    <h2 className="text-3xl font-bold">Games &amp; things</h2>
                </div>

<div className="games">
    <Card title="Orion" description="super sophisticated chat app, very tuff" thumbnail={OrionThumbnail} onInfo={() => setInfoGame({ title: "Orion", description: "super sophisticated chat app, very tuff", thumbnail: OrionThumbnail, details: "Orion is a full-featured real-time chat application with support for multiple chat rooms, direct messaging, and user profiles. It features a sleek dark-themed UI with a sidebar for room navigation, a main chat area with message history, typing indicators, and user avatars. Users can create new rooms, join existing ones, and switch between conversations seamlessly. Messages support timestamps and are displayed in a clean, scrollable feed.", howTo: (
        <>
            <p>Use the sidebar to browse and switch between chat rooms. Click a room to view its messages.</p>
            <p>Type your message in the input field at the bottom and press Enter or click the send button to post.</p>
            <p>Create new rooms using the room creation controls. Each room displays its message history with timestamps and user avatars.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Orion/index.html");
                setWindowTitle("Orion");
                setWindowThumbnail(OrionThumbnail);
                setWindowDescription("super sophisticated chat app, very tuff");
            }} />
            <a href="/downloads/Orion.zip" download="Orion.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Astra 97" description="windows 98 in an alternate universe" thumbnail={Astra97Thumbnail} onInfo={() => setInfoGame({ title: "Astra 97", description: "windows 98 in an alternate universe", thumbnail: Astra97Thumbnail, details: "Astra 97 is a retro operating system simulation that reimagines the Windows 98 experience in an alternate universe. It features a fully interactive desktop with draggable windows, a taskbar with a start menu and system tray, desktop icons, and a suite of built-in applications including a text editor, file explorer, paint program, calculator, and more. The UI uses custom pixelated fonts and classic 98-style window chrome with minimize, maximize, and close buttons. It also includes Blockly-based visual programming integration.", howTo: (
        <>
            <p>When Astra 97 first boots, you'll need to go through the installation process. Follow these steps:</p>
            <p>1. Select <strong>Boot from CD-ROM</strong> on the first setup menu.</p>
            <img src={astra97_1} alt="Boot from CD-ROM selected" />
            <p>2. Select <strong>Start Astra 97 Setup from CD-ROM</strong>.</p>
            <img src={astra97_2} alt="Start Astra 97 Setup from CD-ROM selected" />
            <p>3. Press <strong>ENTER</strong> to continue with Setup.</p>
            <img src={astra97_3} alt="Press ENTER to continue with Setup" />
            <p>4. Select <strong>Configure unallocated disk space (recommended)</strong>.</p>
            <img src={astra97_4} alt="Configure unallocated disk space selected" />
            <p>5. Select <strong>Yes, enable large disk support</strong>.</p>
            <img src={astra97_5} alt="Yes, enable large disk support selected" />
            <p>6. Press <strong>ENTER</strong> to continue.</p>
            <img src={astra97_6} alt="Press ENTER to continue" />
            <p>7. When prompted again, select <strong>Boot from CD-ROM</strong>.</p>
            <img src={astra97_7} alt="Boot from CD-ROM" />
            <p>The setup will easily guide you through the rest. Make sure to boot from Hard Disk for the rest of the process.</p>
            <p>Once installed, click desktop icons to launch applications. Use the Start button on the taskbar to access the start menu. Drag windows by their title bars to reposition them. Use the minimize, maximize, and close buttons on each window. Right-click the desktop for context menus.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Astra%2097/index.html");
                setWindowTitle("Astra 97");
                setWindowThumbnail(Astra97Thumbnail);
                setWindowDescription("windows 98 in an alternate universe");
            }} />
            <a href="/downloads/Astra 97.zip" download="Astra 97.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Downloadaire" description="download files man idk what you're expecting" thumbnail={DownloadaireThumbnail} onInfo={() => setInfoGame({ title: "Downloadaire", description: "download files man idk what you're expecting", thumbnail: DownloadaireThumbnail, details: "Downloadaire is an idle clicker game themed around downloading files. Players click to manually download files and earn bytes, which serve as the in-game currency. The game features a shop panel on the left where players can purchase upgrades like auto-downloaders, download speed boosts, and bandwidth multipliers. A stats bar at the top tracks total bytes, bytes per second, and download speed. The main area displays a visual download animation. Progression is based on accumulating bytes to unlock increasingly powerful upgrades that automate and accelerate the download process.", howTo: (
        <>
            <p>Click the download button in the main area to manually download files and earn bytes.</p>
            <p>Spend bytes in the shop panel on the left to purchase upgrades like auto-downloaders and speed boosts.</p>
            <p>Each upgrade increases your bytes per second or click power. The stats bar at the top shows your current bytes, earnings rate, and speed.</p>
            <p>Keep upgrading to maximize your idle income!</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Downloadaire/downloadaire.html");
                setWindowTitle("Downloadaire");
                setWindowThumbnail(DownloadaireThumbnail);
                setWindowDescription("download files man idk what you're expecting");
            }} />
            <a href="/downloads/Downloadaire.zip" download="Downloadaire.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Marmora" description="a game about marbles racing" thumbnail={MarmoraThumbnail} onInfo={() => setInfoGame({ title: "Marmora", description: "a game about marbles racing", thumbnail: MarmoraThumbnail, details: "Marmora is a marble racing game where you create, customize, and race marbles down tracks. Each marble can be individually customized with different colors and patterns. The game features a collection system where you can save your favorite marble designs and manage them. Hover over a marble to reveal interaction options like edit, save, or delete using modifier keys.", howTo: (
        <>
            <p>Hover over a marble to see the <strong>edit icon</strong>. Click it to customize that marble's appearance.</p>
            <video src={marmora_1} autoPlay loop muted playsInline />
            <p>Hold <strong>Shift</strong> while hovering over a marble to reveal the <strong>save to collection</strong> button.</p>
            <p>Hold <strong>Ctrl</strong> while hovering over a marble to reveal the <strong>delete</strong> button.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Marmora/index.html");
                setWindowTitle("Marmora");
                setWindowThumbnail(MarmoraThumbnail);
                setWindowDescription("a game about marbles racing");
            }} />
            <a href="/downloads/Marmora.zip" download="Marmora.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Rankr" description="rank stuff, chart stuff, you get the idea" thumbnail={RankrThumbnail} onInfo={() => setInfoGame({ title: "Rankr", description: "rank stuff, chart stuff, you get the idea", thumbnail: RankrThumbnail, details: "Rankr is a data visualization tool for creating animated bar chart races and line charts from time-series data. It comes loaded with 50+ built-in datasets including US city populations, world countries, company market caps, YouTube channels, CPU market share, and more. You can also import your own data via JSON. The app supports both bar chart race mode, where items animate and swap positions as rankings change over time, and line chart mode with configurable time windows. Features include logarithmic scales, custom value formatting (prefixes, suffixes, rounding), date format options, item grouping, and high-resolution PNG and video export.", howTo: (
        <>
            <p>Click a <strong>preset tile</strong> in the sidebar to load a built-in dataset (e.g. US Cities, World Countries, Companies).</p>
            <p>Use the <strong>play/pause button</strong> and the <strong>date slider</strong> in the transport bar to scrub through time. Adjust speed with the speed popover (0.1x to 20x).</p>
            <p>Toggle between <strong>Bar</strong> and <strong>Line</strong> chart modes in the config bar. In line mode, set the time window (7d, 30d, 1y, All, etc.).</p>
            <p>Customize value formatting with <strong>Prefix</strong> (e.g. $), <strong>Suffix</strong> (e.g. %, M), <strong>Round</strong> (decimal places), and <strong>Scale</strong> (linear or logarithmic).</p>
            <p>Click the <strong>Add</strong> button to create new items, or right-click an item to Edit, Isolate, or Delete it. Use <strong>Ctrl+click</strong> to multi-select and <strong>Shift+click</strong> for range select.</p>
            <p>Use <strong>Import/Export</strong> to save or load your data as JSON. Export charts as PNG or full animated video via the export dropdown.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Rankr/index.html");
                setWindowTitle("Rankr");
                setWindowThumbnail(RankrThumbnail);
                setWindowDescription("rank stuff, chart stuff, you get the idea");
            }} />
            <a href="/downloads/Rankr.zip" download="Rankr.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Zinc" description="chat with local AIs (requires ollama and installation of AIs)" thumbnail={ZincThumbnail} onInfo={() => setInfoGame({ title: "Zinc", description: "chat with local AIs (requires ollama and installation of AIs)", thumbnail: ZincThumbnail, details: "Zinc is a chat interface for talking to local AI models running on your machine through Ollama. It lets you converse with any model you've installed locally, with no cloud API keys or internet required for inference. All processing happens on your hardware, so your conversations stay private. You can switch between different models mid-conversation, and the app handles the communication with Ollama's local API.", howTo: (
        <>
            <p><strong>Prerequisites:</strong> Zinc requires Ollama to be installed and running on your machine.</p>
            <p>1. Install Ollama from <strong>ollama.com</strong>. On macOS and Windows, download the installer and run it. On Linux, run:</p>
            <p><code>curl -fsSL https://ollama.com/install.sh | sh</code></p>
            <p>2. Open a terminal and pull a model. For example, to get Llama 3:</p>
            <p><code>ollama pull llama3</code></p>
            <p>Other popular models include <code>mistral</code>, <code>gemma</code>, <code>phi3</code>, and <code>codellama</code>. Browse the full list at ollama.com/library.</p>
            <p>3. Make sure Ollama is running (it usually starts automatically after install, or run <code>ollama serve</code>).</p>
            <p>4. Open Zinc, select your installed model from the model picker, and start chatting!</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <a href="/downloads/Zinc.zip" download="Zinc.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Trig's Cafe" description="drink up pal it's laced" thumbnail={TrigCafeThumbnail} onInfo={() => setInfoGame({ title: "Trig's Cafe", description: "drink up pal it's laced", thumbnail: TrigCafeThumbnail, details: "Trig's Cafe is a cafe management idle game where you serve food and drinks to customers by dragging items from plates onto their orders. Customers arrive with speech bubbles showing what they want, and you drag the matching food from your plates to fulfill their order. The game has 13 unlockable menu items ranging from Toast to Cake, each upgradable to level 30 with exponentially increasing sell prices. Restock your plates by completing minigames (button mash or timing bar). Choose from 4 difficulty levels that affect customer timers and penalties. Watch out for two rare secret customers, Finn and Zorp, who have a 0.1% chance of appearing.", howTo: (
        <>
            <p>Customers appear at the top with speech bubbles showing their order. <strong>Drag food from your plates</strong> onto the matching customer to serve them and earn money.</p>
            <p>Click <strong>Restock</strong> to open a minigame. Complete it to add +1 serving to every unlocked plate. There are two minigames: a button mash (click 10 times in 5 seconds) and a timing bar (click when the arrow is in the green zone).</p>
            <p>Click <strong>Upgrade</strong> to open the shop. Unlock new menu items in order (Toast, Cereal, Juice, Milk, etc.) and upgrade existing ones to increase their sell price.</p>
            <p>On Medium difficulty and above, customers have a timer bar. If it runs out, they leave and you lose a percentage of your money. Harder difficulties mean shorter timers and bigger penalties.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Trig's%20Cafe/index.html");
                setWindowTitle("Trig's Cafe");
                setWindowThumbnail(TrigCafeThumbnail);
                setWindowDescription("drink up pal it's laced");
            }} />
            <a href="/downloads/Trig's Cafe.zip" download="Trig's Cafe.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Cometbrick" description="bounce balls on bricks" thumbnail={CometbrickThumbnail} onInfo={() => setInfoGame({ title: "Cometbrick", description: "bounce balls on bricks", thumbnail: CometbrickThumbnail, details: "Cometbrick is an idle brick-breaker game. There is no paddle. Balls bounce autonomously around the canvas, smashing bricks and earning money. Your job is to buy and upgrade balls to deal more damage. There are 7 ball types: Basic, Fireball (splash damage), Sniper (auto-targets nearest brick), Scatter (spawns 8 mini-balls on impact), Wrecking (pierces through weak bricks), Bouncy (accelerates 5% per hit), and Poison (makes bricks take 50%+ more damage from all sources). Bricks get tougher each level, cycling through 6 shape patterns. The game auto-saves and runs infinitely with no lose condition.", howTo: (
        <>
            <p>Click <strong>Buy buttons</strong> in the top bar to purchase balls. They spawn automatically and bounce around on their own. There is no paddle to control.</p>
            <p><strong>Click on bricks</strong> directly to deal manual damage and earn money faster.</p>
            <p>Open the <strong>Upgrade menu</strong> to increase click power, ball power, ball speed, and poison effect. Each upgrade applies to all existing balls of that type immediately.</p>
            <p>Ball prices increase by 1.35x each purchase, so plan your spending. New ball types unlock once you've earned 10% of their base price.</p>
            <p>When all bricks are cleared, you advance to the next level with tougher bricks and earn a level bonus. The shape pattern cycles every 6 levels.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Cometbrick/index.html");
                setWindowTitle("Cometbrick");
                setWindowThumbnail(CometbrickThumbnail);
                setWindowDescription("bounce balls on bricks");
            }} />
            <a href="/downloads/Cometbrick.zip" download="Cometbrick.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Atombox" description="play with atoms (try not to split them)" thumbnail={AtomboxThumbnail} onInfo={() => setInfoGame({ title: "Atombox", description: "play with atoms (try not to split them)", thumbnail: AtomboxThumbnail, details: "Atombox is a 2D interactive chemistry sandbox where you spawn atoms from the periodic table, combine them into real molecules, and watch them react. It features 40+ elements and 35+ molecule recipes with accurate melting and boiling points. Molecules change phase (solid, liquid, gas) based on temperature, and you can trigger chemical reactions including combustion and acid-base reactions. Use the Matchbox tool to heat atoms and drive reactions, or crank up the ambient temperature to watch things melt. The game tracks your discoveries and saves them to localStorage, encouraging you to find all possible molecules.", howTo: (
        <>
            <p><strong>Click an element button</strong> in the sidebar to spawn an atom, or <strong>drag it onto the canvas</strong> to place it precisely.</p>
            <p>Select atoms using the <strong>Pointer tool</strong> (click to select a molecule, Shift+click to multi-select), then click <strong>Bond Selected</strong> to combine them into a molecule if a valid recipe exists.</p>
            <p>Switch to the <strong>Matchbox tool</strong> to heat atoms. Click or drag on the canvas to apply heat. Use the <strong>scroll wheel</strong> to adjust the heat radius. Heating atoms past their bonding threshold can trigger automatic reactions.</p>
            <p>Adjust the <strong>Ambient Temperature</strong> and <strong>Gravity</strong> sliders in the sidebar to change the simulation environment. Higher temperatures cause phase transitions and can decompose molecules.</p>
            <p>Use <strong>Unbond</strong> to split a molecule back into atoms, or <strong>Delete</strong> to remove it. Each new molecule you create gets logged as a discovery!</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Atombox/index.html");
                setWindowTitle("Atombox");
                setWindowThumbnail(AtomboxThumbnail);
                setWindowDescription("play with atoms (try not to split them)");
            }} />
            <a href="/downloads/Atombox.zip" download="Atombox.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Nibbl" description="upgrade your pc idk" thumbnail={NibblThumbnail} onInfo={() => setInfoGame({ title: "Nibbl", description: "upgrade your pc idk", thumbnail: NibblThumbnail, details: "Nibbl is an idle clicker game about building and upgrading a PC. You start with vintage late-80s hardware (Intel 8088 CPU, Cirrus Logic GPU, 128KB RAM, 16MB HDD) and earn credits passively from components that produce income. Spend credits to upgrade each component through historically accurate PC hardware generations. Your PSU has a wattage cap that gates how many upgrades you can run, so you need to upgrade the power supply to unlock higher-tier parts. The motherboard also constrains which RAM and CPU upgrades are compatible. There are 8 upgradeable components: CPU, GPU, RAM, Motherboard, PSU, Storage, Monitor, and Fan.", howTo: (
        <>
            <p>Credits accumulate automatically based on your components' production rates. CPU and GPU produce the most credits per second.</p>
            <p>Click <strong>Upgrade</strong> on any component card to advance it to the next tier. Each upgrade costs more credits and may increase wattage.</p>
            <p>Keep an eye on your <strong>PSU wattage cap</strong>. If your total component wattage exceeds what the PSU can handle, you'll need to upgrade the PSU first before adding more power-hungry parts.</p>
            <p>The <strong>Motherboard</strong> constrains which RAM and CPU upgrades are available. Upgrade it to unlock faster, more compatible parts.</p>
            <p>The <strong>Fan</strong> doesn't produce credits.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Nibbl/index.html");
                setWindowTitle("Nibbl");
                setWindowThumbnail(NibblThumbnail);
                setWindowDescription("upgrade your pc idk");
            }} />
            <a href="/downloads/Nibbl.zip" download="Nibbl.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Trig's Systems" description="my calendar, my units, my rules" thumbnail={TrigsSystemsThumbnail} onInfo={() => setInfoGame({ title: "Trig's Systems", description: "my calendar, my units, my rules", thumbnail: TrigsSystemsThumbnail, details: "Trig's Systems is a fully custom measurement and calendar system called the Trigian system. It features a 10-month, 360-day calendar with 5 intercalary Stilldays (plus leap rules more accurate than Gregorian), a decimal time system (10 ors, 100 mins, 100 vels per day), and 20 physically-derived units (7 base + 13 derived) with 12 metric-style prefixes. The app includes a live Trigian clock, an interactive calendar with day notes, an SVG unit dependency graph with hover tooltips, a full bidirectional SI-to-TSM converter across 12 categories, and a scratch notes pad.", howTo: (
        <>
            <p>Use the <strong>Calendar</strong> tab to view the live Trigian date and time. Navigate months with the arrow buttons, click any day to see its Gregorian equivalent and add notes.</p>
            <p>The <strong>TSM Reference</strong> tab shows the unit dependency graph. Hover any node to highlight it and its dependencies, and see a tooltip with the unit's definition and SI equivalent.</p>
            <p>Use the <strong>Converter</strong> tab to convert between TSM and SI units. Pick a category (Temperature, Length, Speed, etc.), enter a value, select your from/to units, and see the result instantly. Use the swap button to reverse the conversion.</p>
            <p>The <strong>Notes</strong> tab is a scratch pad that saves to localStorage. Use Ctrl+S to save.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Trig's%20Systems/index.html");
                setWindowTitle("Trig's Systems");
                setWindowThumbnail(TrigsSystemsThumbnail);
                setWindowDescription("my calendar, my units, my rules");
            }} />
            <a href="/downloads/Trig's Systems.zip" download="Trig's Systems.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />
    
    <Card title="Trig's HTML Inliner" description="squishes your html files into one" thumbnail={HtmlInlinerThumbnail} onInfo={() => setInfoGame({ title: "Trig's HTML Inliner", description: "squishes your html files into one", thumbnail: HtmlInlinerThumbnail, details: "Trig's HTML Inliner is a developer utility that converts an HTML file with external asset references into a single self-contained HTML file. It inlines all assets (images, stylesheets, scripts, fonts) as base64 data URIs, eliminating the need for separate files. The app is built as an Electron desktop tool with a dark glassmorphism UI, a progress bar with crossfade previews of each asset as it's inlined, and options to minify and obfuscate the output.", howTo: (
        <>
            <p>Click <strong>Pick HTML</strong> to select your main HTML file.</p>
            <p>Click <strong>Pick Assets Folder</strong> to select the folder containing all referenced assets (images, CSS, JS, fonts, etc.).</p>
            <p>Optionally check <strong>Minify</strong> to compress the output or <strong>Obfuscate</strong> to make the code harder to read.</p>
            <p>Click <strong>Inline</strong> to start the process. The progress bar shows how many assets have been processed, and the preview panel crossfades each asset as it's inlined.</p>
            <p>Once complete, click <strong>Open output</strong> to view or save the resulting single self-contained HTML file.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <a href="/downloads/trigs-html-inliner.zip" download="trigs-html-inliner.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Alloy" description="a Minecraft texture maker for custom tools, armor, and items" thumbnail={AlloyThumbnail} onInfo={() => setInfoGame({ title: "Alloy", description: "a Minecraft texture maker for custom tools, armor, and items", thumbnail: AlloyThumbnail, details: "Alloy is a Minecraft texture generator that takes vanilla Minecraft textures and colorizes them to create custom tools, armor, ores, ingots, gems, blocks, and wood sets. Pick a color and material name, choose which items to generate, and hit Generate. It uses a sophisticated pixel-level colorization algorithm that preserves the original shading and luminance. 16 quick presets (Ruby, Sapphire, Titanium, etc.) are included. You can also generate full wood sets with separate bark and leaf colors. Export individual textures as PNGs or download everything as a ZIP resource pack ready to drop into Minecraft.", howTo: (
        <>
            <p>Use the <strong>Colors</strong> tab to set your material name and pick a color. Try the <strong>quick presets</strong> (Ruby, Sapphire, Emerald, etc.) for one-click setup. Adjust <strong>Blend Strength</strong> and <strong>Saturation Boost</strong> to fine-tune the look.</p>
            <p>Switch to the <strong>Items</strong> tab to toggle which items to generate (swords, pickaxes, armor, ores, ingots, etc.) and pick the base type (Iron, Diamond, Gold, Netherite).</p>
            <p>Use the <strong>Wood</strong> tab to optionally generate a full wood set (log, planks, leaves, sapling) with separate bark and leaf colors.</p>
            <p>Click the <strong>Generate</strong> button (or the bolt icon in the rail) to process all selected textures. A progress bar shows the status.</p>
            <p>Click any generated texture card to download it as a PNG, or use <strong>Download All</strong> to get a ZIP with proper Minecraft resource pack folder structure.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Alloy/index.html");
                setWindowTitle("Alloy");
                setWindowThumbnail(AlloyThumbnail);
                setWindowDescription("a Minecraft texture maker for custom tools, armor, and items");
            }} />
            <a href="/downloads/Alloy.zip" download="Alloy.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Imposter" description="who's the cow?" thumbnail={ImposterThumbnail} onInfo={() => setInfoGame({ title: "Imposter", description: "who's the cow?", thumbnail: ImposterThumbnail, details: "Imposter is a real-time multiplayer social deduction game. One player is secretly the Imposter and must blend in while everyone else tries to figure out who it is. Each round, players get a question to answer, but the Imposter sees a slightly different version. After everyone answers, the group votes on who they think the Imposter is. The game supports up to 8 players with lobby codes, real-time chat, and cosmetic customization for your avatar (colors, eyes, mouth, hats, eyewear, and more). Earn Omega currency to buy cosmetics from the shop.", howTo: (
        <>
            <p>Enter your name and <strong>Host</strong> or <strong>Join</strong> a lobby. Share the 6-character lobby code with friends.</p>
            <p>During the <strong>Question phase</strong>, answer the prompt you see. The Imposter gets a different question, so pay attention to suspicious answers.</p>
            <p>During the <strong>Voting phase</strong>, click <strong>Vote</strong> on the answer you think came from the Imposter. You can't vote for yourself.</p>
            <p>If the majority votes for the Imposter, they're caught and the Innocents win. If the Imposter survives the vote, they win.</p>
            <p>Customize your avatar in the <strong>Profile</strong> screen and buy new cosmetics from the <strong>Shop</strong> using Omega credits earned from playing.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Imposter/imposter.html");
                setWindowTitle("Imposter");
                setWindowThumbnail(ImposterThumbnail);
                setWindowDescription("who's the cow?");
            }} />
            <a href="/downloads/Imposter.zip" download="Imposter.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Terram" description="didn't know you could make terraria so bad" thumbnail={TerramThumbnail} onInfo={() => setInfoGame({ title: "Terram", description: "didn't know you could make terraria so bad", thumbnail: TerramThumbnail, details: "Terram is a 2D sandbox game inspired by Terraria, built in HTML5 Canvas. Explore a procedurally generated world with 5 biomes (Plains, Forest, Desert, Mountains, Snow) that wraps horizontally. Mine blocks, collect resources, craft tools, and place blocks to build. The game features an RGB lighting system with torch flickering and a day/night cycle, ambient occlusion, cave generation, and a Guide NPC. You start with only 5 inventory slots, so craft bundles to expand. The crafting system uses recipe discovery: recipes only appear once you have at least half the required ingredients.", howTo: (
        <>
            <p>Use <strong>WASD</strong> or <strong>arrow keys</strong> to move. Hold <strong>Shift</strong> to sprint. Press <strong>Space</strong> or <strong>W</strong> to jump.</p>
            <p><strong>Hold left-click</strong> on a block to mine it. Harder blocks require better tools (pickaxe for stone/ores, axe for wood). If your tool isn't strong enough, you can't mine it.</p>
            <p><strong>Right-click</strong> to place a block from your selected hotbar slot. Use <strong>1-9</strong> or the <strong>scroll wheel</strong> to switch slots.</p>
            <p>Press <strong>E</strong> to open your inventory and crafting screen. Recipes appear once you have enough ingredients. Craft a <strong>bundle</strong> to add an inventory slot.</p>
            <p>Place <strong>torches</strong> to light up dark areas underground. The world has a day/night cycle, so stock up before dark!</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Terram/index.html");
                setWindowTitle("Terram");
                setWindowThumbnail(TerramThumbnail);
                setWindowDescription("didn't know you could make terraria so bad");
            }} />
            <a href="/downloads/Terram.zip" download="Terram.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Slotz" description="ha ha gambling" thumbnail={SlotzThumbnail} onInfo={() => setInfoGame({ title: "Slotz", description: "ha ha gambling", thumbnail: SlotzThumbnail, details: "Slotz is a roguelike slot machine game with a debt-repayment mechanic. Spin the 5-reel, 3-row slot machine to earn coins, but you also have to pay off an ever-increasing debt before time runs out. Every 3 rounds is a cycle: if you can't cover your debt by the end of a cycle, it's game over. There are 10 win patterns (horizontal, vertical, diagonal, zigzag, jackpot, and more) with different multipliers. Spend tickets on artifacts that modify your luck and payouts, like the Spin Master (free spins) or Money Magnet (+10% all gains).", howTo: (
        <>
            <p>Click <strong>Spin</strong> to pull the lever (costs 1 coin). Match symbols across the 5x3 grid to win. Different patterns (horizontal, diagonal, zigzag, jackpot) have different multipliers.</p>
            <p>After each round of 7 spins, you earn a ticket and can pay down your debt. Use the <strong>Pay</strong> button in the left panel to deposit coins toward your debt.</p>
            <p>Every 3 rounds is a cycle. If you can't cover your remaining debt by the end of a cycle, it's game over. Debt increases by 1.5x after each successful payoff.</p>
            <p>Spend tickets on <strong>artifacts</strong> in the right panel. Artifacts give passive bonuses like increased luck, free spins, or boosted payouts. Use <strong>Reroll</strong> (20 coins) to refresh the available artifacts.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Slotz/index.html");
                setWindowTitle("Slotz");
                setWindowThumbnail(SlotzThumbnail);
                setWindowDescription("ha ha gambling");
            }} />
            <a href="/downloads/Slotz.zip" download="Slotz.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Lux" description="the worst light ray simulation you've ever seen" thumbnail={LuxThumbnail} onInfo={() => setInfoGame({ title: "Lux", description: "the worst light ray simulation you've ever seen", thumbnail: LuxThumbnail, details: "Lux is a 2D light ray simulation where you place point light sources and draw shapes to watch rays bounce, reflect, and interact in real time. It supports specular reflection with configurable reflectivity per object, up to 24 bounces per ray, and intensity decay. Place lights with custom colors and ray counts, draw walls, freehand shapes, squares, and circles, then watch the simulation update live as you draw. The tagline is self-deprecating: it only does reflection, no refraction, lenses, or prisms.", howTo: (
        <>
            <p>Press <strong>W</strong> and click to place a light source. Press <strong>E</strong> and drag to draw a wall. Press <strong>R</strong> to freehand draw a shape. Press <strong>1</strong>, <strong>2</strong>, or <strong>3</strong> to place a solid square, solid circle, or hollow square.</p>
            <p>Press <strong>Q</strong> to switch to the Select tool. Click objects to select them, then drag to move. Press <strong>Delete</strong> to remove the selected object.</p>
            <p>When a light is selected, use the <strong>Color picker</strong> to change its tint and the <strong>Rays slider</strong> to control how many rays it emits (256 to 16384+).</p>
            <p>When an object is selected, use the <strong>Reflectivity slider</strong> to control how much light bounces off it (0 = absorbs all light, 1 = perfect mirror).</p>
            <p>Press <strong>C</strong> to clear everything.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/lux/lux.html");
                setWindowTitle("Lux");
                setWindowThumbnail(LuxThumbnail);
                setWindowDescription("the worst light ray simulation you've ever seen");
            }} />
            <a href="/downloads/Lux.zip" download="Lux.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Defr4g" description="defragment like it's 2001" thumbnail={DefragThumbnail} onInfo={() => setInfoGame({ title: "Defr4g", description: "defragment like it's 2001", thumbnail: DefragThumbnail, details: "Defr4g is a click-reaction game that mimics the Windows XP Disk Defragmenter UI, complete with the classic blue title bar, beige window chrome, and Tahoma font. Blocks fill in a grid left-to-right, and you must click the green 'defragmenting' blocks before they time out and turn gray. The game auto-starts on load and gets faster as the grid fills. Clicking when no green blocks are active costs you 5 points. This is an unfinished project and more of a proof of concept.", howTo: (
        <>
            <p>The game starts automatically. <strong>Click the game area</strong> whenever you see green blocks to 'defragment' them and earn points. All active green blocks are hit at once per click.</p>
            <p>If you click when no green blocks are on screen, you lose 5 points. Wait for green blocks to appear before clicking.</p>
            <p>Green blocks have a timeout that shrinks as the game speeds up. The longer you play, the faster blocks appear and the less time you have to react.</p>
            <p>This is an <strong>unfinished</strong> project and more of a <strong>proof of concept</strong>.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Defrag/index.html");
                setWindowTitle("Defrag");
                setWindowThumbnail(DefragThumbnail);
                setWindowDescription("defragment like it's 2001");
            }} />
            <a href="/downloads/Defrag.zip" download="Defrag.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Whiteboard" description="draw on stuff with friends" thumbnail={WhiteboardThumbnail} onInfo={() => setInfoGame({ title: "Whiteboard", description: "draw on stuff with friends", thumbnail: WhiteboardThumbnail, details: "Whiteboard is a real-time collaborative drawing app. Create a room, share the 6-character code, and draw together on a shared canvas. It features a full set of drawing tools (pen, marker, eraser, line, rectangle, ellipse, arrow, text, and image upload), live cursor tracking so you can see where others are drawing, and an undo system. Everything syncs in real time via Firebase, so all connected users see strokes and changes as they happen.", howTo: (
        <>
            <p>Enter your name and click <strong>Create New Room</strong> or join an existing one with a 6-character code. Share the code with friends.</p>
            <p>Select a tool from the left toolbar: <strong>Pen</strong> (P), <strong>Marker</strong> (M), <strong>Eraser</strong> (E), <strong>Line</strong> (L), <strong>Rectangle</strong> (R), <strong>Ellipse</strong> (O), <strong>Arrow</strong> (A), <strong>Text</strong> (T), or <strong>Select</strong> (S) to move things.</p>
            <p>Pick a color from the top bar swatches or color picker, and adjust the brush size with the slider.</p>
            <p>Use <strong>Undo</strong> (Ctrl+Z) to remove your last stroke, <strong>Clear all</strong> to wipe the canvas for everyone, or <strong>Download</strong> to save as PNG.</p>
            <p>Other users' cursors appear in real time so you can see where everyone is drawing.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/whiteboard/index.html");
                setWindowTitle("Whiteboard");
                setWindowThumbnail(WhiteboardThumbnail);
                setWindowDescription("draw on stuff with friends");
            }} />
            <a href="/downloads/Whiteboard.zip" download="Whiteboard.zip" className="cursor-pointer">
                <FaArrowDown />
            </a>
        </div>
    } />

    <Card title="Running Game" description="chrome dino? where are you?" thumbnail={RunningGameThumbnail} onInfo={() => setInfoGame({ title: "Running Game", description: "chrome dino? where are you?", thumbnail: RunningGameThumbnail, details: "Running Game is a Chrome dinosaur-style endless runner built in HTML5 Canvas. Your character runs across a landscape and you jump over cactus obstacles that scroll toward you. The character has walk animations and context-sensitive jump sprites (rising vs falling). The game is simple and no-frills: there's no score display, no speed progression, and no sound. Just jump and survive as long as you can.", howTo: (
        <>
            <p>Press <strong>Space</strong>, <strong>Arrow Up</strong>, or <strong>click/tap</strong> to jump over cactus obstacles.</p>
            <p>You can only jump when you're on the ground. No double-jump.</p>
            <p>After a game over, press Space or click to restart.</p>
        </>
    ) })} footer={
        <div className="flex gap-2">
            <FaPlay className="cursor-pointer" onClick={() => {
                setWindowURL("games/Running%20Game/index.html");
                setWindowTitle("Running Game");
                setWindowThumbnail(RunningGameThumbnail);
                setWindowDescription("chrome dino? where are you?");
            }} />
            <a href="/downloads/Running Game.zip" download="Running Game.zip" className="cursor-pointer">
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
