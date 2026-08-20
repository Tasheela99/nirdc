import { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const Text: FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const messages = [
        t("ticker.msg1"),
        t("ticker.msg2"),
        t("ticker.msg3"),
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeOut(true);
            setTimeout(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setFadeOut(false);
            }, 800);
        }, 5000);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <section className={`flex flex-col ${isHome ? 'absolute w-full top-[80px] z-40' : ''}`} aria-label="Key messages">
            <div className={`${isHome ? 'bg-transparent' : 'bg-primary dark:bg-primary-dark'} py-14 text-white flex flex-col items-center justify-center`}>
                <div className="max-w-4xl px-4 text-center">
                    <p
                        className={`text-xl md:text-2xl font-medium tracking-wide ${fadeOut ? "opacity-0" : "opacity-100"
                            } transition-opacity duration-800`}
                    >
                        {messages[currentMessageIndex]}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Text;
