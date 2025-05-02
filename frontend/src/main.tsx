import React from 'react'
import ReactDOM from 'react-dom/client'

import { CircularProgress } from '@mui/material'
import { wrap } from '@suspensive/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      staleTime: 3 * 1000, // 3 seconds
      refetchOnWindowFocus: false,
    }
  },
})

const WrappedApp: React.FC = wrap
  .ErrorBoundary({ fallback: <div>에러 발생, 새로고침을 해주세요.</div> })
  .Suspense({ fallback: <CircularProgress /> })
  .on(() => <></>)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <SnackbarProvider>
        <BrowserRouter>
          <WrappedApp />
        </BrowserRouter>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode >
)
