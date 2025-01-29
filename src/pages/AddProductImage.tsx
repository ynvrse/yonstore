import LoadingScreen from '@/components/LoadingScreen';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useImage from '@/hooks/useImage';
import useProduct from '@/hooks/useProduct';
import { ImagePlus, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AddProductImage() {
    const { id } = useParams<{ id: string }>();
    const product_id = Number(id);
    const [image, setImage] = useState<string | null>(null);
    const [productName, setProductName] = useState<string | null>(null);

    const { getProductById } = useProduct();
    const { loading, getImageById, handleImageChange, imagePreview } = useImage();

    useEffect(() => {
        const loadImage = async () => {
            const imageSrc = await getImageById(product_id);
            setImage(imageSrc);
        };
        loadImage();
    }, [product_id, getImageById]);

    useEffect(() => {
        const loadProduct = async () => {
            const product = await getProductById(product_id);
            setProductName(product.name);
        };
        loadProduct();
    }, [product_id, getImageById]);

    return (
        <>
            <LoadingScreen loading={loading} />

            <div className="container mx-auto max-w-3xl px-4 py-6">
                <PageHeader className="mb-8">
                    <PageHeaderHeading>Upload Gambar Produk</PageHeaderHeading>
                </PageHeader>

                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">{productName}</h3>
                            <Button variant="outline" onClick={() => window.history.back()}>
                                Kembali
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Current Image */}
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

                            {/* Upload Section */}
                            <div className="space-y-4">
                                <label
                                    htmlFor="image-upload"
                                    className="block cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors hover:bg-muted/10"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <span className="text-sm font-medium">Klik atau seret gambar kesini</span>
                                        <span className="text-xs text-muted-foreground">
                                            PNG, JPG atau GIF (Max 2MB)
                                        </span>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, product_id)}
                                    />
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
