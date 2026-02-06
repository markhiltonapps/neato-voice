import { useState, useEffect } from 'react';
import { getElectronAPI } from '@/lib/electron-bridge';
import { Trash2, Plus, Book } from 'lucide-react';

export function DictionarySettings() {
    const [words, setWords] = useState<string[]>([]);
    const [newWord, setNewWord] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDictionary();
    }, []);

    const loadDictionary = async () => {
        try {
            const api = getElectronAPI();
            if (api) {
                const list = await api.getDictionary();
                setWords(list || []);
            }
        } catch (error) {
            console.error('Failed to load dictionary:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newWord.trim()) return;

        try {
            const api = getElectronAPI();
            if (api) {
                const list = await api.addDictionaryWord(newWord.trim());
                setWords(list);
                setNewWord('');
            }
        } catch (error) {
            console.error('Failed to add word:', error);
        }
    };

    const handleRemove = async (word: string) => {
        try {
            const api = getElectronAPI();
            if (api) {
                const list = await api.removeDictionaryWord(word);
                setWords(list);
            }
        } catch (error) {
            console.error('Failed to remove word:', error);
        }
    };

    return (
        <div className="p-8 bg-white h-full overflow-y-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Book size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Personal Dictionary</h1>
                </div>
                <p className="text-gray-600 max-w-2xl">
                    Add custom words, names, or technical terms here. Neato Voice will learn to recognize them more accurately during dictation.
                </p>
            </div>

            <div className="max-w-xl">
                <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        placeholder="Enter a word or phrase..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newWord.trim()}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add
                    </button>
                </form>

                {isLoading ? (
                    <div className="text-center py-8 text-gray-400">Loading dictionary...</div>
                ) : words.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No custom words yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Add names like "Neato" or "Antigravity"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {words.map((word) => (
                            <div key={word} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-gray-200 transition-colors">
                                <span className="font-medium text-gray-800">{word}</span>
                                <button
                                    onClick={() => handleRemove(word)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove word"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
