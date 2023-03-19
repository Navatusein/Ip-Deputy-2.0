import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Provider} from "react-redux";
import {setupStore} from "./store/store";
import {injectStore} from "./http";
import {BrowserRouter} from "react-router-dom";
import "./i18n/i18n";

const store = setupStore();

injectStore(store);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <React.Suspense fallback={<>Loading...</>}>
                    <App/>
                </React.Suspense>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)
