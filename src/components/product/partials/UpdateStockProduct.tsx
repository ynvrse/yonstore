import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import useProduct from '@/hooks/useProduct';
import { Product } from '@/types';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const UpdateStockProduct: React.FC<{ product: Product | undefined }> = ({ product }) => {
    const { updateProductStock } = useProduct();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const isOpen = searchParams.has('update-stock');

    // State untuk form
    const [stock, setStock] = useState<number | null>(product?.stock || null);
    const [unitStock, setUnitStock] = useState<string>(product?.unitStock || '');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ stock?: string; unitStock?: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { stock?: string; unitStock?: string } = {};

        if (!stock || stock < 1) {
            newErrors.stock = 'Stok harus minimal 1';
        }
        if (!unitStock.trim()) {
            newErrors.unitStock = 'Satuan wajib diisi';
        } else if (unitStock.length > 20) {
            newErrors.unitStock = 'Satuan maksimal 20 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateStock = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            if (product) {
                await updateProductStock(product.product_id, stock || 0, unitStock);

                navigate(`/master-data/products/${product.product_id}/`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Gagal memperbarui stok produk. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Sheet open={isOpen} onOpenChange={(open) => !open && navigate('?')}>
                <SheetContent side="top" className="flex h-[400px] flex-col justify-between">
                    <SheetHeader>
                        <SheetTitle>Perbarui stok {product?.name || 'Produk'}</SheetTitle>
                        <SheetDescription>
                            Masukkan jumlah stok baru dan satuannya untuk memperbarui stok produk.
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleUpdateStock} className="space-y-4">
                        <div>
                            <Label htmlFor="stock">Stok Baru</Label>
                            <Input
                                id="stock"
                                type="number"
                                placeholder="Masukan Jumlah Stok Baru"
                                value={stock || undefined}
                                onChange={(e) => setStock(Number(e.target.value))}
                                disabled={isSubmitting}
                            />
                            {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                        </div>

                        <div>
                            <Label htmlFor="unitStock">Satuan</Label>
                            <Input
                                id="unitStock"
                                type="text"
                                placeholder="misal: pcs, unit, dll.."
                                value={unitStock}
                                onChange={(e) => setUnitStock(e.target.value)}
                                disabled={isSubmitting}
                            />
                            {errors.unitStock && <p className="mt-1 text-sm text-red-500">{errors.unitStock}</p>}
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={() => navigate('?')}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Memproses...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>

                    <SheetFooter className="text-center text-sm font-light text-muted-foreground">
                        Stok saat ini: {product?.stock ? product.stock + ' ' + product?.unitStock : 'Belum ada stok'}
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default UpdateStockProduct;
