import { initDB } from '@/services/db';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const useImage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const getImageById = useCallback(async (product_id: number) => {
        try {
            const db = await initDB();
            const productImage = await db.get('product_images', product_id);
            return productImage?.image ?? '';
        } catch (error) {
            console.error('Gagal mengambil gambar:', error);
            return '';
        }
    }, []);

    // Fungsi untuk mengubah ukuran gambar menggunakan canvas
    const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                if (!e.target?.result) {
                    reject(new Error('Failed to read file'));
                    return;
                }
                img.src = e.target.result as string;
            };

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Hitung dimensi baru sambil menjaga rasio aspek
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    } else {
                        width = (maxHeight / height) * width;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Gambar ulang gambar ke canvas dengan dimensi baru
                ctx.drawImage(img, 0, 0, width, height);

                // Konversi canvas ke Base64
                const resizedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(resizedBase64);
            };

            img.onerror = (error) => reject(error);

            reader.readAsDataURL(file);
        });
    };

    // Handle perubahan file gambar
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, product_id: number) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                // Ubah ukuran gambar sebelum konversi
                const resizedBase64 = await resizeImage(file, 500, 500, 0.7); // Atur maxWidth, maxHeight, dan kualitas sesuai kebutuhan
                setImagePreview(resizedBase64);
                await addImage(product_id, resizedBase64);
                toast.success('Gambar berhasil diunggah');
            } catch (error) {
                toast.error('Gagal memproses gambar');
                console.error('Error resizing image:', error);
            }
        }
    };

    const addImage = async (product_id: number, image: string) => {
        try {
            const db = await initDB();
            await db.put('product_images', { product_id: product_id, image: image });
        } catch (error: any) {
            toast.error('Gagal Menambahkan Gambar. Silahkan coba lagi!');
        }
    };

    const deleteImage = async (product_id: number) => {
        try {
            const db = await initDB();
            await db.delete('product_images', product_id);
            toast.success(`Gambar berhasil dihapus!`);
        } catch (error) {
            toast.error('Failed to delete category. Please check the key used for deletion.');
        }
    };

    return { getImageById, loading, handleImageChange, deleteImage, imagePreview };
};

export default useImage;
