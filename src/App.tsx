import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/core/store';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="bottom-left"
          reverseOrder={false}
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '16px',
              background: '#0F172A',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              padding: '12px 18px',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.25)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
