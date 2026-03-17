import React from "react";

function Modal({ isOpen, onClose, title, children }) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-xl font-semibold mb-4">
            {title}
          </h2>
        )}

        {/* Modal Content */}
        <div>
          {children}
        </div>

      </div>
    </div>
  );
}

export default Modal;