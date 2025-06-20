// src/components/atoms/alert.tsx
import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

interface AlertProps {
  show: boolean;
  type: 'confirm' | 'success' | 'error' | 'warning';
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const Alert: React.FC<AlertProps> = ({ show, type, message, onConfirm, onCancel }) => {
  if (!show) return null;

  const icons = {
    confirm: <FiInfo className="w-7 h-7 text-blue-500" />,
    success: <FiCheckCircle className="w-7 h-7 text-green-500" />,
    error: <FiAlertTriangle className="w-7 h-7 text-red-500" />,
    warning: <FiAlertTriangle className="w-7 h-7 text-yellow-500" />,
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="flex flex-col gap-4 p-7">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {icons[type]}
              <h3 className="text-xl font-bold text-gray-900 capitalize">
                {type === 'confirm' ? 'Confirmation' : type === 'warning' ? 'Warning' : type}
              </h3>
            </div>
            <button 
              onClick={onCancel || onConfirm}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-700 pl-10 text-base">{message}</p>
          <div className={`flex gap-3 pt-2 ${onCancel ? 'justify-end' : 'justify-center'}`}>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                type === 'confirm' ? 'bg-blue-500 hover:bg-blue-600' :
                type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                'bg-red-500 hover:bg-red-600'
              }`}
            >
              {type === 'confirm' ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;