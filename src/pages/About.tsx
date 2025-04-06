import icon from "../assets/icon.webp";

export default function About() {
    return (
        <div className="flex flex-col items-center gap-4 my-25">
            <img src={icon} className="w-48 h-48"/>
            <span className="text-neutral-300!">Heya, it's me, Triginta! You can call me Trig though. I should probably put more about me but I dunno what to put</span>
        </div>
    )
}