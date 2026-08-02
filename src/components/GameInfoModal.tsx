import { ReactNode } from "react";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";

export interface GameInfo {
    title: string;
    thumbnail: string;
    description: string;
    details?: ReactNode;
    howTo?: ReactNode;
}

interface GameInfoModalProps {
    game: GameInfo | null;
    onClose: () => void;
}

export default function GameInfoModal({ game, onClose }: GameInfoModalProps) {
    if (!game) return null;

    return (
        <div className="info-modal" onClick={onClose}>
            <div className="info-modal--frame" onClick={(e) => e.stopPropagation()}>
                <div className="info-modal--bar">
                    <div className="flex items-center gap-2">
                        <IoInformationCircleOutline />
                        <span>{game.title}</span>
                    </div>
                    <span className="close-icon-wrapper" onClick={onClose}>
                        <IoClose />
                    </span>
                </div>
                <div className="info-modal--body">
                    <div className="info-modal--howto">
                        <h3>Details</h3>
                        <div className="info-modal--howto-content">{game.details || "No details yet"}</div>
                    </div>
                    <div className="info-modal--howto">
                        <h3>How to play</h3>
                        <div className="info-modal--howto-content">{game.howTo || "No description yet"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
