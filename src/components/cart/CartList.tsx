import useCart from '@/hooks/useCart';
import useTransaction from '@/hooks/useTransaction';
import { formatRupiah, generateOrderId } from '@/lib/utils';
import { MinusCircle, PackageX, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import ActionDialog from '../ActionDialog';
import EmptyData from '../EmptyData';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CardDescription, CardFooter, CardHeader, CardHeaderCustom, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

const ProductAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name
        .split(' ')
        .map((word) => word[0])
        .join('');

    return (
        <Avatar className="rounded-md border border-slate-700">
            <AvatarImage src="" />
            <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
        </Avatar>
    );
};

export default function CartList() {
    const { carts, loading, qtyDecrement, addToCart, getTotalPrice, removeFromCart } = useCart();
    const { createTransactions } = useTransaction();

    const [totalPrice, setTotalPrice] = useState(0);

    const [orderId, setOrderId] = useState<string>('');

    useEffect(() => {
        setOrderId(generateOrderId());
    }, []);

    useEffect(() => {
        const fetchTotalPrice = async () => {
            const total = await getTotalPrice();
            setTotalPrice(total);
        };
        fetchTotalPrice();
    }, [getTotalPrice, carts]);

    if (carts?.length === 0) {
        return (
            <EmptyData
                icon={PackageX}
                name="Keranjang"
                description="Sepertinya Anda belum menambahkan produk apapun ke keranjang"
            />
        );
    }

    return (
        <>
            <CardHeader className="border-b-2">
                <CardTitle className="flex items-center justify-between">
                    <span>{orderId}</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[300px] w-full">
                {carts?.map((cart) => (
                    <div key={cart.product.product_id} className="w-full border-b-2 px-3">
                        <CardHeaderCustom className="flex flex-row justify-between text-muted-foreground">
                            <div className="flex gap-x-2">
                                <ProductAvatar name={cart.product.name} />
                                <div className="flex flex-col gap-y-2">
                                    <CardTitle>{cart.product.name}</CardTitle>
                                    <CardDescription>{formatRupiah(cart.product.price)}</CardDescription>
                                </div>
                            </div>

                            <div className="flex items-center gap-x-2">
                                {(cart.quantity ?? 0) > 1 ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => qtyDecrement(cart)}
                                    >
                                        <MinusCircle />
                                    </Button>
                                ) : (
                                    <ActionDialog
                                        trigger={
                                            <Button type="button" variant="ghost" size="icon">
                                                <MinusCircle color="red" />
                                            </Button>
                                        }
                                        title="Hapus Item"
                                        description="Anda Yakin Ingin Menghapus Item?"
                                        action={() => removeFromCart(cart)}
                                    />
                                )}
                                <p className="underline decoration-lime-600 decoration-2 underline-offset-4">
                                    {cart.quantity}
                                </p>
                                <Button type="button" variant="ghost" size="icon" onClick={() => addToCart(cart)}>
                                    <PlusCircle />
                                </Button>
                            </div>
                        </CardHeaderCustom>
                    </div>
                ))}
            </ScrollArea>

            <div className="mb-2 mt-4 flex w-full items-center justify-between px-4 text-muted-foreground">
                <p>Total Item: </p>
                <p>{carts?.length}</p>
            </div>

            <div className="flex w-full items-center justify-between border-b-2 px-4 pb-4 text-lg font-bold text-muted-foreground">
                <p>Total Harga: </p>
                <p>{formatRupiah(totalPrice)}</p>
            </div>

            <CardFooter className="mt-4">
                <Button
                    className="flex w-full"
                    type="button"
                    variant={'lime'}
                    onClick={() => createTransactions(orderId)}
                >
                    Checkout
                </Button>
            </CardFooter>
        </>
    );
}
