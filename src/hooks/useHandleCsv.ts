import { formatDate } from '@/lib/utils';
import { initDB } from '@/services/db';
import { Category, Product } from '@/types';
import { useCallback } from 'react';
import { toast } from 'sonner';
import useAppConfig from './useAppConfig';

const useHandleCsv = () => {
    const { customProductName } = useAppConfig();

    const generateProductId = (): number => {
        const now = new Date();
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Menit dalam format 2 digit
        const seconds = now.getSeconds().toString().padStart(2, '0'); // Detik dalam format 2 digit
        const random = Math.floor(1000 + Math.random() * 9000); // 4 angka acak (1000-9999)
        return parseInt(`${minutes}${seconds}${random}`, 10); // Gabungkan dan jadikan integer
    };
    // Fungsi untuk menambahkan produk ke IndexedDB
    const addProduct = useCallback(async (product: Product) => {
        try {
            const db = await initDB();
            await db.add('products', product);
        } catch (error) {
            toast.error('Failed to add product: ' + error);
        }
    }, []);

    // Fungsi untuk menambahkan kategori ke IndexedDB
    const addCategory = async (category: Category) => {
        const db = await initDB();

        const existingCategories = await db.getAll('categories');
        const isNameTaken = existingCategories.some(
            (existingCategory) => existingCategory.name.toLowerCase() === category.name.toLowerCase(),
        );

        if (!isNameTaken) {
            await db.add('categories', category);
        }
    };

    // Fungsi untuk memproses CSV secara bertahap
    const csvFileToArray = useCallback(
        async (csvString: string, batchSize: number = 100) => {
            const [headerLine, ...rows] = csvString.split('\n').filter(Boolean);
            const headers = headerLine.split(';').map((h) => h.trim());

            // Validasi header
            const expectedHeaders = {
                no: ['no', 'Product ID'],
                name: ['name', 'Name', 'Nama Produk'],
                price: ['price', 'Price', 'Harga'],
                category: ['category', 'Category', 'Kategori'],
                stock: ['stock', 'Stock', 'Stok'],
                unitStock: ['unitStock', 'Unit Stock', 'Satuan'],
            };

            const validateHeaders = (headerKey: keyof typeof expectedHeaders, actualHeader: string) => {
                return expectedHeaders[headerKey].includes(actualHeader);
            };

            const isValidHeaders =
                validateHeaders('no', headers[0]) &&
                validateHeaders('name', headers[1]) &&
                validateHeaders('price', headers[2]) &&
                validateHeaders('category', headers[3]);

            if (!isValidHeaders) {
                toast.error('File CSV tidak sesuai dengan format yang diharapkan.');
                return;
            }

            let rowCount = 0;
            let failedCount = 0;
            let currentBatch: Product[] = [];
            let categoriesToAdd: Category[] = [];

            // Fungsi untuk memproses setiap baris dalam CSV
            const processRow = (row: string, index: number) => {
                const values = row.split(';').map((v) => v.trim());
                console.log(`Processing row ${index + 1}: `, values); // Debugging: melihat data yang diproses

                // Validasi jumlah kolom
                if (values.length < 3) {
                    toast.error(`Baris ${index + 1} tidak memiliki data yang cukup (name, price, category).`); // Debugging: melihat baris yang gagal
                    failedCount++;
                    return;
                }

                const [no, name, price, category, stock, unitStock] = values;

                // Validasi tipe data untuk name, price, dan category
                if (!name || !price || !category || isNaN(parseFloat(price))) {
                    toast.error(`Baris ${index + 1} mengandung data yang tidak valid (name, price, category).`); // Debugging: melihat baris yang gagal
                    failedCount++;
                    return;
                }

                // Set default value untuk stock dan unitStock
                const product: Product = {
                    product_id: generateProductId(),
                    name,
                    price: parseFloat(price),
                    category,
                    stock: stock ? parseInt(stock, 10) : 1,
                    unitStock: unitStock || '',
                };

                const newCategory: Category = { name: category };

                categoriesToAdd.push(newCategory);

                currentBatch.push(product);
                rowCount++;

                // Jika batch penuh, tambahkan produk dan kategori
                if (currentBatch.length >= batchSize) {
                    addProductBatch(currentBatch);
                    addCategoryBatch(categoriesToAdd);
                    currentBatch = [];
                    categoriesToAdd = [];
                }
            };

            // Memproses setiap baris dalam CSV
            rows.forEach(processRow);

            // Proses sisa batch yang belum terproses
            if (currentBatch.length > 0) {
                addProductBatch(currentBatch);
                addCategoryBatch(categoriesToAdd);
            }

            toast.success(`Sebanyak ${rowCount} produk berhasil ditambahkan.`);
            if (failedCount > 0) {
                toast.error(`Ada ${failedCount} baris yang gagal diproses.`);
            }
        },
        [addProduct, addCategory],
    );

    // Batch processing untuk produk
    const addProductBatch = useCallback(async (batch: Product[]) => {
        try {
            const db = await initDB();
            const tx = db.transaction('products', 'readwrite');
            const store = tx.objectStore('products');

            for (const product of batch) {
                try {
                    await store.put(product); // Ganti add dengan put
                } catch (error) {
                    console.warn(`Failed to process product: ${product.name}`, error);
                }
            }

            await tx.done;
            console.log('Batch of products successfully added.');
        } catch (error) {
            console.error('Error in addProductBatch:', error);
        }
    }, []);

    const addCategoryBatch = useCallback(async (batch: Category[]) => {
        try {
            const db = await initDB();
            const tx = db.transaction('categories', 'readwrite');
            const store = tx.objectStore('categories');

            for (const category of batch) {
                try {
                    await store.put(category); // Ganti add dengan put
                } catch (error) {
                    console.warn(`Failed to process category: ${category.name}`, error);
                }
            }

            await tx.done;
            console.log('Batch of categories successfully added.');
        } catch (error) {
            console.error('Error in addCategoryBatch:', error);
        }
    }, []);

    const downloadProductsAsCSV = async () => {
        try {
            // Buka koneksi ke IndexedDB
            const db = await new Promise<IDBDatabase>((resolve, reject) => {
                const request = indexedDB.open('database');

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            const transaction = db.transaction('products', 'readonly');
            const objectStore = transaction.objectStore('products');

            // Ambil semua data dari object store
            const products = await new Promise<any[]>((resolve, reject) => {
                const request = objectStore.getAll();

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });

            if (products.length === 0) {
                toast.error('Tidak ada data produk untuk diunduh.');
                return;
            }

            // Buat header CSV
            const headers = ['Product ID', 'Name', 'Price', 'Category', 'Stock', 'Unit Stock'];

            // Konversi data ke format CSV
            const csvRows = [
                headers.join(';'), // Header
                ...products.map((product) =>
                    [
                        product.product_id,
                        product.name,
                        product.price,
                        product.category,
                        product.stock,
                        product.unitStock,
                    ]
                        .map((value) => (value != null ? value.toString() : '')) // Pastikan tidak ada nilai `null` atau `undefined`
                        .join(';'),
                ),
            ];

            // Gabungkan semua baris menjadi string CSV
            const csvContent = csvRows.join('\n');

            // Buat Blob untuk file CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            // Buat link unduhan
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const addCustomName = formatDate(new Date());
            link.href = url;
            link.download = `products-backup-${addCustomName}.csv`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('File CSV berhasil diunduh.');
        } catch (error) {
            console.error('Gagal mengunduh file CSV:', error);
            toast.error('Gagal mengunduh file CSV.');
        }
    };

    return { csvFileToArray, downloadProductsAsCSV };
};

export default useHandleCsv;
