import useCart from '@/hooks/useCart';
import { useEffect, useState } from 'react';

export default function CartTotalItem() {
    const { getTotalItems } = useCart();

    const [total, setTotal] = useState<number | undefined>(0);

    useEffect(() => {
        const handleCartUpdate = async () => {
            const total = await getTotalItems();
            setTotal(total);
        };

        document.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            handleCartUpdate();
            document.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [getTotalItems]);

    return total && total > 0 ? (
        <div className="absolute -top-3 left-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 p-1 text-xs font-bold text-white">
            {total}
        </div>
    ) : null;
}
