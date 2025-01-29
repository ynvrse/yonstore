import ActionDialog from '@/components/ActionDialog';
import LoadingScreen from '@/components/LoadingScreen';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useSetting from '@/hooks/useAppConfig';
import useHandleCsv from '@/hooks/useHandleCsv';
import formatRelativeTime from '@/lib/utils';
import { AppConfig } from '@/types';
import { DatabaseBackup } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Setting() {
    const { appConfigs, updateApp, loading, resetApp } = useSetting();
    const { downloadProductsAsCSV } = useHandleCsv();
    const [app, setApp] = useState<AppConfig>({
        name: appConfigs?.name || '',
        owner: appConfigs?.owner || '',
        instagram: appConfigs?.instagram || '',
        customProductName: appConfigs?.customProductName || '',
        createdAt: appConfigs?.createdAt || new Date(),
        updatedAt: appConfigs?.updatedAt || null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setApp((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    useEffect(() => {
        if (appConfigs) {
            setApp(appConfigs);
        }
    }, [appConfigs]);

    return (
        <>
            <LoadingScreen loading={loading} />

            <PageHeader>
                <PageHeaderHeading className="flex w-full items-center justify-between">
                    Settings Page{' '}
                    <Button variant="ghost" size="icon" onClick={() => downloadProductsAsCSV()}>
                        <DatabaseBackup className="text-lime-400" />
                    </Button>
                </PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Store Settings</CardTitle>
                            <CardDescription>Manage your own store informations here.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="name">Store Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={app.name}
                            placeholder="Nama Toko"
                            onChange={handleInputChange}
                        />
                        <Label htmlFor="customProductName">Custom Product</Label>
                        <Input
                            id="customProductName"
                            type="text"
                            value={app.customProductName}
                            placeholder="misal: Kue, Makanan, dll"
                            onChange={handleInputChange}
                        />

                        <Button onClick={() => updateApp(app)} type="button">
                            Save
                        </Button>

                        <ActionDialog
                            trigger={
                                <Button
                                    variant="outline"
                                    className="border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
                                    type="button"
                                >
                                    Factory Reset
                                </Button>
                            }
                            title="Anda Yakin Ingin Reset Aplikasi?"
                            description="Aplikasi Akan Kembali Ke Pengaturan Awal"
                            action={() => resetApp('database')}
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="flex items-center justify-between gap-1">
                <p className="text-sm font-light text-muted-foreground">
                    Dibuat: {`${formatRelativeTime(app.createdAt)}`}
                </p>
                {app.updatedAt && (
                    <p className="text-sm text-muted-foreground">Diubah: {`${formatRelativeTime(app.updatedAt)}`}</p>
                )}
            </div>
        </>
    );
}
