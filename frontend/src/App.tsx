import { UserContextProvider } from "./store/UserContext.tsx";
import AppRouter from "./AppRouter.tsx";
import ReactGA from "react-ga4";
import {BrowserRouter} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { AlertProvider } from "./components/common/AlertContextScreen.tsx";
import { DarkModeProvider } from "./store/DarkModeContext.tsx";
import { useTranslation } from "react-i18next";
import CookieConsent from "./components/common/CookieConsent.tsx";

function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        ReactGA.initialize("G-1PG6H58JEF");
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }, []);

    // Sync html lang attribute on language change
    useEffect(() => {
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <HelmetProvider>
            <DarkModeProvider>
                <AlertProvider>
                    <UserContextProvider>
                        <Helmet>
                            <title>NIRDC - National Initiative for R&D Commercialisation | Sri Lanka</title>
                            <meta name="description" content="NIRDC connects Sri Lankan researchers with investors to commercialize high-impact R&D projects. Submit proposals, find funding, and drive innovation." />
                            <meta name="keywords" content="NIRDC, R&D Sri Lanka, research commercialization, research funding, innovation Sri Lanka, investor matching, research proposals" />
                            <meta property="og:title" content="NIRDC - National Initiative for R&D Commercialisation" />
                            <meta property="og:description" content="Connecting Sri Lankan researchers with investors to commercialize high-impact R&D projects." />
                            <meta property="og:type" content="website" />
                            <meta property="og:url" content="https://nirdc.gov.lk" />
                            <meta property="og:image" content="https://nirdc.gov.lk/assets/NIRDC-WEB-LOGO.svg" />
                            <meta property="og:site_name" content="NIRDC Sri Lanka" />
                            <meta property="og:image:width" content="513" />
                            <meta property="og:image:height" content="300" />
                            <meta name="twitter:card" content="summary_large_image" />
                            <meta name="twitter:title" content="NIRDC - R&D Commercialisation Sri Lanka" />
                            <meta name="twitter:description" content="Connecting Sri Lankan researchers with investors to commercialize high-impact R&D projects." />
                            <meta name="twitter:image" content="https://nirdc.gov.lk/assets/NIRDC-WEB-LOGO.svg" />
                        </Helmet>
                        <BrowserRouter>
                            <AppRouter />
                            <CookieConsent />
                        </BrowserRouter>
                    </UserContextProvider>
                </AlertProvider>
            </DarkModeProvider>
        </HelmetProvider>
    );
}

export default App;
