import { ReactNode } from "react";

interface ICard {
    title: string;
    description: string;
    thumbnail: string;
    footer: ReactNode;
}

export default function Card(props: ICard) {
    return (
        <div className="group card">
    <div className="relative z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-250">
        <div className="card--title">
            <h2>{props.title}</h2>
        </div>
    </div>

    <div className="card--content group-hover:blur-xs" style={{ backgroundImage: `url(${props.thumbnail})` }}></div>

    <div className="absolute inset-0 z-20 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none group-hover:pointer-events-auto" style={{ backgroundColor: "rgba(0, 0, 0, 0.04)", borderRadius: "0.5rem" }}>
        <div className="relative">
            <div className="card--title">
                <h2>{props.title}</h2>
            </div>
            <div className="card--description">
                <p>{props.description}</p>
            </div>
        </div>
        <div className="relative card--footer">
            {props.footer}
        </div>
    </div>
</div>
    );
}