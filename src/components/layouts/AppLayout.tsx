import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function Applayout() {
    const location = useLocation();
    const [displayedPath, setDisplayedPath] = useState(location.pathname);

    useEffect(() => {
        if (location.pathname !== displayedPath) {
            const timer = setTimeout(() => {
                setDisplayedPath(location.pathname);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, displayedPath]);

    return (
        <>
            <Header />
            <div className="flex flex-grow flex-col">
                <div className="container relative flex flex-grow flex-col overflow-hidden px-4 md:px-8">
                    <Outlet />
                </div>
            </div>
            <div className="container px-4 md:px-8">
                <Footer />
            </div>
        </>
    );
}
