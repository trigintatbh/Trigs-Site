import { useEffect, useState } from "react";
import { FaYoutube, FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

interface YouTubeStats {
    subscribers: string;
    views: string;
    videos: string;
}

interface GitHubStats {
    followers: number;
    repos: number;
}

function formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return n.toString();
}

export default function SocialLinks() {
    const [yt, setYt] = useState<YouTubeStats | null>(null);
    const [ytLoading, setYtLoading] = useState(true);
    const [gh, setGh] = useState<GitHubStats | null>(null);
    const [ghLoading, setGhLoading] = useState(true);

    useEffect(() => {
        // Requires a free YouTube Data API v3 key exposed as VITE_YOUTUBE_API_KEY.
        // Without it, the card silently falls back to a plain link.
        const key = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
        if (!key) {
            setYtLoading(false);
            return;
        }

        fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=triginta777&key=${key}`)
            .then((res) => res.json())
            .then((data) => {
                const stats = data?.items?.[0]?.statistics;
                if (stats) {
                    setYt({
                        subscribers: formatCount(Number(stats.subscriberCount)),
                        views: formatCount(Number(stats.viewCount)),
                        videos: formatCount(Number(stats.videoCount)),
                    });
                }
            })
            .catch(() => {})
            .finally(() => setYtLoading(false));
    }, []);

    useEffect(() => {
        fetch("https://api.github.com/users/trigintatbh")
            .then((res) => res.json())
            .then((data) => {
                if (typeof data?.followers === "number") {
                    setGh({ followers: data.followers, repos: data.public_repos ?? 0 });
                }
            })
            .catch(() => {})
            .finally(() => setGhLoading(false));
    }, []);

    return (
        <section id="elsewhere" className="page-container elsewhere">
            <div className="flex flex-col gap-2 reveal">
                <span className="section-eyebrow">Elsewhere</span>
                <h2 className="text-3xl font-bold">Find me around</h2>
            </div>

            <div className="elsewhere--grid reveal">
                <a
                    href="https://www.youtube.com/@triginta777"
                    target="_blank"
                    rel="noreferrer"
                    className="elsewhere--card"
                >
                    <FaYoutube size={30} />
                    <div className="elsewhere--card-body">
                        <span className="elsewhere--card-title">YouTube</span>
                        <span className="elsewhere--card-sub">@triginta777</span>
                    </div>
                    <div className="elsewhere--stats">
                        {ytLoading ? (
                            <span className="elsewhere--skeleton" />
                        ) : yt ? (
                            <>
                                <span>{yt.subscribers} subs</span>
                                <span>{yt.views} views</span>
                                <span>{yt.videos} videos</span>
                            </>
                        ) : (
                            <span className="elsewhere--stats-muted">visit channel →</span>
                        )}
                    </div>
                </a>

                <a
                    href="https://github.com/trigintatbh"
                    target="_blank"
                    rel="noreferrer"
                    className="elsewhere--card"
                >
                    <FaGithub size={30} />
                    <div className="elsewhere--card-body">
                        <span className="elsewhere--card-title">GitHub</span>
                        <span className="elsewhere--card-sub">@trigintatbh</span>
                    </div>
                    <div className="elsewhere--stats">
                        {ghLoading ? (
                            <span className="elsewhere--skeleton" />
                        ) : gh ? (
                            <>
                                <span>{gh.followers} followers</span>
                                <span>{gh.repos} repos</span>
                            </>
                        ) : (
                            <span className="elsewhere--stats-muted">visit profile →</span>
                        )}
                    </div>
                </a>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=triginta777@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="elsewhere--card"
                >
                    <SiGmail size={26} />
                    <div className="elsewhere--card-body">
                        <span className="elsewhere--card-title">Gmail</span>
                        <span className="elsewhere--card-sub">triginta777@gmail.com</span>
                    </div>
                </a>
            </div>
        </section>
    );
}
