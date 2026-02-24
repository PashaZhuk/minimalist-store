import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Импортируем провайдер
import App from './App.tsx';
// Создаем экземпляр QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем авто-обновление при смене вкладок (по желанию)
      staleTime: 1000 * 60 * 5,    // Данные считаются свежими 5 минут
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Оборачиваем все приложение в провайдер React Query */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);