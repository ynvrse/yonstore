import { LucideIcon } from 'lucide-react';

interface EmptyDataProps {
    icon: LucideIcon;
    name: string | null;
    description?: string;
}

export default function EmptyData({ icon: Icon, name: name, description: description }: EmptyDataProps) {
    return (
        <div className="flex h-[calc(100vh-300px)] flex-col items-center justify-center space-y-6 text-center">
            <Icon className="h-24 w-24 text-gray-400" strokeWidth={1} />
            <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-800">{name} Anda Kosong</h2>
                {description && <p className="text-gray-500">{description}</p>}
            </div>
        </div>
    );
}
