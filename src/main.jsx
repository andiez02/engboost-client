import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { routes } from './utils/constants.js';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './components/ScrollToTop.jsx';
import { ModalProvider } from './modal/ModalSystem/ModalProvider';
import ModalContainer from './modal/ModalSystem/ModalContainer';

import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { ConfirmProvider } from 'material-ui-confirm';
import { injectStore } from './utils/authorizeAxios.js';

import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
const persistor = persistStore(store);

// Inject Redux store vào axios instance
injectStore(store);

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={routes.DEFAULT}>
    <ScrollToTop />
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfirmProvider
          defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            buttonOrder: ['confirm', 'cancel'],
            cancellationButtonProps: { color: 'inherit' },
            confirmationButtonProps: {
              color: 'secondary',
              variant: 'outlined',
            },
          }}
        >
          <ModalProvider>
            <App />
            <ModalContainer />
          </ModalProvider>
          <ToastContainer position="bottom-left" theme="colored" />
        </ConfirmProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
