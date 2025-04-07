import am1 from "../assets/am1.png";
import am2 from "../assets/am2.png";
import am3 from "../assets/am3.png";

export default function About() {
    return (
        <><><><div className="flex flex-col items-center gap-4">
            <img src={am1} className="w-96 h-96" />
            <span className="text-neutral-300!">Heya, it's me, Triginta! You can call me Trig though.</span>
        </div><div className="flex flex-col items-center gap-4">
                <img src={am2} className="w-96 h-96" />
                <span className="text-neutral-300!">I make games, I draw, and I exist!</span>
            </div></><div className="flex flex-col items-center gap-4">
                <img src={am3} className="w-96 h-96" />
                <span className="text-neutral-300!">So, uh, yeah. That's it. Go play the games, I know that's what you're after.</span>
            </div></><div className="flex flex-col items-center gap-4">
                <img src={am1} className="w-96 h-96" />
                <span className="text-neutral-300!">Or you're after me. That'd be cool. But yeah that's all BYE</span>
            </div></>
    )
}