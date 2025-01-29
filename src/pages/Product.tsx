import LoadingScreen from '@/components/LoadingScreen';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import CreateUpdateProduct from '@/components/product/CreateUpdateProduct';
import { Button } from '@/components/ui/button';
import useAppConfig from '@/hooks/useAppConfig';
import { ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

export default function Product() {
    const { id } = useParams<{ id: string }>();
    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);

    const { customProductName, loading } = useAppConfig();

    useEffect(() => {
        if (id) {
            setIsUpdateMode(true);
        } else {
            setIsUpdateMode(false);
        }
    }, [id]);

    return (
        <>
            <LoadingScreen loading={loading} />

            <PageHeader>
                <PageHeaderHeading className="flex w-full items-center justify-between">
                    <div>
                        {isUpdateMode ? 'Edit ' : 'Tambah '}
                        {customProductName}
                    </div>
                    <div>
                        {isUpdateMode && (
                            <NavLink to={`/master-data/products/${id}/add-images`}>
                                <Button type="button" variant="ghost" size="icon">
                                    <ImagePlus className="text-lime-400" />
                                </Button>
                            </NavLink>
                        )}
                    </div>
                </PageHeaderHeading>
            </PageHeader>

            <CreateUpdateProduct />
        </>
    );
}
