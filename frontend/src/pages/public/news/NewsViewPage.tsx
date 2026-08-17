import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import newsApi from "../../../api/NewsApi.ts";
import DOMPurify from 'dompurify';
import { useTranslation } from "react-i18next";

const NewsViewScreen = () => {
    const { i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [newsItem, setNewsItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setError('');
            setIsLoading(true);

            try {
                const response = await newsApi.getNewsById(id) as any;
                if (response.success) {
                    setNewsItem(response.data);
                } else {
                    setError(response.message || "Failed to fetch news item. Please try again.");
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

    if (!newsItem) {
        return <div className="text-center py-20">No news found.</div>;
    }

    const currentLang = i18n.language || 'en';
    const isFieldEmpty = (val: string) => !val || (val.replace(/<[^>]*>?/gm, '').trim() === '' && !val.includes('<img'));
    
    const getLocalizedField = (fieldName: string) => {
        if (currentLang.startsWith('si')) {
            const val = newsItem[`${fieldName}Si`];
            return isFieldEmpty(val) ? newsItem[`${fieldName}En`] : val;
        }
        if (currentLang.startsWith('ta')) {
            const val = newsItem[`${fieldName}Ta`];
            return isFieldEmpty(val) ? newsItem[`${fieldName}En`] : val;
        }
        return newsItem[`${fieldName}En`];
    };

    const title = getLocalizedField('title') || "No title available";
    const content = getLocalizedField('content') || "No content available";
    const image = (currentLang.startsWith('si') && newsItem.imageSi) ? newsItem.imageSi :
                  (currentLang.startsWith('ta') && newsItem.imageTa) ? newsItem.imageTa :
                  (currentLang.startsWith('en') && newsItem.imageEn) ? newsItem.imageEn :
                  newsItem.commonImage;

    return (
        <section id="updates-news" className="bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <Link to="/all-news" className="inline-flex items-center text-main-color hover:text-third-color mb-6">
                    <ChevronLeft className="mr-2" size={20} />
                    Back to News
                </Link>

                <article className="bg-white rounded-lg shadow-md overflow-hidden">
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

                    <div className="p-4 md:p-6 lg:p-8">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-main-color mb-4">
                            {title}
                        </h1>
                        <p className="text-sm text-third-color mb-6">
                            {newsItem.date || "No date available"}
                        </p>
                        <div className="text-second-color leading-relaxed">
                            <div 
                                dangerouslySetInnerHTML={{ 
                                    __html: DOMPurify.sanitize(content) 
                                }}
                                style={{
                                    lineHeight: 1.7,
                                }}
                                className="prose prose-lg max-w-none 
                                    prose-p:mb-4 prose-p:text-second-color
                                    prose-h1:text-main-color prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4
                                    prose-h2:text-main-color prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3
                                    prose-h3:text-main-color prose-h3:text-lg prose-h3:font-medium prose-h3:mb-2
                                    prose-strong:text-main-color prose-strong:font-semibold
                                    prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1
                                    prose-blockquote:border-l-4 prose-blockquote:border-main-color prose-blockquote:pl-4 prose-blockquote:italic
                                    prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto"
                            />
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default NewsViewScreen;
