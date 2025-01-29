import { Card, CardDescription, CardHeaderCustom, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useCart from '@/hooks/useCart';
import useImage from '@/hooks/useImage';
import useTransaction from '@/hooks/useTransaction';
import { formatRupiah } from '@/lib/utils';
import { Ellipsis, ImagePlus, Pencil, Settings2, Trash2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import CartQtyItem from '../../cart/partials/CartQtyItem';

interface Props {
    product: Product | undefined;
    handleDeleteProduct: (product_id: number) => void;
}

// Komponen Avatar Produk
const ProductAvatar: React.FC<{ name: string; product_id: number }> = ({ name, product_id }) => {
    const [imageData, setImageData] = useState<String | null | any>(null);
    const { getImageById } = useImage();

    const initials = name
        .split(' ')
        .map((word) => word[0])
        .join('');

    useEffect(() => {
        const loadImage = async () => {
            const imageSrc = await getImageById(product_id);
            setImageData(imageSrc);
        };

        loadImage();
    }, [product_id, getImageById]);

    return (
        <Avatar className="rounded-md border border-slate-700">
            <AvatarImage src={imageData} />
            <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
        </Avatar>
    );
};

const ProductActions: React.FC<{ product_id: number; handleDeleteProduct: (product_id: number) => void }> = ({
    product_id,
    handleDeleteProduct,
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[150px]">
            <DropdownMenuLabel className="text-center">Pilih Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <NavLink to={`/master-data/products/${product_id}`}>
                <DropdownMenuItem>
                    <Pencil size={16} /> <span className="ml-2">Edit</span>
                </DropdownMenuItem>
            </NavLink>
            <NavLink to={`/master-data/products/${product_id}/?update-stock=true`}>
                <DropdownMenuItem>
                    <Settings2 size={16} /> <span className="ml-2">Update Stok</span>
                </DropdownMenuItem>
            </NavLink>
            <NavLink to={`/master-data/products/${product_id}/add-images`}>
                <DropdownMenuItem>
                    <ImagePlus size={16} /> <span className="ml-2">Upload Gambar</span>
                </DropdownMenuItem>
            </NavLink>
            <DropdownMenuItem asChild>
                <div className="flex items-center gap-x-2 text-red-500" onClick={() => handleDeleteProduct(product_id)}>
                    <Trash2 size={16} /> Hapus
                </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const CardListItem: React.FC<Props> = ({ product, handleDeleteProduct }) => {
    if (!product) return null;
    const { product_id, name, price, stock, category } = product;

    const { getImageById } = useImage();

    const { addToCart, getProductQty, carts } = useCart();

    const { isStartTransaction } = useTransaction();

    const [startTransactions, setStartTransactions] = useState<boolean | null>(null);

    useEffect(() => {
        setStartTransactions(isStartTransaction);
    }, [isStartTransaction]);

    useEffect(() => {
        const handleToggleChange = (event: CustomEvent) => {
            setStartTransactions(event.detail.isStartTransaction);
        };

        document.addEventListener('transactionToggleChanged', handleToggleChange as EventListener);

        return () => {
            document.removeEventListener('transactionToggleChanged', handleToggleChange as EventListener);
        };
    }, []);

    const [qty, setQty] = useState(0);

    useEffect(() => {
        const syncQty = async () => {
            const currentQty = await getProductQty(product_id);
            setQty(currentQty);
        };

        syncQty();
    }, [getProductQty, product_id, carts]);

    const handleAddToCart = () => {
        if (startTransactions) {
            const cartItem = {
                product_id: product.product_id,
                product: product,
            };

            addToCart(cartItem);
        }
    };

    const cardClasses = `w-full cursor-pointer dark:bg-slate-600/30 ${stock <= qty ? 'bg-slate-500/10 dark:bg-transparent' : ''}`;

    useEffect(() => {
        const handleCartUpdate = async () => {
            const qty = await getProductQty(product_id);
            setQty(qty);
        };

        document.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            handleCartUpdate();
            document.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [getProductQty, product_id]);

    return (
        <>
            <motion.div
                className="relative outline-none"
                whileTap={startTransactions ? { scale: 0.95 } : undefined}
                whileHover={startTransactions ? { scale: 0.95 } : undefined}
                transition={startTransactions ? { type: 'spring', stiffness: 300, damping: 15 } : undefined}
            >
                <Card className={cardClasses} onClick={handleAddToCart}>
                    <div className="relative">
                        <CardHeaderCustom>
                            <div className="flex justify-between">
                                <div className="flex gap-x-2">
                                    <ProductAvatar name={name} product_id={product_id} />
                                    <div className="flex flex-col gap-y-2">
                                        {startTransactions ? (
                                            <CardTitle className="line-clamp-1 hover:text-lime-400 hover:underline">
                                                {name}
                                            </CardTitle>
                                        ) : (
                                            <NavLink to={`/master-data/products/${product_id}/details`}>
                                                <CardTitle className="line-clamp-1 hover:text-lime-400 hover:underline">
                                                    {name}
                                                </CardTitle>
                                            </NavLink>
                                        )}

                                        <CardDescription>{formatRupiah(price)}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex h-6 items-center justify-center">
                                        {startTransactions ? (
                                            <CartQtyItem qty={qty} />
                                        ) : (
                                            <ProductActions
                                                product_id={product_id}
                                                handleDeleteProduct={handleDeleteProduct}
                                            />
                                        )}
                                    </div>

                                    <CardDescription>{category !== 'void' && category}</CardDescription>
                                </div>
                            </div>
                        </CardHeaderCustom>
                    </div>
                </Card>
            </motion.div>
        </>
    );
};

export default CardListItem;
