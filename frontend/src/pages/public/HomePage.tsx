import { lazy, Suspense } from 'react';

const MainBannerPage = lazy(() => import('./home/MainBannerPage.tsx'));
const VisionMissionSection = lazy(() => import('./home/VisionMissionSection.tsx'));
const AdPopupModal = lazy(() => import('../../components/common/AdPopupModal.tsx'));

function Home() {
    return (
        <main>
            <Suspense fallback={<div className="h-[85vh] bg-surface dark:bg-dark-bg animate-pulse" />}>
                <MainBannerPage />
            </Suspense>

            {/* Prominently displayed Vision & Mission Section */}
            <Suspense fallback={<div className="min-h-[400px] bg-surface dark:bg-dark-bg animate-pulse" />}>
                <VisionMissionSection />
                
            </Suspense>


            {/* Popup Ad Modal */}
            <Suspense fallback={null}>
                <AdPopupModal />
            </Suspense>
        </main>
    );
}

export default Home;

