import useCart from '@/hooks/useCart';
import useTransaction from '@/hooks/useTransaction';
import { ShoppingCart, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

export default function StartTransactionButton() {
    const { clearCarts } = useCart();
    const { isStartTransaction, handleToggle } = useTransaction();

    const handleStartTransaction = async () => {
        await handleToggle();

        if (!isStartTransaction) {
            clearCarts();
            toast.info('Mulai Transaksi');
        } else {
            toast.info('Batalkan Transaksi');
        }
    };

    return (
        <Button variant={isStartTransaction ? 'rose' : 'lime'} size="icon" onClick={handleStartTransaction}>
            {isStartTransaction ? <X /> : <ShoppingCart />}
        </Button>
    );
}
