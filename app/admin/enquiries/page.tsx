"use client";

import { useEffect, useState } from "react";
import { getEnquiries, markEnquiryRead } from "@/lib/firestore";
import { Enquiry } from "@/lib/types";
import { CheckCircle2, Search, X } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string, currentStatus: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await markEnquiryRead(id, !currentStatus);
      setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, isRead: !currentStatus } : enq));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, isRead: !currentStatus });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enquiries ({enquiries.filter(e => !e.isRead).length} unread)</h1>
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search enquiries..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md pl-10 pr-4 py-2"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading enquiries...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEnquiries.map(enquiry => (
                  <tr 
                    key={enquiry.id} 
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${!enquiry.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="p-4" onClick={(e) => handleMarkRead(enquiry.id, enquiry.isRead, e)}>
                      <button className={`w-3 h-3 rounded-full ${!enquiry.isRead ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-300'}`} title="Toggle read status"></button>
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(enquiry.createdAt)}
                    </td>
                    <td className={`p-4 ${!enquiry.isRead ? 'font-bold' : ''}`}>{enquiry.name}</td>
                    <td className={`p-4 ${!enquiry.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{enquiry.subject}</td>
                    <td className="p-4 text-sm text-gray-500">{enquiry.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal View */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <div>
                <h2 className="text-xl font-bold bg-gray-50">{selectedEnquiry.subject}</h2>
                <div className="text-sm text-gray-500 mt-1">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(selectedEnquiry.createdAt)}</div>
              </div>
              <div className="flex items-center gap-4">
                {!selectedEnquiry.isRead && (
                  <button onClick={() => handleMarkRead(selectedEnquiry.id, selectedEnquiry.isRead)} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Mark as Read
                  </button>
                )}
                <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-lg border">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">From</div>
                  <div className="font-bold">{selectedEnquiry.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                  <div className="font-bold"><a href={`tel:${selectedEnquiry.phone}`} className="text-brand-primary hover:underline">{selectedEnquiry.phone}</a></div>
                </div>
                {selectedEnquiry.email && (
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</div>
                    <div className="font-bold"><a href={`mailto:${selectedEnquiry.email}`} className="text-brand-primary hover:underline">{selectedEnquiry.email}</a></div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Message</div>
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base border-l-4 border-gray-200 pl-4 py-1">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <a href={`https://wa.me/${selectedEnquiry.phone}?text=${encodeURIComponent(`Hi ${selectedEnquiry.name}, we received your enquiry regarding "${selectedEnquiry.subject}".`)}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#25D366] text-white rounded font-medium hover:bg-[#128C7E] transition-colors">
                Reply via WhatsApp
              </a>
              <button onClick={() => setSelectedEnquiry(null)} className="px-4 py-2 border rounded font-medium hover:bg-gray-100 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
