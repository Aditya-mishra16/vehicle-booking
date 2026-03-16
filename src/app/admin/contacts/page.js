"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ContactMessageModal from "../components/ContactMessageModal";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();

      if (data.success) {
        setContacts(data.contacts);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to load contacts");
    }
  };

  const openMessage = (contact) => {
    setSelectedContact(contact);
    setOpenModal(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Contacts</h2>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No contact messages received
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{contact.name}</td>

                  <td className="p-4">{contact.email}</td>

                  {/* Truncated message */}
                  <td className="p-4 max-w-[350px]">
                    <div className="truncate text-gray-600">
                      {contact.message}
                    </div>
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => openMessage(contact)}
                      className="text-brandColor hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContactMessageModal
        contact={selectedContact}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
