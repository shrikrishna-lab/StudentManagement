import React from 'react';
import { Check, Info, AlertTriangle, X, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function getAlertIcon(type) {
  switch (type) {
    case 'success':
      return <Check size={15} strokeWidth={2.5} />;
    case 'warning':
      return <AlertTriangle size={15} strokeWidth={2.5} />;
    case 'error':
      return <XCircle size={15} strokeWidth={2.5} />;
    case 'info':
    default:
      return <Info size={15} strokeWidth={2.5} />;
  }
}

/**
 * CapsuleAlert
 * 
 * Soft-pastel inline rounded alert pill exactly matching Reference Image 1.
 * Supports variants: 'success' (Congratulations), 'info' (Pro tip), 'warning', 'error'.
 */
export default function Alert({
  type = 'info',
  title,
  message,
  onClose,
  actionText,
  onAction,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn('capsule-alert', `capsule-${type}`, className)}
      role="alert"
    >
      <div className="capsule-icon-bubble">
        {getAlertIcon(type)}
      </div>

      <div className="capsule-content-col">
        {title && <span className="capsule-title">{title}</span>}
        {message && <p className="capsule-message">{message}</p>}
        {actionText && (
          <button
            type="button"
            className="capsule-action-link"
            onClick={onAction}
          >
            {actionText}
          </button>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          className="capsule-close-icon-btn"
          onClick={onClose}
          aria-label="Close alert"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}
