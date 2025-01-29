import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import useAppConfig from '@/hooks/useAppConfig';
import useProduct from '@/hooks/useProduct';
import { Product } from '@/types';
import ImportCsv from '../ImportCsv';
import { Button } from '../ui/button';
import { Card, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import SelectCategory from './partials/SelectCategory';
import UpdateStockProduct from './partials/UpdateStockProduct';

const CreateUpdateProduct = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const isUpdateStock = searchParams.get('update-stock');

    const [productSelected, setProductSelected] = useState<Product | null>(null);

    const { getProductById, updateProduct, loading, addProduct } = useProduct();

    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
    const { customProductName } = useAppConfig();

    const { id } = useParams<{ id: string }>();

    const [selectedCategory, setSelectedCategory] = useState<string>('none');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const productId = Number(id);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<Product>();

    const handleCategoryChange = (newCategory: string) => {
        if (newCategory === 'void') {
            toast.warning(`Kategori ${customProductName} tidak akan ditampilkan`);
        } else if (newCategory === 'none') {
        } else {
            toast.info(`${newCategory} berhasil dipilih`);
        }

        setSelectedCategory(newCategory);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (id || isUpdateStock) {
                setIsUpdateMode(true);
                const product = await getProductById(productId);

                if (product) {
                    setValue('product_id', product.product_id);
                    setValue('name', product.name);
                    setValue('price', Number(product.price));
                    setValue('stock', product.stock || 1);
                    setValue('unitStock', product.unitStock || 'Stok');
                    setSelectedCategory(product.category || 'none');
                    setProductSelected(product);
                } else {
                    navigate('/not-found');
                }
            } else {
                setIsUpdateMode(false);
                reset();
                setSelectedCategory('none');
            }
        };
        fetchProduct();
    }, [id, productId, getProductById, reset, isUpdateStock]);

    const onSubmitProduct = async (data: Product) => {
        if (!selectedCategory || selectedCategory === 'none') {
            toast.error('Pilih kategori terlebih dahulu!');
            return;
        }

        try {
            setIsSubmitting(true);

            if (isUpdateMode) {
                const updatedProduct = {
                    ...data,
                    category: selectedCategory,
                    product_id: productId,
                    stock: data.stock || 1,
                    unitStock: data.unitStock || 'Pcs',
                };
                await updateProduct(updatedProduct);
                setSearchParams({});
                navigate('/');
            } else {
                await addProduct({ ...data, category: selectedCategory, stock: 1 });

                reset();
                setSelectedCategory('none');
            }
        } catch (err) {
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <form onSubmit={handleSubmit(onSubmitProduct)} className="flex flex-col gap-4">
                        {isUpdateMode && (
                            <div className="space-y-2">
                                <Label htmlFor="product_id">ID {customProductName}</Label>
                                <Input
                                    id="product_id"
                                    type="text"
                                    readOnly
                                    placeholder={`ID ${customProductName}`}
                                    {...register('product_id')}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Nama {customProductName}</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={`Nama ${customProductName}`}
                                {...register('name', { required: 'Nama harus diisi' })}
                            />
                            {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                        </div>

                        <SelectCategory currentCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

                        <div className="space-y-2">
                            <Label htmlFor="price">Harga {customProductName}</Label>

                            <div className="flex justify-between gap-x-2">
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder={`Harga ${customProductName}`}
                                    {...register('price', { required: 'Harga harus diisi' })}
                                />

                                {isUpdateMode && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setSearchParams({
                                                'update-stock': 'true',
                                            })
                                        }
                                    >
                                        Stock: {productSelected?.stock || 0} {productSelected?.unitStock || 'Pcs'}
                                    </Button>
                                )}
                            </div>
                            {errors.price && <span className="text-sm text-red-500">{errors.price.message}</span>}
                        </div>

                        <Button type="submit" variant="secondary" disabled={isSubmitting}>
                            {isUpdateMode ? 'Simpan ' : 'Tambah '}
                            {customProductName}
                        </Button>
                    </form>

                    {productSelected && <UpdateStockProduct product={productSelected} />}
                </CardHeader>
            </Card>

            {!isUpdateMode && watch('name') === '' && <ImportCsv />}
        </>
    );
};

export default CreateUpdateProduct;
