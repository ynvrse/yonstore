import useHandleCsv from '@/hooks/useHandleCsv';
import { Loader2, UploadCloud } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ImportCsv() {
    const [loading, setLoading] = useState(false); // State untuk loading
    const { csvFileToArray } = useHandleCsv(); // Hook untuk mengelola file CSV
    const navigate = useNavigate();
    const fileReader = new FileReader();

    // Fungsi untuk menangani perubahan input file
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            toast.error('No file selected.');
            return;
        }

        setLoading(true);

        try {
            // Membaca konten file setelah berhasil diunggah
            fileReader.onload = (event) => {
                const text = event.target?.result as string;
                if (text) {
                    try {
                        csvFileToArray(text); // Parsing file CSV
                    } catch (error) {
                        console.error('Error parsing CSV:', error);
                        toast.error('Error parsing CSV file. Please check the file format.');
                    }
                }
            };

            fileReader.readAsText(selectedFile);
        } catch (error) {
            toast.error('An error occurred during the upload.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="my-4 flex items-center gap-x-2">
                <div className="flex-grow border-t border-slate-400"></div>
                <span className="text-sm text-gray-500">atau</span>
                <div className="flex-grow border-t border-slate-400"></div>
            </div>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                    <label
                        htmlFor="csv-upload"
                        className={`relative flex h-10 items-center justify-center gap-x-2 rounded-lg border bg-lime-400 font-medium text-black transition-all hover:bg-gray-100 hover:shadow-md ${
                            loading ? 'pointer-events-none opacity-50' : ''
                        }`}
                    >
                        <input
                            id="csv-upload"
                            type="file"
                            className="absolute inset-0 z-10 cursor-pointer opacity-0"
                            onChange={handleOnChange}
                            disabled={loading}
                            aria-label="Upload CSV file"
                        />
                        {loading ? (
                            <div className="flex items-center gap-x-2">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-2">
                                <UploadCloud color="black" />
                                <span>Import Data</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
}
