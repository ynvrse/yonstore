import { initDB } from '@/services/db';
import { Category } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const db = await initDB();
            const allCategory = await db.getAll('categories');
            setCategories(allCategory);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (category: Category) => {
        try {
            const db = await initDB();

            const existingCategories = await db.getAll('categories');
            const isNameTaken = existingCategories.some(
                (existingCategory) => existingCategory.name.toLowerCase() === category.name.toLowerCase(),
            );

            if (isNameTaken) {
                throw new Error('Category name already exists');
            }

            await db.add('categories', category);
            await fetchCategory();
        } catch (error: any) {
            if (error.message === 'Category name already exists') {
                console.error(error.message);
                toast.error(`Kategori ${category.name} sudah ada, silahkan gunakan nama lain`);
            } else {
                console.error('Gagal Menambahkan Kategori:', error);
                toast.error('Gagal Menambahkan Kategori. Silahkan coba lagi!');
            }
        }
    };

    const deleteCategory = async (name: string) => {
        try {
            const db = await initDB();
            await db.delete('categories', name);
            toast.success(`Kategori ${name} berhasil dihapus!`);
            await fetchCategory();
        } catch (error) {
            toast.error('Failed to delete category. Please check the key used for deletion.');
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    return { categories, loading, fetchCategory, addCategory, deleteCategory };
};

export default useCategory;
