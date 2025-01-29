import { Icons } from '@/components/icons';

interface NavItem {
    title: string | null;
    to?: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    isCustomMenu?: boolean;
    icon?: keyof typeof Icons;
    label?: string;
}

interface NavItemWithChildren extends NavItem {
    items?: NavItemWithChildren[];
}

export const mainMenu: NavItemWithChildren[] = [
    {
        title: 'Dashboard',
        to: '',
    },
    {
        title: 'Keranjang',
        to: '/carts',
    },
    {
        title: 'Menu ',
        items: [
            {
                title: 'Tambah Data ',
                to: 'master-data/products',
                isCustomMenu: true,
            },
        ],
        isCustomMenu: true,
    },
    {
        title: 'Menu Transaksi',
        items: [
            {
                title: 'Riwayat Transaksi',
                to: '/history-transactions',
            },
            {
                title: 'Cetak Transaksi',
                to: '/not-found',
            },
        ],
    },
    {
        title: 'Setting',
        to: '/settings',
    },
];

export const sideMenu: NavItemWithChildren[] = [];
