import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { differenceInSeconds, format } from 'date-fns';
import { id } from 'date-fns/locale'; // Bahasa Indonesia

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

const formatRelativeTime = (date: Date): string => {
    const now = new Date();

    const seconds = differenceInSeconds(now, date); // Selisih dalam detik
    if (seconds < 60) {
        return `${seconds} detik yang lalu`;
    }

    const minutes = differenceInMinutes(now, date); // Selisih dalam menit
    if (minutes < 60) {
        return `${minutes} menit yang lalu`;
    }

    const hours = differenceInHours(now, date); // Selisih dalam jam
    if (hours < 24) {
        return `${hours} jam yang lalu `;
    }

    const days = differenceInDays(now, date); // Selisih dalam hari
    if (days < 30) {
        return `${days} hari yang lalu (${format(date, 'dd MMMM', { locale: id })}`;
    }

    // Jika lebih dari 30 hari, tampilkan format bulan dan tahun
    return format(date, 'MMMM yyyy', { locale: id });
};

export function formatRupiah(number: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}

export function formatDate(date: Date): string {
    return format(date, 'dd MMMM yyyy', { locale: id });
}

export function generateOrderId(customUniqueId?: string, isRandom = false): string {
    const date = new Date();
    const formattedDate = format(date, 'yyMMddHHmmss');

    let random = '';
    if (isRandom) {
        random = '-' + Math.floor(1000 + Math.random() * 9000);
    }

    return `#INV-${formattedDate}${random}${customUniqueId ? `-${customUniqueId}` : ''}`;
}

export default formatRelativeTime;
