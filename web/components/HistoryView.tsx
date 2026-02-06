import { useState, useEffect } from 'react';
import { getElectronAPI } from '@/lib/electron-bridge';
import { History, Trash2, Copy, Clock, AlertCircle } from 'lucide-react';

interface HistoryEntry {
    id: string;
    text: string;
    timestamp: number;
}

export function HistoryView() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [retention, setRetention] = useState<string>('forever');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const api = getElectronAPI();
        if (api) {
            try {
                const [hist, ret] = await Promise.all([
                    api.getHistory(),
                    api.getRetentionSettings()
                ]);
                setHistory(hist || []);
                setRetention(ret || 'forever');
            } catch (error) {
                console.error('Failed to load history:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    const handleRetentionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newVal = e.target.value;
        const api = getElectronAPI();
        if (api) {
            await api.setRetentionSettings(newVal);
            setRetention(newVal);
            // Reload history as it might have been cleaned
            const hist = await api.getHistory();
            setHistory(hist || []);
        }
    };

    const handleClearAll = async () => {
        if (!confirm('Are you sure you want to delete all history? This cannot be undone.')) return;
        const api = getElectronAPI();
        if (api) {
            await api.clearHistory();
            setHistory([]);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show a toast here
    };

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleString();
    };

    return (
        <div className="p-8 bg-white h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <History size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">History</h1>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Review your past dictations. Stored locally.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Auto-delete:</span>
                        <select
                            value={retention}
                            onChange={handleRetentionChange}
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            <option value="never">Never (Disable History)</option>
                            <option value="24h">After 24 Hours</option>
                            <option value="1w">After 1 Week</option>
                            <option value="1m">After 1 Month</option>
                            <option value="forever">Don't Auto-delete</option>
                        </select>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="text-red-500 text-xs hover:underline flex items-center gap-1"
                        >
                            <Trash2 size={12} /> Clear All History
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-400">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Clock className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No history yet</p>
                        <p className="text-sm text-gray-400 mt-1">Dictations will appear here based on your retention settings.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-300 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                        <Clock size={12} /> {formatDate(item.timestamp)}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(item.text)}
                                        className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded"
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
