import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (installPrompt) {
            (installPrompt as any).prompt(); // Tampilkan prompt instalasi
            const result = await (installPrompt as any).userChoice;
            if (result.outcome === 'accepted') {
                console.log('PWA installed successfully');
            } else {
                console.log('PWA installation dismissed');
            }
            setInstallPrompt(null);
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            {isInstallable && (
                <button
                    onClick={handleInstall}
                    className="flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                >
                    <Download className="h-5 w-5" />
                    Install App
                </button>
            )}
            {!isInstallable && <p className="text-gray-500">App is already installed or not supported.</p>}
        </div>
    );
}
