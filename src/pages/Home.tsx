import icon from "../assets/icon.webp";

export default function Home() {
    return (
        <div className="flex flex-col items-center gap-4 my-25">
            <img src={icon} className="w-48 h-48" />
            <span className="text-neutral-300!">trig's site is a thing and you're on it right now</span>
        </div>)
}