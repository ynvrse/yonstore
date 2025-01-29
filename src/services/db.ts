import { openDB } from 'idb';

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    unitStock: string;
}

export const initDB = async () => {
    return openDB('database', 11, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('categories')) {
                const defaultCategories = db.createObjectStore('categories', { keyPath: 'name', autoIncrement: true });
                defaultCategories.add({ name: 'Laptop' });
                defaultCategories.add({ name: 'Smartphone' });
            }

            if (!db.objectStoreNames.contains('products')) {
                db.createObjectStore('products', { keyPath: 'product_id', autoIncrement: true });
                // const defaultProduct = db.createObjectStore('products', { keyPath: 'product_id', autoIncrement: true });

                // defaultProduct.add({
                //     product_id: 1,
                //     name: 'Asus VivoBook',
                //     category: 'Laptop',
                //     price: 8000000,
                //     stock: 6,
                //     unitStock: 'Unit',
                // });
                // defaultProduct.add({
                //     product_id: 2,
                //     name: 'Samsung A55',
                //     category: 'Smartphone',
                //     price: 6500000,
                //     stock: 3,
                //     unitStock: 'Unit',
                // });
            }

            if (!db.objectStoreNames.contains('carts')) {
                db.createObjectStore('carts', { keyPath: 'product_id' });
            }

            if (!db.objectStoreNames.contains('product_images')) {
                db.createObjectStore('product_images', { keyPath: 'product_id' });
            }

            if (!db.objectStoreNames.contains('transactions')) {
                const transactions = db.createObjectStore('transactions', {
                    keyPath: 'transaction_id',
                    autoIncrement: true,
                });
                transactions.createIndex('createdAtIndex', 'createdAt', { unique: false });
            }

            if (!db.objectStoreNames.contains('transaction_toggle')) {
                const toggle = db.createObjectStore('transaction_toggle', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                toggle.add({ value: false });
            }

            if (!db.objectStoreNames.contains('settings')) {
                const appConfigs = db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });

                appConfigs.add({
                    name: 'store',
                    owner: 'Dion Firmansyah',
                    instagram: 'yonfnh',
                    customProductName: 'Produk',
                    createdAt: new Date(),
                    updatedAt: null,
                });
            }
        },
    });
};
