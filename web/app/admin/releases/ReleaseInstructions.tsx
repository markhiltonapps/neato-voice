export default function ReleaseInstructions() {
    return (
        <div className="bg-vault-charcoal/50 border border-vault-olive p-6 rounded relative overflow-hidden mt-8">
            <h2 className="text-xl text-atom-teal mb-4 uppercase tracking-widest border-l-4 border-atom-teal pl-3">
                Release Protocol
            </h2>
            <div className="space-y-6 text-sm text-vault-paper font-mono">

                {/* Step 1 */}
                <div className="flex gap-4">
                    <div className="min-w-[24px] h-6 bg-atom-teal text-vault-navy font-bold rounded flex items-center justify-center">1</div>
                    <div>
                        <h3 className="font-bold text-atom-teal uppercase mb-1">Bump Version</h3>
                        <p className="text-vault-dust mb-2">
                            Open <code className="bg-black/30 px-1 py-0.5 rounded text-atom-amber">desktop/package.json</code>
                        </p>
                        <p className="text-vault-dust mb-2">Find line 3:</p>
                        <pre className="bg-black/50 p-2 rounded border border-vault-olive/20 text-xs text-gray-400">
                            "version": "<span className="text-white">1.0.0</span>",  ← Change this (e.g., to 1.0.1)
                        </pre>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                    <div className="min-w-[24px] h-6 bg-atom-teal text-vault-navy font-bold rounded flex items-center justify-center">2</div>
                    <div>
                        <h3 className="font-bold text-atom-teal uppercase mb-1">Build Installer</h3>
                        <p className="text-vault-dust mb-2">
                            Open your terminal (VS Code) and run:
                        </p>
                        <div className="bg-black/50 p-2 rounded border border-vault-olive/20 flex justify-between items-center group">
                            <code className="text-atom-green">cd desktop && npm run build</code>
                        </div>
                        <p className="text-vault-dust text-xs mt-1 italic">
                            Wait ~2 minutes. It will create <span className="text-white">Neato Voice Setup 1.0.1.exe</span> in <code className="text-gray-400">desktop/dist</code>.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                    <div className="min-w-[24px] h-6 bg-atom-teal text-vault-navy font-bold rounded flex items-center justify-center">3</div>
                    <div>
                        <h3 className="font-bold text-atom-teal uppercase mb-1">Upload to GitHub</h3>
                        <ol className="list-decimal list-inside space-y-1 text-vault-dust ml-1">
                            <li>Click the <strong className="text-white">"DEPLOY NEW VERSION"</strong> button above.</li>
                            <li>Click <strong className="text-white">"Draft a new release"</strong> (top right).</li>
                            <li>
                                <b>Choose a tag:</b> Type <code className="text-atom-amber">v1.0.1</code> (Must invoke 'v').
                            </li>
                            <li>
                                <b>Release title:</b> Type <code className="text-atom-amber">v1.0.1</code>.
                            </li>
                            <li>
                                <b>Attach binaries:</b> Drag the new <code className="text-white">.exe</code> file into the box.
                            </li>
                            <li>Click <strong className="text-atom-green">Publish release</strong>.</li>
                        </ol>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-atom-amber/10 border border-atom-amber/30 rounded text-atom-amber text-xs flex gap-2 items-center">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>
                        <strong>AUTO-UPDATE:</strong> Once you click "Publish", the desktop app will automatically detect this update for all users within 1-2 hours (or on next launch).
                    </span>
                </div>

            </div>
        </div>
    );
}
