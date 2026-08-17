
import React from "react";

const ProposalHeader: React.FC = () => {
    const lastUpdated = new Date().toLocaleString();

    // Removed proposal count and loading logic as they are unused

    return (
        <div className="bg-white shadow-lg border-b border-gray-200 relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    background: `radial-gradient(circle at 20% 80%, #003893 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, #001d4a 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, #003893 0%, transparent 50%)`
                }} />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-4xl font-bold text-gradient sm:text-5xl">
                            Proposal Management
                        </h1>
                        <p className="mt-3 text-xl text-gray-600">
                            Review and manage research and investment proposals with ease
                        </p>
                        <div className="mt-4 flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                System Online
                            </div>
                            <div className="text-sm text-gray-500">
                                Last updated: {lastUpdated}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalHeader;
