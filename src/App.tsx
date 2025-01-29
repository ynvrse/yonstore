import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { router } from './Router';

export default function App() {
    return (
        <ThemeProvider>
            <Toaster position="top-center" richColors />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
