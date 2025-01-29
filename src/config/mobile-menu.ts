import { CirclePlus, Home, LucideIcon, ScrollText, Settings, ShoppingBasket } from 'lucide-react';

interface NavItem {
    title: string;
    to: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    icon?: LucideIcon;
    label?: string;
    isCenter?: boolean;
}

export const mobileMenu: NavItem[] = [
    {
        title: 'Dashboard',
        to: '/',
        icon: Home,
    },
    {
        title: 'Product',
        to: '/master-data/products',
        icon: CirclePlus,
    },
    {
        title: 'Cart',
        to: '/carts',
        icon: ShoppingBasket,
        isCenter: true,
    },
    {
        title: 'Riwayat Transaksi',
        to: '/history-transactions',
        icon: ScrollText,
    },
    {
        title: 'Setting',
        to: '/settings',
        icon: Settings,
    },
];
