import React from 'react';
import ReactDOM from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Importe o NotificationProvider que criamos
import { NotificationProvider } from '@/components/notficationModal/notficationModal';

import '@/assets/styles/main.scss';
import Router from '@/router.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            refetchOnWindowFocus: false,
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                <Router />
            </NotificationProvider>
        </QueryClientProvider>
    </React.StrictMode>
);