import { lazy, Suspense } from 'react';

const MainBannerPage = lazy(() => import('./home/MainBannerPage.tsx'));
const AdPopupModal = lazy(() => import('../../components/common/AdPopupModal.tsx'));

function Home() {
    return (
        <main>
            <Suspense fallback={<div className="h-[85vh] bg-surface dark:bg-dark-bg animate-pulse" />}>
                <MainBannerPage />
            </Suspense>

            {/* Popup Ad Modal */}
            <Suspense fallback={null}>
                <AdPopupModal />
            </Suspense>
        </main>
    );
}

export default Home;

