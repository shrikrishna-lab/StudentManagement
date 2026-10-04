import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { getAlertIcon } from '../components/Alert';
import { cn } from '../lib/utils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type = 'info',
      title,
      message,
      actionText,
      onAction,
      duration = 4500
    }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 6);

      const newToast = {
        id,
        type,
        title,
        message,
        actionText,
        onAction,
        duration
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (title, message, actionText, onAction) =>
      showToast({ type: 'success', title: title || 'Congratulations!', message, actionText, onAction }),
    info: (title, message, actionText, onAction) =>
      showToast({ type: 'info', title: title || 'Pro tip', message, actionText, onAction }),
    warning: (title, message, actionText, onAction) =>
      showToast({ type: 'warning', title: title || 'Warning', message, actionText, onAction }),
    error: (title, message, actionText, onAction) =>
      showToast({ type: 'error', title: title || 'Error', message, actionText, onAction })
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toast }}>
      {children}

      {/* Floating Toast Portal matching Reference Image 1 */}
      <div className="toast-viewport" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={cn('capsule-toast', `capsule-${item.type}`)}
              role="alert"
            >
              <div className="capsule-icon-bubble">
                {getAlertIcon(item.type)}
              </div>

              <div className="capsule-content-col">
                {item.title && <span className="capsule-title">{item.title}</span>}
                {item.message && <p className="capsule-message">{item.message}</p>}
                {item.actionText && (
                  <button
                    type="button"
                    className="capsule-action-link"
                    onClick={() => {
                      if (item.onAction) item.onAction();
                      removeToast(item.id);
                    }}
                  >
                    {item.actionText}
                  </button>
                )}
              </div>

              <button
                type="button"
                className="capsule-close-icon-btn"
                onClick={() => removeToast(item.id)}
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
