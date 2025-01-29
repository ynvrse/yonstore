import { appConfig } from '@/config/app';
import { mobileMenu } from '@/config/mobile-menu';
import useCart from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CartTotalItem from '../cart/partials/CartTotalItem';

export function Footer() {
    const location = useLocation();
    const { carts, getTotalItems } = useCart();

    const [triggerAnimation, setTriggerAnimation] = useState(false);

    const [hasItem, setHasItem] = useState<number | undefined>(0);

    useEffect(() => {
        const handleCartUpdate = async () => {
            const total = await getTotalItems();
            setHasItem(total);
        };

        document.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            handleCartUpdate();
            document.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [getTotalItems]);

    useEffect(() => {
        const handleCartItemAdded = () => {
            setTriggerAnimation(true);
            setTimeout(() => setTriggerAnimation(false), 200); // Reset animasi
        };

        document.addEventListener('cartItemAdded', handleCartItemAdded);

        return () => {
            document.removeEventListener('cartItemAdded', handleCartItemAdded);
        };
    }, [carts]);

    return (
        <footer>
            <div className="shadow-rounded fixed bottom-2 left-0 w-full px-2">
                <div className="w-full">
                    {location.pathname === '/settings' && (
                        <p className="mb-2 text-center text-sm font-light leading-loose text-muted-foreground">
                            Built by{' '}
                            <a
                                href={appConfig.gitHub}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium underline underline-offset-4"
                            >
                                {appConfig.author}
                            </a>
                            . The source code is available on{' '}
                            <a
                                href={appConfig.sourceCode}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium underline underline-offset-4"
                            >
                                GitHub
                            </a>
                            .
                        </p>
                    )}
                    <nav className="nav-mobile flex items-center justify-between gap-x-4 rounded-full bg-slate-100 px-4 py-3 shadow-md dark:bg-slate-800">
                        {mobileMenu.map((item, index) => (
                            <NavLink
                                to={item.to}
                                key={index}
                                className={cn(
                                    'text-slate-500 outline-none hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                                    {
                                        'text-slate-900 dark:text-slate-100': location.pathname === item.to,
                                    },
                                )}
                            >
                                {item.icon && (
                                    <motion.div
                                        animate={triggerAnimation && item.isCenter ? { scale: 1.4, rotate: 15 } : {}}
                                        className="relative outline-none"
                                        whileTap={{ scale: 1.4, rotate: 15 }}
                                        whileHover={{ scale: 0.8 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                    >
                                        <item.icon
                                            size={item.isCenter ? 40 : 20}
                                            color={
                                                hasItem && location.pathname === item.to && item.isCenter
                                                    ? '#A3E635'
                                                    : undefined
                                            }
                                            className={`${
                                                item.isCenter &&
                                                'absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform'
                                            } outline-none`}
                                        />
                                        {item.isCenter && <CartTotalItem />}
                                    </motion.div>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
