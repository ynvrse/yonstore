import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import ListProduct from '@/components/product/ListProduct';
import { motion } from 'framer-motion';

import LoadingScreen from '@/components/LoadingScreen';
import StartTransactionButton from '@/components/StartTransactionButton';
import { Card } from '@/components/ui/card';
import useAppConfig from '@/hooks/useAppConfig';
import useProduct from '@/hooks/useProduct';

export default function Dashboard() {
    const { customProductName } = useAppConfig();
    const { loading } = useProduct();
    return (
        <>
            <LoadingScreen loading={loading} />

            <PageHeader>
                <PageHeaderHeading className="flex w-full justify-between">
                    List {customProductName}
                    <motion.div
                        whileTap={{ scale: 1.3, rotate: 10 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                        <StartTransactionButton />
                    </motion.div>
                </PageHeaderHeading>
            </PageHeader>
            <Card>
                <ListProduct />
            </Card>
        </>
    );
}
