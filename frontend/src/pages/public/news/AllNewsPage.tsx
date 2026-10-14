import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import DOMPurify from 'dompurify';
import newsApi from "../../../api/NewsApi.ts";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/common/PageHero";


const AllNewsScreen = () => {
  const { t, i18n } = useTranslation();
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const placeholderImage = "https://fakeimg.pl/600x400";

  const fetchNews = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await newsApi.getAllNews() as any;

      if (response.status === true) {
        setNewsList(response.data);
      } else {
        setError("Failed to fetch news. Please try again.");
      }
    } catch (error) {
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape to clear search
      if (event.key === 'Escape' && searchQuery) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Filter news based on search query
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) {
      return newsList;
    }
    
    return newsList.filter((item: any) => {
      const currentLang = i18n.language || 'en';
      const isFieldEmpty = (val: string) => !val || (val.replace(/<[^>]*>?/gm, '').trim() === '' && !val.includes('<img'));
      
      const getLocalizedField = (fieldName: string) => {
          if (currentLang.startsWith('si')) {
              const val = item[`${fieldName}Si`];
              return isFieldEmpty(val) ? item[`${fieldName}En`] : val;
          }
          if (currentLang.startsWith('ta')) {
              const val = item[`${fieldName}Ta`];
              return isFieldEmpty(val) ? item[`${fieldName}En`] : val;
          }
          return item[`${fieldName}En`];
      };
      
      const title = getLocalizedField('title') || "";
      const content = getLocalizedField('content') || "";

      return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             content.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [newsList, searchQuery, i18n.language]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Function to highlight search terms in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary dark:text-gray-400">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={fetchNews}
            className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-bg text-text-primary dark:text-gray-100 transition-colors duration-200">
      {/* Hero Section */}
      <PageHero
        badge={t("header.news", "News")}
        title={t("header.updatesNews", "News & Updates")}
        subtitle={t(
          "news.heroSubtitle",
          "Stay informed with the latest news, updates, and research breakthroughs from NIRDC."
        )}
        breadcrumbs={[{ label: t("header.updatesNews", "News & Updates") }]}
      />

      {/* News List Section */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Search Bar Toolbar */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news articles... (Ctrl+K)"
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 dark:hover:text-gray-200 text-gray-400 transition-colors"
                  title="Clear search (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Total Articles Count */}
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-text-secondary dark:text-gray-400 font-medium">
                {filteredNews.length} {filteredNews.length === 1 ? "article" : "articles"}
              </span>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:text-primary-light hover:bg-primary/20 font-medium transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
          {/* Search Results Info */}
          {searchQuery && (
            <div className="flex justify-between items-center mb-6">
              <div className="p-4 bg-primary/10 dark:bg-primary-light/10 rounded-xl border border-primary/20 dark:border-primary-light/30 flex-1 mr-4">
                <p className="text-primary dark:text-primary-light font-medium">
                  {filteredNews.length > 0 
                    ? `Found ${filteredNews.length} result${filteredNews.length !== 1 ? 's' : ''} for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`
                  }
                </p>
                {filteredNews.length === 0 && (
                  <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">
                    Try different keywords or check your spelling
                  </p>
                )}
              </div>
              
              {/* Quick search clear button */}
              <button
                onClick={clearSearch}
                className="px-4 py-2 text-sm bg-primary/10 dark:bg-primary-light/20 text-primary dark:text-primary-light font-medium rounded-xl hover:bg-primary/20 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {newsList.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <p className="text-text-secondary dark:text-gray-400 text-lg">No news articles available at the moment.</p>
              <p className="text-text-secondary dark:text-gray-500 text-sm mt-2">Please check back later for updates.</p>
            </div>
          ) : filteredNews.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto" />
              </div>
              <p className="text-text-secondary dark:text-gray-400 text-lg">No articles match your search</p>
              <p className="text-text-secondary dark:text-gray-500 text-sm mt-2">Try searching with different keywords</p>
              <button
                onClick={clearSearch}
                className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all shadow-md"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item: any) => {
                const currentLang = i18n.language || 'en';
                const isFieldEmpty = (val: string) => !val || (val.replace(/<[^>]*>?/gm, '').trim() === '' && !val.includes('<img'));
                
                const getLocalizedField = (fieldName: string) => {
                    if (currentLang.startsWith('si')) {
                        const val = item[`${fieldName}Si`];
                        return isFieldEmpty(val) ? item[`${fieldName}En`] : val;
                    }
                    if (currentLang.startsWith('ta')) {
                        const val = item[`${fieldName}Ta`];
                        return isFieldEmpty(val) ? item[`${fieldName}En`] : val;
                    }
                    return item[`${fieldName}En`];
                };
                
                const title = getLocalizedField('title') || "Untitled Article";
                const content = getLocalizedField('content') || "Content not available at the moment.";
                
                const image = (currentLang.startsWith('si') && item.imageSi) ? item.imageSi :
                              (currentLang.startsWith('ta') && item.imageTa) ? item.imageTa :
                              (currentLang.startsWith('en') && item.imageEn) ? item.imageEn :
                              item.commonImage;

                return (
                <article key={item._id} className="bg-surface dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={image || placeholderImage}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date */}
                      <p className="text-sm text-text-secondary dark:text-gray-400 mb-2 font-body">
                        {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "Date not available"}
                      </p>

                      {/* Title */}
                      <h2 
                        className="text-xl font-bold text-text-primary dark:text-white mb-3 line-clamp-2 hover:text-primary dark:hover:text-primary-light transition-colors duration-300 font-sans"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(highlightSearchTerm(title, searchQuery))
                        }}
                      />

                      {/* Description */}
                      <div 
                        className="text-text-secondary dark:text-gray-300 mb-4 text-sm line-clamp-3 prose prose-sm max-w-none dark:prose-invert font-body"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(highlightSearchTerm(content, searchQuery))
                        }}
                      />
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="px-6 pb-6 pt-0">
                    <Link
                      to={`/news-updates/${item.slug || item._id}`}
                      className="inline-flex items-center text-primary dark:text-primary-light font-semibold hover:text-primary-dark dark:hover:text-white transition-colors duration-300 text-sm"
                    >
                      Read More
                      <svg 
                        className="ml-2 w-4 h-4 transform hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              )})}
            </div>
          )}

          {/* Back to Home Link */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              <svg 
                className="mr-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllNewsScreen;
