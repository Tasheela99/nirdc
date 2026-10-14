import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import announcementApi from "../../../api/AnnouncementApi.ts";
import DOMPurify from 'dompurify';
import { useTranslation } from "react-i18next";
import PageHero from "@/components/common/PageHero";


const AnnouncementViewScreen = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [announcementItem, setAnnouncementItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setError('');
            setIsLoading(true);

            try {
                const response = await announcementApi.getAnnouncementById(id as string) as any;
                if (response.success) {
                    setAnnouncementItem(response.data);
                } else {
                    setError(response.message || "Failed to fetch announcement item. Please try again.");
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(`Network error occurred: ${errorMessage}. Please check your connection and try again.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    }

    if (!announcementItem) {
        return <div className="text-center py-20">No announcement found.</div>;
    }

    const currentLang = i18n.language || 'en';
    const isFieldEmpty = (val: string) => !val || (val.replace(/<[^>]*>?/gm, '').trim() === '' && !val.includes('<img'));

    const getLocalizedField = (fieldName: string) => {
        if (currentLang.startsWith('si')) {
            const val = announcementItem[`${fieldName}Si`];
            return isFieldEmpty(val) ? announcementItem[`${fieldName}En`] : val;
        }
        if (currentLang.startsWith('ta')) {
            const val = announcementItem[`${fieldName}Ta`];
            return isFieldEmpty(val) ? announcementItem[`${fieldName}En`] : val;
        }
        return announcementItem[`${fieldName}En`];
    };

    const title = getLocalizedField('title') || "No title available";
    const content = getLocalizedField('content') || "No content available";
    const image = (currentLang.startsWith('si') && announcementItem.imageSi) ? announcementItem.imageSi :
        (currentLang.startsWith('ta') && announcementItem.imageTa) ? announcementItem.imageTa :
            (currentLang.startsWith('en') && announcementItem.imageEn) ? announcementItem.imageEn :
                announcementItem.commonImage;

    return (
        <div className="min-h-screen bg-canvas dark:bg-dark-bg text-text-primary dark:text-gray-100 transition-colors duration-200">
            <PageHero
                badge={t("header.announcements", "Announcements")}
                title={title}
                subtitle={announcementItem.date || ""}
                breadcrumbs={[
                    { label: t("header.announcements", "Announcements"), href: "/announcements" },
                    { label: title },
                ]}
            />

            <section id="updates-announcement" className="py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <Link to="/announcements" className="inline-flex items-center text-primary hover:text-primary-dark font-medium mb-6 transition-colors">
                        <ChevronLeft className="mr-1.5" size={18} />
                        {t("announcements.backToAnnouncements", "Back to Announcements")}
                    </Link>

                    <article className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden">
                        {/* Featured Image */}
                        {image && (
                            <div className="w-full h-64 md:h-80 lg:h-96">
                                <img
                                    className="w-full h-full object-cover"
                                    src={image}
                                    alt={title}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        <div className="p-6 md:p-8 lg:p-10">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-main-color dark:text-white mb-4">
                                {title}
                            </h1>
                            <p className="text-sm text-third-color dark:text-gray-400 mb-6">
                                {announcementItem.date || "No date available"}
                            </p>
                            <div className="text-second-color dark:text-gray-300 leading-relaxed">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(content)
                                    }}
                                    style={{
                                        lineHeight: 1.7,
                                    }}
                                    className="prose prose-lg max-w-none dark:prose-invert
                                        prose-p:mb-4
                                        prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4
                                        prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3
                                        prose-h3:text-lg prose-h3:font-medium prose-h3:mb-2
                                        prose-strong:font-semibold
                                        prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1
                                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                                        prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto"
                                />
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default AnnouncementViewScreen;
