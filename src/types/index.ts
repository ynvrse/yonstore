export interface Product {
    product_id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    unitStock: string;
}

export interface Category {
    name: string;
}
export interface ProductImage {
    product_id: number;
    image: string;
}

export interface AppConfig {
    id?: number;
    name: string;
    owner: string;
    instagram: string;
    customProductName: string;
    createdAt: Date;
    updatedAt: Date | null;
}
export interface CartItem {
    product: Product;
    quantity?: number;
}

export interface TransactionItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    subTotal: number;
}

export interface Transaction {
    transaction_id: string;
    items: TransactionItem[];
    total: number;
    createdAt: Date;
}

export interface DatabaseSchema {
    products: Product;
    transactions: Transaction;
    categories: Category;
}
