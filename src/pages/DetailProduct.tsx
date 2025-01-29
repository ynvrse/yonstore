import LoadingScreen from '@/components/LoadingScreen';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import useAppConfig from '@/hooks/useAppConfig';
import useImage from '@/hooks/useImage';
import useProduct from '@/hooks/useProduct';
import { ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

interface Product {
    product_id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    unitStock: string;
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { customProductName } = useAppConfig();
    const { getProductById, loading } = useProduct();
    const [product, setProduct] = useState<Product | null>(null);
    const productId = Number(id);
    const [image, setImage] = useState<string | null>(null);

    const { getImageById, imagePreview } = useImage();

    useEffect(() => {
        const loadImage = async () => {
            const imageSrc = await getImageById(productId);
            setImage(imageSrc);
        };
        loadImage();
    }, [productId, getImageById]);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(productId);
            setProduct(data);
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <LoadingScreen loading={loading} />;

    return (
        <>
            <PageHeader>
                <PageHeaderHeading className="flex w-full items-center justify-between">
                    Detail {customProductName}
                </PageHeaderHeading>
            </PageHeader>

            <Card className="mb-4 w-full rounded-2xl shadow-lg">
                <CardHeader className="space-y-3 text-sm">
                    {product ? (
                        <>
                            <div className="flex justify-center rounded-lg bg-muted/10 p-4">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Current"
                                        className="max-h-64 rounded-md object-contain shadow-sm"
                                    />
                                ) : (
                                    <>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Current"
                                                className="max-h-64 rounded-md object-contain shadow-sm"
                                            />
                                        ) : (
                                            <div className="flex h-64 w-full flex-col items-center justify-center text-muted-foreground">
                                                <ImagePlus className="mb-2 h-12 w-12" />
                                                <p>Belum ada gambar</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Nama:</span>
                                <span>{product.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Kategori:</span>
                                <span>{product.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Harga:</span>
                                <span className="text-green-600">Rp{product.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Stok:</span>
                                <span>
                                    {product.stock} {product.unitStock}
                                </span>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Produk tidak ditemukan.</p>
                    )}
                </CardHeader>
            </Card>
            <NavLink to={`/`}>
                <Button variant="lime" className="w-full">
                    Kembali
                </Button>
            </NavLink>
        </>
    );
}
