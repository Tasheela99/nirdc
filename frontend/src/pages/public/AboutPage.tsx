import { FC, lazy, Suspense } from 'react';

const StrategicObjectivesScreen = lazy(() => import('./home/StrategicObjectivesPage.tsx'));
const AboutUsScreen = lazy(() => import('./home/AboutUsPage.tsx'));

const AboutPage: FC = () => {
    return (
        <main className="min-h-screen bg-surface dark:bg-dark-bg">
            <Suspense fallback={<div className="h-64 bg-surface dark:bg-dark-bg animate-pulse" />}>
                <AboutUsScreen />
            </Suspense>
            <Suspense fallback={<div className="h-96 bg-surface dark:bg-dark-bg animate-pulse" />}>
                <StrategicObjectivesScreen />
            </Suspense>
        </main>
    );
};

export default AboutPage;
