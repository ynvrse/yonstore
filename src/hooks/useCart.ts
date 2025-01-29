import { initDB } from '@/services/db';
import { CartItem } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const useCart = () => {
    const [carts, setCarts] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    let eventTimer: NodeJS.Timeout;

    const dispatchCartUpdated = () => {
        clearTimeout(eventTimer);
        eventTimer = setTimeout(() => {
            document.dispatchEvent(new Event('cartUpdated'));
        }, 100);
    };

    const fetchCarts = useCallback(async () => {
        setLoading(true);
        try {
            const db = await initDB();
            const cartItems = await db.getAll('carts');

            setCarts(cartItems);
        } catch (error) {
            console.error('Failed to fetch carts:', error);
            toast.error('Gagal mengambil keranjang');
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = useCallback(
        async (cartItem: CartItem) => {
            setLoading(true);
            try {
                const db = await initDB();
                const cartItemExist = await db.get('carts', cartItem.product.product_id);
                const stockProduct = await getStockProduct(cartItem.product.product_id);

                if (cartItemExist) {
                    await qtyIncrement(cartItem, cartItemExist);
                } else if (stockProduct > 0) {
                    await db.add('carts', {
                        ...cartItem,
                        quantity: 1,
                        stock_product: stockProduct,
                        total_price: cartItem.product.price,
                    });
                    dispatchCartUpdated();

                    toast.success(`${cartItem.product.name} ditambahkan ke keranjang`);
                } else {
                    toast.warning('Stok produk habis');
                }

                await fetchCarts();
            } catch (error) {
                console.error('Gagal menangani item keranjang:', error);
                toast.error('Gagal menambah item');
            } finally {
                setLoading(false);
            }
        },
        [fetchCarts],
    );

    const removeFromCart = useCallback(
        async (cartItem: CartItem) => {
            setLoading(true);
            try {
                const db = await initDB();
                const cartItemExist = await db.get('carts', cartItem.product.product_id);

                if (cartItemExist) {
                    await db.delete('carts', cartItem.product.product_id);
                    toast.success(`${cartItem.product.name} dihapus dari keranjang`);
                    dispatchCartUpdated();

                    await fetchCarts();
                } else {
                    toast.error(`${cartItem.product.name} gagal dihapus`);
                }
            } catch (error) {
                console.error('Gagal menghapus item:', error);
                toast.error('Gagal menghapus item');
            } finally {
                setLoading(false);
            }
        },
        [fetchCarts],
    );

    const qtyIncrement = useCallback(
        async (cartItem: CartItem, cartItemExist: any) => {
            try {
                const db = await initDB();
                if (cartItemExist.quantity < cartItemExist.stock_product) {
                    await db.put('carts', {
                        ...cartItemExist,
                        quantity: cartItemExist.quantity + 1,
                        total_price: cartItemExist.total_price + cartItem.product.price,
                    });
                    dispatchCartUpdated();

                    await fetchCarts();
                } else {
                    toast.warning('Stok tidak mencukupi');
                }
            } catch (error) {
                console.error('Gagal menambah kuantitas:', error);
                toast.error('Gagal menambah kuantitas');
            }
        },
        [fetchCarts],
    );

    const qtyDecrement = useCallback(
        async (cartItem: CartItem) => {
            setLoading(true);
            try {
                const db = await initDB();
                const item = await db.get('carts', cartItem.product.product_id);

                if (item) {
                    if (item.quantity > 1) {
                        await db.put('carts', {
                            ...item,
                            quantity: item.quantity - 1,
                            total_price: item.total_price - item.product.price,
                        });
                        dispatchCartUpdated();
                    } else {
                        await db.delete('carts', cartItem.product.product_id);
                        toast.info(`${cartItem.product.name} dihapus dari keranjang`);
                    }
                    await fetchCarts();
                }
            } catch (error) {
                console.error('Gagal menurunkan kuantitas:', error);
                toast.error('Gagal menurunkan kuantitas');
            } finally {
                setLoading(false);
            }
        },
        [fetchCarts],
    );

    const getProductQty = useCallback(async (productId: number) => {
        try {
            const db = await initDB();
            const product = await db.get('carts', productId);
            return product?.quantity ?? 0;
        } catch (error) {
            console.error('Gagal mengambil kuantitas produk:', error);
            return 0;
        }
    }, []);

    const getTotalItems = useCallback(async () => {
        try {
            dispatchCartUpdated();
            const db = await initDB();
            const products = await db.getAll('carts');
            return products.length;
        } catch (error) {
            console.error('Gagal menghitung total item:', error);
            return 0;
        }
    }, []);

    const getTotalPrice = useCallback(async () => {
        try {
            const db = await initDB();
            const products = await db.getAll('carts');
            return products.reduce((total, item) => total + item.total_price, 0);
        } catch (error) {
            console.error('Gagal menghitung total harga:', error);
            return 0;
        }
    }, []);

    const getStockProduct = useCallback(async (productId: number) => {
        try {
            const db = await initDB();
            const product = await db.get('products', productId);
            return product?.stock ?? 0;
        } catch (error) {
            console.error('Gagal mengambil stok produk:', error);
            return 0;
        }
    }, []);

    const clearCarts = useCallback(async () => {
        try {
            const db = await initDB();
            const itemExist = await db.getAll('carts');

            if (itemExist.length > 0) {
                await db.clear('carts');
                dispatchCartUpdated();
            }
            await fetchCarts();
        } catch (error) {
            toast.error('Gagal menghapus item di keranjang');
        }
    }, [fetchCarts]);

    useEffect(() => {
        let isMounted = true;
        const safeCartFetch = async () => {
            if (isMounted) {
                await fetchCarts();
            }
        };

        safeCartFetch();

        return () => {
            isMounted = false;
        };
    }, [fetchCarts]);

    return {
        carts,
        loading,
        clearCarts,
        getStockProduct,
        getTotalItems,
        addToCart,
        getProductQty,
        fetchCarts,
        qtyDecrement,
        qtyIncrement,
        removeFromCart,
        getTotalPrice,
    };
};

export default useCart;
