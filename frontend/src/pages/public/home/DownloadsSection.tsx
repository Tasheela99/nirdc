import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import downloadApi from '../../../api/DownloadApi';

const DownloadsSection: FC = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await downloadApi.getAllDownloads();
        if (response.status === true) {
          setDownloads(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch downloads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  if (loading) {
    return (
      <section className="bg-white dark:bg-dark-bg py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-12 flex justify-center items-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  // Do not render section if there are no downloads
  if (downloads.length === 0) return null;

  return (
    <section className="bg-white dark:bg-dark-bg py-16 lg:py-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-sans tracking-tight text-gray-900 dark:text-white">
            Downloads
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((doc, idx) => (
              <a 
                key={doc._id || idx} 
                href={doc.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all duration-300 flex items-start gap-4 group shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-1 block"
              >
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg text-primary shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1 group-hover:text-primary transition-colors leading-tight truncate">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {doc.fileType} • {doc.fileSize}
                  </p>
                </div>
                <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors mt-1 shrink-0">
                  <Download className="w-6 h-6" />
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadsSection;
