import { ReactNode } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

interface ICard {
    title: string;
    description: string;
    thumbnail: string;
    footer: ReactNode;
    onInfo?: () => void;
}

export default function Card(props: ICard) {
    return (
        <div className="group card">
            {/* Default title — fades out on hover */}
            <div className="relative z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-250">
                <div className="card--title flex items-center gap-1.5">
                    <h2>{props.title}</h2>
                    <IoInformationCircleOutline
                        onClick={(e) => { e.stopPropagation(); props.onInfo?.(); }}
                        className="opacity-60 hover:opacity-100 cursor-pointer shrink-0"
                    />
                </div>
            </div>

            {/* Thumbnail — blurs on hover */}
            <div
                className="card--content group-hover:blur-xs"
                style={{ backgroundImage: `url(${props.thumbnail})` }}
            />

            {/* Hover overlay */}
            <div
                className="absolute inset-0 z-20 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none group-hover:pointer-events-auto"
                style={{
                    background: "linear-gradient(160deg, rgba(85, 0, 255, 0.35) 0%, rgba(0, 0, 0, 0.92) 100%)",
                    borderRadius: "0.75rem",
                    backdropFilter: "blur(2px)",
                }}
            >
                <div className="relative">
                    <div className="card--title flex items-center gap-1.5">
                        <h2>{props.title}</h2>
                        <IoInformationCircleOutline
                            onClick={(e) => { e.stopPropagation(); props.onInfo?.(); }}
                            className="opacity-60 hover:opacity-100 cursor-pointer shrink-0"
                        />
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