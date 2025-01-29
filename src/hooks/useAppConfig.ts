import { initDB } from '@/services/db';
import { AppConfig } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const useAppConfig = () => {
    const navigate = useNavigate();
    const [appConfigs, setAppConfigs] = useState<AppConfig | null>(null);
    const [customProductName, setCustomProductName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAppConfig = useCallback(async () => {
        setLoading(true);
        try {
            const db = await initDB();
            const configApp = await db.get('settings', 1);
            setAppConfigs(configApp);
            setCustomProductName(configApp.customProductName);
        } catch (error) {
            console.error('Failed to fetch Config:', error);
            toast.error('Gagal mengambil konfigurasi');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateApp = useCallback(
        async (newConfigApp: AppConfig) => {
            try {
                const db = await initDB();
                await db.put('settings', { ...newConfigApp, updatedAt: new Date() });
                await fetchAppConfig();
                toast.success('Data berhasil diperbarui!');
                navigate('/settings');
            } catch (error) {
                console.error('Gagal memperbarui data settings:', error);
                toast.error('Gagal memperbarui data');
            }
        },
        [fetchAppConfig, navigate],
    );

    useEffect(() => {
        let isMounted = true;
        const safeConfigFetch = async () => {
            if (isMounted) {
                await fetchAppConfig();
            }
        };

        safeConfigFetch();

        return () => {
            isMounted = false;
        };
    }, [fetchAppConfig]);

    const resetApp = useCallback(async (databaseName: string) => {
        await indexedDB.deleteDatabase(databaseName);
        setTimeout(() => {
            window.location.href = '/';
        }, 500);
        toast.success(`Aplikasi Berhasil Direset`);
    }, []);

    return {
        appConfigs,
        customProductName,
        loading,
        fetchAppConfig,
        updateApp,
        resetApp,
    };
};

export default useAppConfig;
