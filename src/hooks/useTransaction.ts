import { initDB } from '@/services/db';
import { Transaction } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import useCart from './useCart';

const useTransaction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [isStartTransaction, setIsStartTransaction] = useState<boolean>(false);
    const { clearCarts } = useCart();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchParams] = useSearchParams();

    // Fetch transactions with filter
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const db = await initDB();
            const transaction = db.transaction('transactions', 'readonly');
            const objectStore = transaction.objectStore('transactions');
            const index = objectStore.index('createdAtIndex');

            const fromDate = searchParams.get('from');
            const toDate = searchParams.get('to');

            let range: IDBKeyRange | null = null;
            if (fromDate && toDate) {
                range = IDBKeyRange.bound(new Date(fromDate).toISOString(), new Date(toDate).toISOString());
            } else if (fromDate) {
                range = IDBKeyRange.lowerBound(new Date(fromDate).toISOString());
            } else if (toDate) {
                range = IDBKeyRange.upperBound(new Date(toDate).toISOString());
            }

            const fetchedTransactions: Transaction[] = [];
            let cursor = range ? await index.openCursor(range) : await index.openCursor(null, 'prev');

            while (cursor) {
                fetchedTransactions.push(cursor.value as Transaction);
                cursor = await cursor.continue();
            }

            setTransactions(fetchedTransactions);
        } catch (error) {
            console.error('Gagal mengambil transaksi:', error);
            toast.error('Gagal memuat riwayat transaksi');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    const fetchToggle = useCallback(async () => {
        setLoading(true);
        try {
            const db = await initDB();
            let toggle = await db.get('transaction_toggle', 1);

            if (!toggle) {
                toggle = { id: 1, value: false };
                await db.put('transaction_toggle', toggle);
            }
            setIsStartTransaction(toggle.value);
        } catch (error) {
            console.error('Gagal mengambil toggle:', error);
            toast.error('Gagal memuat status transaksi');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggle = useCallback(async () => {
        try {
            const db = await initDB();
            const newValue = !isStartTransaction;
            await db.put('transaction_toggle', { id: 1, value: newValue });

            if (isStartTransaction) {
                await clearCarts();
            }

            document.dispatchEvent(
                new CustomEvent('transactionToggleChanged', {
                    detail: { isStartTransaction: newValue },
                }),
            );

            setIsStartTransaction(newValue);
        } catch (error) {
            console.error('Gagal mengubah toggle:', error);
            toast.error('Gagal mengubah status transaksi');
        }
    }, [isStartTransaction]);

    const createTransactions = useCallback(
        async (orderId: string) => {
            try {
                const db = await initDB();
                const updatedCarts = await db.getAll('carts');

                if (!updatedCarts || updatedCarts.length === 0) {
                    toast.error('Keranjang Kosong!');
                    return;
                }

                await db.add('transactions', {
                    transaction_id: orderId,
                    items: updatedCarts.map((cart) => ({
                        product_id: cart.product.product_id,
                        name: cart.product.name,
                        price: cart.product.price,
                        quantity: cart.quantity,
                        subTotal: cart.product.price * (cart.quantity ?? 1),
                    })),
                    total: updatedCarts.reduce((total, cart) => total + cart.product.price * (cart.quantity ?? 1), 0),
                    createdAt: new Date().toISOString(),
                });

                toast.success('Transaksi Berhasil Ditambahkan');
                await clearCarts();
                await handleToggle();
                await fetchTransactions();
                navigate('/history-transactions');
            } catch (error) {
                console.error('Gagal Menambahkan Transaksi:', error);
                toast.error('Gagal membuat transaksi');
            }
        },
        [clearCarts, handleToggle, fetchTransactions, navigate],
    );

    useEffect(() => {
        let isMounted = true;
        const safeDataFetch = async () => {
            if (isMounted) {
                await fetchToggle();
                await fetchTransactions();
            }
        };

        safeDataFetch();

        return () => {
            isMounted = false;
        };
    }, [fetchToggle, fetchTransactions]);

    return {
        transactions,
        loading,
        fetchTransactions,
        createTransactions,
        isStartTransaction,
        handleToggle,
    };
};

export default useTransaction;
