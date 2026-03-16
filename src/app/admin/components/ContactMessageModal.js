"use client";

import { X } from "lucide-react";

export default function ContactMessageModal({ contact, isOpen, onClose }) {
  if (!isOpen || !contact) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[500px] rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Contact Message</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{contact.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{contact.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Message</p>

            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
