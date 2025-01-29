import { initDB } from '@/services/db';
import { Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useAppConfig from './useAppConfig';

const useProduct = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { customProductName } = useAppConfig();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const db = await initDB();
            const allProducts = await db.getAll('products');
            setProducts(allProducts);
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
            toast.error('Gagal memuat produk');
        } finally {
            setLoading(false);
        }
    }, []);

    const getProductById = useCallback(async (id: number) => {
        try {
            const db = await initDB();
            return await db.get('products', id);
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
            return null;
        }
    }, []);

    const getStockProductById = useCallback(async (id: number) => {
        try {
            const db = await initDB();
            const product = await db.get('products', id);
            return product?.stock ?? 0;
        } catch (error) {
            console.error('Gagal mengambil stok:', error);
            return 0;
        }
    }, []);

    const searchProducts = useCallback(async (query: string) => {
        setLoading(true);
        try {
            const db = await initDB();
            const allProducts = await db.getAll('products');
            const filteredProducts = allProducts.filter((product: Product) =>
                product.name.toLowerCase().includes(query.toLowerCase()),
            );
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Gagal mencari produk:', error);
            toast.error('Gagal mencari produk');
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = useCallback(
        async (product: Product) => {
            try {
                const db = await initDB();

                await db.add('products', {
                    name: product.name,
                    price: Number(product.price),
                    stock: Number(product.stock),
                    category: product.category,
                    unitStock: product.unitStock,
                });
                toast.success(`${product.name} berhasil ditambahkan!`);
                await fetchProducts();
            } catch (error) {
                console.error('Gagal menambah produk:', error);
                toast.error('Gagal menambah produk');
            }
        },
        [fetchProducts],
    );

    const updateProduct = useCallback(
        async (product: Product) => {
            try {
                if (!product.product_id) {
                    throw new Error("Produk harus memiliki 'id'");
                }

                const db = await initDB();
                await db.put('products', product);
                toast.success(`${customProductName} berhasil diubah!`);
                await fetchProducts();
            } catch (error) {
                console.error('Gagal memperbarui produk:', error);
                toast.error('Gagal memperbarui produk');
            }
        },
        [fetchProducts, customProductName],
    );

    const updateProductStock = useCallback(
        async (productId: number, newStock: number, unitStock?: string) => {
            try {
                const db = await initDB();
                const product = await db.get('products', productId);

                if (product) {
                    const updatedProduct = {
                        ...product,
                        stock: newStock,
                        unitStock: unitStock || product.unitStock,
                    };

                    await db.put('products', updatedProduct);
                    toast.success('Stok berhasil diperbarui!');
                    await fetchProducts();
                } else {
                    toast.error(`${customProductName} tidak ditemukan!`);
                }
            } catch (error) {
                console.error('Gagal memperbarui stok:', error);
                toast.error('Gagal memperbarui stok');
            }
        },
        [fetchProducts, customProductName],
    );

    const deleteProduct = useCallback(
        async (id: number) => {
            try {
                const db = await initDB();
                await db.delete('products', id);
                await fetchProducts();
                toast.success(`${customProductName} berhasil dihapus!`);
            } catch (error) {
                console.error('Gagal menghapus produk:', error);
                toast.error('Gagal menghapus produk');
            }
        },
        [fetchProducts, customProductName],
    );

    useEffect(() => {
        let isMounted = true;
        const safeProductFetch = async () => {
            if (isMounted) {
                await fetchProducts();
            }
        };

        safeProductFetch();

        return () => {
            isMounted = false;
        };
    }, [fetchProducts]);

    return {
        products,
        loading,
        fetchProducts,
        getProductById,
        getStockProductById,
        searchProducts,
        addProduct,
        updateProduct,
        updateProductStock,
        deleteProduct,
    };
};

export default useProduct;
