import React from 'react';
import { AutoSaveStatus } from '../../hooks/useAutoSave';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface AutoSaveIndicatorProps {
    status: AutoSaveStatus;
    lastSavedAt: Date | null;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status, lastSavedAt }) => {
    if (status === 'idle' && !lastSavedAt) {
        return null;
    }

    let statusText = '';
    let statusClass = 'text-gray-500';
    let Icon = null;

    if (status === 'saving') {
        statusText = 'Saving...';
        statusClass = 'text-gray-500 animate-pulse';
        Icon = <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />;
    } else if (status === 'saved' && lastSavedAt) {
        const timeString = lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        statusText = `Draft saved at ${timeString}`;
        statusClass = 'text-green-600';
        Icon = <CheckCircle2 className="w-4 h-4 mr-1.5" />;
    } else if (status === 'error') {
        statusText = 'Failed to save draft';
        statusClass = 'text-red-500';
        Icon = <XCircle className="w-4 h-4 mr-1.5" />;
    } else if (status === 'idle' && lastSavedAt) {
        const timeString = lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        statusText = `Draft saved at ${timeString}`;
        statusClass = 'text-gray-500';
        Icon = <CheckCircle2 className="w-4 h-4 mr-1.5" />;
    }

    return (
        <div className={`flex items-center text-sm font-medium ${statusClass} transition-all duration-300`}>
            {Icon}
            {statusText}
        </div>
    );
};

export default AutoSaveIndicator;
