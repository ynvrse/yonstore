import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useTransaction from '@/hooks/useTransaction';
import { formatDate, formatRupiah } from '@/lib/utils';
import { FileSpreadsheet } from 'lucide-react';
import EmptyData from '../EmptyData';
import { Button } from '../ui/button';

export default function TransactionList() {
    const { transactions, loading } = useTransaction();

    if (transactions.length === 0)
        return (
            <EmptyData
                icon={FileSpreadsheet}
                name="Transaksi"
                description="Sepertinya Anda Belum Memiliki Data Transaksi"
            />
        );

    const handlePrint = () => {
        const printContent = document.querySelector('.print-area');
        if (!printContent) {
            console.error('Element with class "print-area" not found');
            return;
        }

        const originalContent = document.body.innerHTML; // Simpan konten asli halaman
        document.body.innerHTML = printContent.innerHTML; // Ganti dengan konten yang ingin dicetak
        window.print(); // Cetak halaman
        document.body.innerHTML = originalContent; // Kembalikan konten asli
        window.location.reload(); // Reload halaman untuk mengembalikan state asli
    };

    return (
        <Accordion type="single" collapsible>
            {transactions?.map((transaction) => (
                <AccordionItem value={transaction.transaction_id} key={transaction.transaction_id}>
                    <AccordionTrigger className="flex w-full justify-between">
                        <p>{transaction.transaction_id}</p>
                        <p>{formatDate(transaction.createdAt)}</p>
                    </AccordionTrigger>
                    <AccordionContent className="print-area bg-slate-100 p-2 dark:bg-slate-900">
                        {transaction.items?.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex flex-col gap-2 border-b-2 pb-4 dark:border-slate-600"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-center text-xl font-light">x {item.quantity}</p>

                                    <div>
                                        <p>{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{formatRupiah(item.price)}</p>
                                    </div>
                                </div>
                                <div className="text-base-foreground flex justify-between text-end">
                                    <p className="mr-2">Subtotal:</p>
                                    <p>{formatRupiah(item.subTotal)}</p>
                                </div>
                            </div>
                        ))}
                        <div className="my-4">
                            <div className="text-base-foreground flex justify-between text-end">
                                <p className="text-center font-bold">Total:</p>
                                <p className="text-center font-bold text-lime-600">{formatRupiah(transaction.total)}</p>
                            </div>
                        </div>
                        <div className="my-4 justify-end text-end">
                            <Button size={'sm'} type="button" onClick={handlePrint}>
                                Print
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
