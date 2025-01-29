import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarArrowDown, CalendarArrowUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function TransactionFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [dates, setDates] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
        to: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined,
    });

    // Sync state with query params
    useEffect(() => {
        const params: Record<string, string> = {};
        if (dates.from) params.from = format(dates.from, 'yyyy-MM-dd');
        if (dates.to) params.to = format(dates.to, 'yyyy-MM-dd');
        setSearchParams(params);
    }, [dates, setSearchParams]);

    return (
        <div className="xs:gap-4 mx-auto flex flex-wrap gap-2">
            {/* Calendar for 'From' Date */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'text-md w-full justify-start text-left font-normal sm:w-auto sm:text-sm',
                            !dates.from && 'text-muted-foreground',
                        )}
                    >
                        <CalendarArrowDown className="mr-2 h-4 w-4" />
                        {dates.from ? format(dates.from, 'dd-MM-yyyy') : <span>Pilih Tanggal Awal</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        initialFocus
                        mode="single"
                        selected={dates.from}
                        onSelect={(date: Date | undefined) => {
                            setDates((prev) => ({ ...prev, from: date ?? undefined }));
                        }}
                    />
                </PopoverContent>
            </Popover>

            {/* Calendar for 'To' Date */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'text-md w-full justify-start text-left font-normal sm:w-auto sm:text-sm',
                            !dates.to && 'text-muted-foreground',
                        )}
                    >
                        <CalendarArrowUp className="mr-2 h-4 w-4" />
                        {dates.to ? format(dates.to, 'dd-MM-yyyy') : <span>Pilih Tanggal Akhir</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        initialFocus
                        mode="single"
                        selected={dates.to}
                        onSelect={(date: Date | undefined) => {
                            setDates((prev) => ({ ...prev, to: date ?? undefined }));
                        }}
                    />
                </PopoverContent>
            </Popover>

            {/* Clear Button */}
            {(dates.from || dates.to) && (
                <Button
                    type="button"
                    size="icon"
                    variant={'rose'}
                    className="w-full sm:w-auto"
                    onClick={() => {
                        setDates({ from: undefined, to: undefined });
                        setSearchParams({});
                    }}
                >
                    <X />
                </Button>
            )}
        </div>
    );
}
