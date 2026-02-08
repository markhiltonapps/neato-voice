export default function ReleaseInstructions() {
    return (
        <div className="bg-vault-charcoal/50 border border-vault-olive p-6 rounded relative overflow-hidden mt-8">
            <h2 className="text-xl text-atom-teal mb-4 uppercase tracking-widest border-l-4 border-atom-teal pl-3">
                Release Protocol (Automated)
            </h2>
            <div className="space-y-6 text-sm text-vault-paper font-mono">

                <div className="bg-atom-green/10 border border-atom-green/30 p-4 rounded text-atom-green mb-6">
                    <strong className="block mb-1">✅ 1-CLICK AUTOMATION ENABLED</strong>
                    You no longer need to manually edit files or drag-and-drop to GitHub.
                </div>

                {/* Step 1 */}
                <div className="flex gap-4">
                    <div className="min-w-[24px] h-6 bg-atom-teal text-vault-navy font-bold rounded flex items-center justify-center">1</div>
                    <div>
                        <h3 className="font-bold text-atom-teal uppercase mb-1">Open Terminal</h3>
                        <p className="text-vault-dust mb-2">
                            In VS Code, ensure you are in the <code className="text-white">desktop</code> folder:
                        </p>
                        <div className="bg-black/50 p-2 rounded border border-vault-olive/20 inline-block">
                            <code className="text-gray-400">cd desktop</code>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                    <div className="min-w-[24px] h-6 bg-atom-teal text-vault-navy font-bold rounded flex items-center justify-center">2</div>
                    <div>
                        <h3 className="font-bold text-atom-teal uppercase mb-1">Run Release Command</h3>
                        <p className="text-vault-dust mb-2">
                            Type this command and press Enter:
                        </p>
                        <div className="bg-black/50 p-2 rounded border border-vault-olive/20 flex justify-between items-center group">
                            <code className="text-atom-green font-bold">npm run release</code>
                        </div>
                        <p className="text-vault-dust text-xs mt-2">
                            The script will ask: <em className="text-white">"Patch, Minor, or Major?"</em>
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                    <div className="min-w-[24px] h-6 bg-atom-teal text-vault-navy font-bold rounded flex items-center justify-center">3</div>
                    <div>
                        <h3 className="font-bold text-atom-teal uppercase mb-1">Done</h3>
                        <p className="text-vault-dust">
                            The script will verify the code, build the executable, and automatically upload it to GitHub.
                        </p>
                        <p className="text-vault-dust mt-1">Users will receive the update automatically.</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-vault-olive/20 text-xs text-vault-rust">
                    <strong>NOTE:</strong> Ensure you have set your <code className="bg-black/30 px-1 rounded">GH_TOKEN</code> in your local .env file before running.
                </div>

            </div>
        </div>
    );
}
