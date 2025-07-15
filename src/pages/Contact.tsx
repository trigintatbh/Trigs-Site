import { FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {

    const [title, setTitle] = useState("hello");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        emailjs.send("service_537wizo", (() => {
            switch(title) {
                case "hello":
                    return "template_pwc488d";
                case "idea":
                    return "template_unhjf9j";
                default:
                    return "hello";
            }
        })(), {
            name: email,
            time: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: "MST"
            }),
            message,
            email
        }, {
            publicKey: "petHdFZUkk34VkEU0",
            blockHeadless: true,
            limitRate: {
                throttle: 30000, // 10s
            },
        }).then(() => {
            setMessage("");
            setEmail("");
        }).catch((err: any) => {
            alert(err.text);
            // alert(err.message);
        });
    }

    return (
        <div className="w-full flex justify-center relative gap-4 px-4 py-36">
            <div className="w-full max-w-2xl flex flex-col gap-4">
                <div className="flex flex-col gap-12">
                    <div className="w-full flex flex-col gap-2">
                        <h1 className="text-6xl">Get in touch</h1>
                        <p className="text-neutral-500 text-base">Have a question or idea? Let me know!</p>
                    </div>
                    <div className="w-full flex flex-col gap-8">
                        <form className="flex flex-col" onSubmit={(event) => handleSubmit(event)}>
                            <fieldset className="w-full flex flex-col gap-8 p-0">
                                <div className="flex flex-col gap-2">
                                    <div className="w-full flex items-center gap-2 p-2 bg-neutral-900 border border-neutral-800 rounded-2xl">
                                        <button onClick={() => setTitle("hello")} type="button" className={`w-full p-3 text-white text-base rounded-lg cursor-pointer ${title == "hello" ? "bg-blue-500" : "hover:bg-neutral-700"}`}>Say hello</button>
                                        <div className="w-[1px] h-4 bg-neutral-700"></div>
                                        <button onClick={() => setTitle("idea")} type="button" className={`w-full p-3 text-white text-base rounded-lg cursor-pointer ${title == "idea" ? "bg-green-500" : "hover:bg-neutral-700"}`}>Idea</button>
                                    </div>
                                    <p className="pl-4 text-neutral-300 text-sm">What would you like to discuss?</p>
                                </div>
                                <div className="w-full flex flex-col gap-1">
                                    <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-4 py-3 bg-neutral-900 text-white border border-neutral-700 rounded-lg disabled:opacity-50 svelte-u9vlid" type="email" name="email" placeholder="Enter your email" />
                                    <label className="pl-4 text-neutral-300 text-sm">Email address</label>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-36 max-h-72 resize-y px-4 py-3 bg-neutral-900 text-white border border-neutral-700 rounded-lg disabled:opacity-50" name="message" placeholder="Hi Trig!" minLength={5} maxLength={500}></textarea>
                                    <label className="pl-4 text-neutral-300 text-sm">Message</label>
                                </div>
                                <div className="flex">
                                    <button type="submit" className="min-w-24 h-10 px-5 flex items-center justify-center bg-white hover:bg-neutral-200 disabled:bg-neutral-400 text-sm text-black! rounded-lg enabled:cursor-pointer">Send</button>
                                </div>
                            </fieldset>
                        </form>
                        <div className="w-full flex items-center gap-2">
                            <hr className="flex-1 flex border-t border-neutral-700" />
                            <span className="text-neutral-300 text-xs">Or email me at</span>
                            <hr className="flex-1 flex border-t border-neutral-700" />
                        </div>
                        <div className="w-full flex flex-col sm:flex-row gap-4">
                            <a href="mailto:triginta777@gmail.com" target="_blank" className="w-full flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-neutral-800 rounded-lg backdrop-blur-sm">
                                <div className="w-10 h-10 flex items-center justify-center bg-neutral-700 bg rounded-full">
                                    <img src="../src/assets/logo.webp" alt="Logo" className="h-10 w-10 rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-base">triginta</span>
                                    <span className="text-neutral-300 text-sm">triginta777@gmail.com</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}