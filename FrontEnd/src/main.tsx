import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";
import { store } from "./utils/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            duration: 3000,
            loading: {
              style: {
                background: "#3b82f6",
                color: "#fff",
              },
            },
          }}
        />

        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);