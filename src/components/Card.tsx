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
            <div className="card--title">
                <h2>{props.title}</h2>
            </div>
            <div className="card--content" style={{ backgroundImage: `url(${props.thumbnail})` }}>
                <div className="group-hover:backdrop-blur-xs duration-250 h-full rounded-lg" style={{ height: '120%' }}>
                    <div className="opacity-0 group-hover:opacity-100 duration-250 card--description" style={{ color: "var(--color-secondary-text)"}}>
                        <p>{props.description}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 duration-250 card--footer">
                        {props.footer}
                    </div>
                </div>
            </div>
        </div>
    )
}