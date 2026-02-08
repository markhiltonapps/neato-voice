import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DownloadPage() {
    // Redirect to the latest release asset on GitHub
    // This URL format automatically resolves to the latest release's tag
    redirect('https://github.com/markhiltonapps/neato-voice/releases/latest/download/Neato.Voice.Setup.exe');

    // Fallback UI (though redirect happens on server)
    return (
        <div className="flex min-h-screen items-center justify-center bg-vault-navy text-vault-paper font-mono">
            <div className="text-center p-8 bg-vault-charcoal border border-atom-green rounded shadow-[0_0_30px_rgba(57,255,20,0.1)]">
                <div className="w-12 h-12 border-4 border-atom-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h1 className="text-xl text-atom-green mb-2">INITIALIZING DOWNLOAD SEQUENCE...</h1>
                <p className="text-vault-dust">Connecting to Secure Repository...</p>
                <a
                    href="https://github.com/markhiltonapps/neato-voice/releases/latest/download/Neato.Voice.Setup.exe"
                    className="mt-6 inline-block text-xs border border-atom-teal text-atom-teal px-4 py-2 hover:bg-atom-teal hover:text-vault-navy transition-colors"
                >
                    CLICK IF STALLED
                </a>
            </div>
        </div>
    );
}
