/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useState } from "react";

export const ToastContext = createContext({ showToast: () => {} });

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, timeout = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Container for toasts */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-60 flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-black/85 text-white text-sm px-4 py-2 rounded shadow-lg"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
