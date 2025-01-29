import { createBrowserRouter } from 'react-router-dom';

import { Applayout } from './components/layouts/AppLayout';

import NoMatch from './pages/404';
import AddProductImage from './pages/AddProductImage';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import DetailProduct from './pages/DetailProduct';
import HistoryTransaction from './pages/HistoryTransaction';
import Product from './pages/Product';
import Setting from './pages/Setting';

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Applayout />,
            children: [
                {
                    path: '',
                    element: <Dashboard />,
                },
                {
                    path: 'dashboard',
                    element: <Dashboard />,
                },

                {
                    path: 'master-data/products/:id?',
                    element: <Product />,
                },
                {
                    path: 'master-data/products/:id?/details',
                    element: <DetailProduct />,
                },
                {
                    path: 'master-data/products/:id?/add-images',
                    element: <AddProductImage />,
                },
                {
                    path: 'carts',
                    element: <Cart />,
                },
                {
                    path: 'history-transactions',
                    element: <HistoryTransaction />,
                },
                {
                    path: 'settings',
                    element: <Setting />,
                },
            ],
        },
        {
            path: '*',
            element: <NoMatch />,
        },
    ],
    {
        basename: global.basename,
    },
);
