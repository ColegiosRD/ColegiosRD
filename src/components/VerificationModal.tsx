'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Mail, Upload, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SimpleSchool {
  id: string;
  name: string;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const [schools, setSchools] = useState<SimpleSchool[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchSchools = async () => {
        const { data } = await supabase.from('schools').select('id, name').order('name');
        if (data) setSchools(data);
      };
      fetchSchools();
    }
  }, [isOpen]);
  const [step, setStep] = useState(1);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [directorPhone, setDirectorPhone] = useState('');
  const [role, setRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isInstitutional, setIsInstitutional] = useState(true);
  const [documents, setDocuments] = useState<File[]>([]);

  const handleEmailChange = (email: string) => {
    setVerificationEmail(email);
    // Auto-detect institutional vs personal email
    const isInst = email.includes('.edu.do') || email.includes('school') || email.includes('colegio');
    setIsInstitutional(isInst);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      if (selectedSchool && directorName && directorPhone && role && contactEmail) {
        setStep(2);
      }
    } else if (step === 2) {
      if (verificationEmail && (isInstitutional || documents.length > 0)) {
        setStep(3);
      }
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedSchool('');
    setDirectorName('');
    setDirectorPhone('');
    setRole('');
    setContactEmail('');
    setVerificationEmail('');
    setDocuments([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1a365d] to-[#2563eb] text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Verificar Mi Colegio</h2>
          <button
            onClick={handleClose}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2 mb-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= num
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 transition-colors ${
                      step > num ? 'bg-[#2563eb]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: School Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#1a365d] mb-4">Información del Colegio</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona tu colegio
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                >
                  <option value="">-- Selecciona --</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Director/a
                </label>
                <input
                  type="text"
                  value={directorName}
                  onChange={(e) => setDirectorName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono del Director/a
                </label>
                <input
                  type="tel"
                  value={directorPhone}
                  onChange={(e) => setDirectorPhone(e.target.value)}
                  placeholder="Ej: +1-829-123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu rol en el colegio
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                >
                  <option value="">-- Selecciona --</option>
                  <option value="director">Director/a</option>
                  <option value="admin">Administrador/a</option>
                  <option value="maestro">Maestro/a</option>
                  <option value="staff">Personal Administrativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Oficial de ColegiosRD
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Ej: contacto@colegiosrd.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#1a365d] mb-4">Verificación de Email</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo de Verificación
                </label>
                <input
                  type="email"
                  value={verificationEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Ej: director@colegio.edu.do"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-600 mt-2 flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>
                    {isInstitutional
                      ? 'Email institucional detectado'
                      : 'Email personal - documentos requeridos'}
                  </span>
                </p>
              </div>

              {!isInstitutional && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documentos de Verificación
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="file-input"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Selecciona documentos
                      </span>
                      <span className="text-xs text-gray-500">
                        (Certificados, registros, etc.)
                      </span>
                    </label>
                  </div>
                  {documents.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {documents.map((doc, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          ✓ {doc.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#1a365d]">Solicitud Enviada</h3>
              <p className="text-gray-600 text-sm">
                Tu solicitud ha sido recibida exitosamente. Recibirás un correo de confirmación pronto.
              </p>
              <div className="bg-blue-50 border border-[#3b82f6] rounded-lg p-4 text-sm text-gray-700 space-y-1">
                <p className="font-medium">Tiempo estimado de verificación:</p>
                <p className="text-[#2563eb] font-bold">
                  {isInstitutional ? '1-3 días' : '1-5 días'}
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            )}
            {step < 3 && (
              <button
                onClick={handleContinue}
                className="flex-1 px-4 py-2 bg-[#2563eb] text-white font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center justify-center space-x-2"
              >
                <span>{step === 1 ? 'Continuar' : 'Verificar'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-[#2563eb] text-white font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
