import LoadingScreen from '@/components/LoadingScreen';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import TransactionFilter from '@/components/transaction/TransactionFilter';
import TransactionList from '@/components/transaction/TransactionList';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import useTransaction from '@/hooks/useTransaction';

export default function HistoryTransaction() {
    const { loading } = useTransaction();
    return (
        <>
            <LoadingScreen loading={loading} />

            <PageHeader>
                <PageHeaderHeading>Riwayat Transaksi</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader className="border-b-2 p-2">
                    <TransactionFilter />
                </CardHeader>
                <ScrollArea className="h-[400px] w-full">
                    <CardContent>
                        <TransactionList />
                    </CardContent>
                </ScrollArea>
            </Card>
        </>
    );
}
