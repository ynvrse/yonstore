import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ loading }: { loading: boolean }) {
    if (!loading) return null; // Pastikan mengembalikan null jika loading false

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
            <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
            </div>
        </div>
    );
}
