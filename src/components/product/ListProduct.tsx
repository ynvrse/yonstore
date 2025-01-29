import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useAppConfig from '@/hooks/useAppConfig';
import useProduct from '@/hooks/useProduct';
import { Product } from '@/types';
import { FileX2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { toast } from 'sonner';
import EmptyData from '../EmptyData';
import CardListItem from './partials/CardListItem';
import UpdateStockProduct from './partials/UpdateStockProduct';

export default function ListProduct() {
    const [searchParams, setSearchParams] = useSearchParams();
    const updateProductId = Number(searchParams.get('update-product'));

    const [productSelected, setProductSelected] = useState<Product | null>(null);
    const [search, setSearch] = useState<string>('');

    const { customProductName } = useAppConfig();
    const { products, getProductById, searchProducts, fetchProducts, deleteProduct } = useProduct();

    useEffect(() => {
        const fetchProduct = async () => {
            if (updateProductId) {
                try {
                    const product = await getProductById(updateProductId);
                    if (product) {
                        setProductSelected(product);
                    } else {
                        toast.error(`Produk tidak ditemukan`);
                        setSearchParams({});
                    }
                } catch (error) {
                    toast.error(`Terjadi kesalahan saat memuat produk`);
                    setSearchParams({});
                }
            } else {
                setProductSelected(null);
            }
        };

        fetchProduct();
    }, [updateProductId, getProductById, setSearchParams]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        if (query) {
            searchProducts(query);
        } else {
            fetchProducts();
        }
    };

    const handleAlertDeleteProduct = (id: number) => {
        toast(`Apakah kamu yakin ingin menghapus ${customProductName} ini?`, {
            action: {
                label: 'Ya, saya yakin!',
                onClick: () => {
                    deleteProduct(id);
                    fetchProducts();
                },
            },
        });
    };

    const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const product = products[index];
        return (
            <div style={style} key={product.product_id}>
                <CardListItem
                    product={product}
                    handleDeleteProduct={() => handleAlertDeleteProduct(product.product_id)}
                />
            </div>
        );
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="mb-2">
                    Cari {customProductName}
                    {search && `:  ${search}`}
                </CardTitle>
                <CardDescription className="flex justify-between gap-1">
                    <Input
                        type="text"
                        placeholder={`Cari ${customProductName}...`}
                        value={search}
                        onChange={handleSearch}
                    />
                    <Button
                        variant={'secondary'}
                        onClick={() =>
                            handleSearch({ target: { value: search } } as React.ChangeEvent<HTMLInputElement>)
                        }
                    >
                        <Search />
                    </Button>
                </CardDescription>
            </CardHeader>

            <div className="mb-5 flex-row border-b"></div>

            <CardContent className="flex flex-col gap-4">
                {products.length === 0 ? (
                    <EmptyData
                        icon={FileX2}
                        name={customProductName}
                        description={`Sepertinya Anda Belum Memiliki  ${customProductName} ${search && 'dengan nama' + search}`}
                    />
                ) : (
                    <List
                        height={400}
                        itemCount={products.length}
                        itemSize={90} // Ukuran setiap item
                        width="100%" // Lebar list
                    >
                        {renderRow}
                    </List>
                )}
            </CardContent>

            {productSelected && <UpdateStockProduct product={productSelected} />}
        </>
    );
}
