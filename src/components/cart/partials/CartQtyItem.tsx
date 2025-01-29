export default function CartQtyItem({ qty }: { qty: number }) {
    return qty > 0 ? (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 p-1 text-sm font-bold text-white">
            {qty}
        </div>
    ) : null;
}
