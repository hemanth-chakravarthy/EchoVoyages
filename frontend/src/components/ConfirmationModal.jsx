import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#f3f6f8] px-6 py-4 border-b border-[#dce6f1]">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-[#b24020] mr-3 text-xl" />
                  <h3 className="text-lg font-semibold text-[#38434f]">{title || 'Confirm Action'}</h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-6 py-4">
                <p className="text-[#56687a]">{message || 'Are you sure you want to proceed?'}</p>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 bg-[#f3f6f8] border-t border-[#dce6f1] flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-[#dce6f1] text-[#56687a] rounded hover:bg-[#dce6f1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
