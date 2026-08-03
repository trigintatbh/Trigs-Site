import { ReactNode } from "react";
import StarBackground from "./StarBackground";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Main({ children }: { children: ReactNode }) {
    useScrollReveal();

    return (
        <>
            <StarBackground />
            <main className="main">{children}</main>
        </>
    )
}
