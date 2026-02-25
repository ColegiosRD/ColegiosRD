'use client';

import { useState } from 'react';
import { X, Send, CheckCircle, Zap } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdModal({ isOpen, onClose }: AdModalProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email && message) {
      // Handle submission here
      setIsSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setEmail('');
    setCompanyName('');
    setMessage('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1a365d] to-[#2563eb] text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <span>Anúnciate con Nosotros</span>
          </h2>
          <button
            onClick={handleClose}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#1a365d]">¡Gracias por tu interés!</h3>
              <p className="text-gray-600 text-sm">
                Nos pondremos en contacto pronto para discutir las mejores opciones de publicidad para ti.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Intro */}
              <div className="bg-blue-50 border border-[#3b82f6] rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-700">
                  Llega a miles de padres y educadores en República Dominicana. Elige entre:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full" />
                    <span><strong>Paquetes para colegios:</strong> Verificación, Premium, Elite</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full" />
                    <span><strong>Espacios publicitarios:</strong> Banners, rectángulos, campañas</span>
                  </li>
                </ul>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu correo electrónico *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: contacto@empresa.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                />
              </div>

              {/* Company Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ej: Mi Empresa"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuéntanos más sobre tu negocio *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ej: Somos una empresa de tecnología educativa interesada en llegar a colegios..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Plans Overview */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div className="bg-amber-50 border border-[#f59e0b] rounded-lg p-3 text-center">
                  <p className="text-xs font-bold text-[#d97706] mb-1">PAQUETES</p>
                  <p className="text-xs text-gray-700">Verification, Premium, Elite</p>
                </div>
                <div className="bg-purple-50 border border-purple-300 rounded-lg p-3 text-center">
                  <p className="text-xs font-bold text-purple-700 mb-1">PUBLICIDAD</p>
                  <p className="text-xs text-gray-700">Banners, Rectángulos, Campañas</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!email || !message}
                className="w-full px-4 py-3 bg-[#2563eb] text-white font-bold rounded-lg hover:bg-[#1d4ed8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitud</span>
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Campos obligatorios
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
