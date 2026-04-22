"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { saveEnquiry } from "@/lib/firestore";
import toast from "react-hot-toast";

export default function ContactPage() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Saree Store";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Enquiry",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await saveEnquiry(formData);
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "", subject: "General Enquiry", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again or contact via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleFocusWhatsApp = () => {
    const text = encodeURIComponent(`Hi! I have an enquiry regarding ${formData.subject}.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col pt-[104px] lg:pt-[116px]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">

        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Contact Info */}
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-brand-dark mb-6">{storeName}</h2>
              <p className="text-gray-600 leading-relaxed max-w-md">
                Have a question about a saree? Interested in bulk orders? Or simply want to say hello? We'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-start group">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors mr-4 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">WhatsApp / Call</h4>
                  <p className="text-gray-600 hover:text-green-600 transition-colors">+{whatsappNumber}</p>
                </div>
              </a>

              <a href="mailto:theladyfashion.shop1@gmail.com" className="flex items-start group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors mr-4 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600 hover:text-blue-600 transition-colors">theladyfashion.shop1@gmail.com</p>
                </div>
              </a>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center transition-colors mr-4 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Store Address</h4>
                  <p className="text-gray-600 leading-relaxed">
                    123 Fashion Street, Silk Arcade<br />
                    Boutique Hub, India 400001
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm">
              <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-sm">Business Hours</h4>
              <p className="text-gray-600">Monday–Saturday: 10:00 AM – 7:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>

          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="font-serif text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-8">Thank you! We'll get back to you within 24 hours.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="px-8 border-brand-primary text-brand-primary hover:bg-brand-primary/5">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-brand-dark mb-6">Send an Enquiry</h3>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-gray-300 rounded-sm focus:border-brand-primary focus:ring-brand-primary/20 py-2.5 px-3 border outline-none" placeholder="Your name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border-gray-300 rounded-sm focus:border-brand-primary focus:ring-brand-primary/20 py-2.5 px-3 border outline-none" placeholder="+91" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border-gray-300 rounded-sm focus:border-brand-primary focus:ring-brand-primary/20 py-2.5 px-3 border outline-none" placeholder="Optional" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full border-gray-300 rounded-sm focus:border-brand-primary focus:ring-brand-primary/20 py-2.5 px-3 border outline-none bg-white">
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Custom Order">Custom Order</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Message *</label>
                  <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full border-gray-300 rounded-sm focus:border-brand-primary focus:ring-brand-primary/20 py-2.5 px-3 border outline-none resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button type="submit" disabled={loading} className="w-full bg-brand-dark hover:bg-brand-primary text-white py-6 rounded-none font-bold tracking-wide">
                    {loading ? "Sending..." : "Submit Enquiry"}
                  </Button>
                  {/* <Button type="button" onClick={handleFocusWhatsApp} variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-6 rounded-none font-bold">
                    Or WhatsApp Us
                  </Button> */}
                </div>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
