import CartList from '@/components/cart/CartList';
import LoadingScreen from '@/components/LoadingScreen';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import useCart from '@/hooks/useCart';

export default function Cart() {
    const { loading } = useCart();
    return (
        <>
            <LoadingScreen loading={loading} />
            <PageHeader>
                <PageHeaderHeading>Keranjang</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CartList />
            </Card>
        </>
    );
}
