import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  ExternalLink,
  X,
  ShieldCheck,
  Download,
  Share2,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard';

interface ConsultationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledType?: string;
  prefilledProjectCode?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const ConsultationBookingModal: React.FC<ConsultationBookingModalProps> = ({
  isOpen,
  onClose,
  prefilledType,
  prefilledProjectCode,
}) => {
  // Booking Step: 1 = Meeting Type & Date/Time, 2 = Form Details, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<'interactive' | 'calendly_embed'>('interactive');

  // Meeting Type
  const [consultationType, setConsultationType] = useState<string>(
    prefilledType || 'especificacao_tecnica'
  );

  // Selected Date & Time
  const today = new Date();
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      // Skip Sundays (0)
      if (d.getDay() !== 0) {
        days.push(d);
      }
    }
    return days;
  };

  const availableDays = getNextDays();
  const [selectedDate, setSelectedDate] = useState<Date>(availableDays[0]);
  const [selectedTime, setSelectedTime] = useState<string>('10:00');

  // Contact Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [projectArea, setProjectArea] = useState('');
  const [notes, setNotes] = useState('');
  const [projectCodeInput, setProjectCodeInput] = useState(prefilledProjectCode || '');

  const [bookingProtocol, setBookingProtocol] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    if (step === 3 || bookingProtocol) return false;
    return (
      step === 2 ||
      name.trim() !== '' ||
      email.trim() !== '' ||
      phone.trim() !== '' ||
      company.trim() !== '' ||
      notes.trim() !== ''
    );
  }, [step, bookingProtocol, name, email, phone, company, notes]);

  const { confirmDiscard } = useUnsavedChangesGuard({
    isDirty,
    title: 'Descartar agendamento de consultoria?',
    description: 'Você selecionou horário ou preencheu dados da reunião técnica. Se fechar agora, o agendamento não será concluído.',
    confirmText: 'Descartar e Fechar',
    cancelText: 'Continuar Agendamento',
    variant: 'warning',
    enabled: isOpen,
    interceptEscapeKey: true,
    onDiscard: onClose,
  });

  const handleRequestClose = () => {
    confirmDiscard(onClose);
  };

  const consultationTypes = [
    {
      id: 'especificacao_tecnica',
      title: 'Consultoria de Especificação & Laudos',
      duration: '30 min',
      format: 'Google Meet (Online)',
      icon: Video,
      description: 'Análise de espécies botânicas, laudos de acústica IPT, resistência ao fogo e normas para memorial descritivo.',
      badge: 'Mais Popular para Arquitetos',
    },
    {
      id: 'compatibilizacao_dwg_bim',
      title: 'Análise de DWG/BIM & Compatibilização',
      duration: '45 min',
      format: 'Compartilhamento de Tela',
      icon: FileText,
      description: 'Verificação dimensional de módulos Plug & Play, pontos de fixação oculta, recortes em marcenaria e estrutura.',
      badge: 'Técnico Especializado',
    },
    {
      id: 'visita_presencial',
      title: 'Visita Técnica & Medição Presencial',
      duration: '60 min',
      format: 'No local da obra / Showroom',
      icon: MapPin,
      description: 'Medição precisa in loco com amostras físicas de espécies preservadas em São Paulo / Grande SP e capitais.',
      badge: 'Atendimento Premium',
    },
    {
      id: 'apresentacao_roi_diretoria',
      title: 'Apresentação de ROI & Sustentabilidade',
      duration: '40 min',
      format: 'Reunião Executiva Online',
      icon: Building2,
      description: 'Apresentação executiva para clientes corporativos com estudo de ganho de produtividade e créditos WELL/LEED.',
      badge: 'Corporativo & Facility',
    },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:30', available: true },
    { time: '14:00', available: true },
    { time: '15:30', available: true },
    { time: '16:30', available: true },
    { time: '17:30', available: true },
  ];

  const handleNextToForm = () => {
    setStep(2);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const protocol = `AG-MEET-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookingProtocol(protocol);
      setIsSubmitting(false);
      setStep(3);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#86efac', '#15803d', '#072a1a', '#ffffff'],
        });
      } catch (err) {
        // ignore
      }
    }, 600);
  };

  const handleDownloadIcs = () => {
    const selectedTypeObj = consultationTypes.find(t => t.id === consultationType);
    const title = `Consultoria Técnica All Green - ${selectedTypeObj?.title || 'Reunião'}`;
    const description = `Reunião técnica de paisagismo permanente e biofilia All Green.\nProtocolo: ${bookingProtocol}\nArquiteto/Cliente: ${name}\nEmpresa: ${company}\nLink Google Meet será enviado para ${email}.`;
    
    const dateFormatted = selectedDate.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 8);
    const [hours, minutes] = selectedTime.split(':');
    const startHour = hours.padStart(2, '0');
    const endHour = String(parseInt(hours) + 1).padStart(2, '0');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//All Green Decor//Consultoria Tecnica//PT',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `DTSTART:${dateFormatted}T${startHour}${minutes}00Z`,
      `DTEND:${dateFormatted}T${endHour}${minutes}00Z`,
      'LOCATION:Google Meet / Showroom All Green',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Consultoria_AllGreen_${bookingProtocol}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenGoogleCalendar = () => {
    const selectedTypeObj = consultationTypes.find(t => t.id === consultationType);
    const title = encodeURIComponent(`Consultoria Técnica All Green - ${selectedTypeObj?.title || 'Biofilia'}`);
    const details = encodeURIComponent(`Protocolo de Agendamento: ${bookingProtocol}\nParticipantes: ${name} e Equipe de Engenharia Biofílica All Green.\nSuporte: (11) 98765-4321`);
    const dateFormatted = selectedDate.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 8);
    const [hours, minutes] = selectedTime.split(':');
    const start = `${dateFormatted}T${hours}${minutes}00`;
    const end = `${dateFormatted}T${String(parseInt(hours) + 1).padStart(2, '0')}${minutes}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=Google+Meet&dates=${start}/${end}`;
    window.open(gcalUrl, '_blank');
  };

  const handleOpenWhatsAppConfirmation = () => {
    const selectedTypeObj = consultationTypes.find(t => t.id === consultationType);
    const msg = encodeURIComponent(
      `Olá Equipe All Green! Acabei de agendar uma ${selectedTypeObj?.title}.\n\n📅 Data: ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}\n🔖 Protocolo: ${bookingProtocol}\n👤 Nome: ${name}\n🏢 Escritório/Empresa: ${company}\n\nGostaria de confirmar os detalhes!`
    );
    window.open(`https://wa.me/5511987654321?text=${msg}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      id="consultation-booking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleRequestClose();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Modal Header */}
        <div className="bg-[#072a1a] text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-[#86efac] border border-emerald-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  Agendamento de Consultoria Técnica
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 bg-emerald-900 text-emerald-300 rounded text-[10px] font-bold border border-emerald-700">
                  Calendly & Google Meet
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                Reunião direta com nossos engenheiros e especialistas em biofilia aplicada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-emerald-950 p-1 rounded-xl border border-emerald-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('interactive')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeTab === 'interactive' ? 'bg-[#86efac] text-[#072a1a]' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Agendamento Rápido
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calendly_embed')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'calendly_embed' ? 'bg-[#86efac] text-[#072a1a]' : 'text-emerald-300 hover:text-white'
                }`}
              >
                <span>Calendly Oficial</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              id="close-consultation-modal-btn"
              onClick={handleRequestClose}
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
              aria-label="Fechar modal de agendamento"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 bg-[#f9fbf9]">
          
          {/* Tab 1: Interactive Flow with Real Slots */}
          {activeTab === 'interactive' && (
            <div>
              {/* Stepper Progress */}
              <div className="flex items-center justify-between max-w-md mx-auto mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 1 ? 'bg-[#072a1a] text-[#86efac]' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="text-xs font-bold text-gray-800">Serviço & Data</span>
                </div>
                <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? 'bg-[#072a1a]' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 2 ? 'bg-[#072a1a] text-[#86efac]' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="text-xs font-bold text-gray-800">Dados do Projeto</span>
                </div>
                <div className={`flex-1 h-0.5 mx-3 ${step >= 3 ? 'bg-[#072a1a]' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="text-xs font-bold text-gray-800">Confirmação</span>
                </div>
              </div>

              {/* Step 1: Select Type, Date & Time */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Select Consultation Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                      1. Selecione o Formato da Reunião Técnica
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {consultationTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = consultationType === type.id;
                        return (
                          <div
                            key={type.id}
                            onClick={() => setConsultationType(type.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-emerald-50/80 border-[#072a1a] shadow-sm'
                                : 'bg-white border-gray-200 hover:border-emerald-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                    isSelected ? 'bg-[#072a1a] text-[#86efac]' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-gray-200 text-emerald-800">
                                    {type.format}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {type.duration}
                                </span>
                              </div>
                              <h4 className="font-bold text-xs text-gray-900 leading-snug">
                                {type.title}
                              </h4>
                              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                                {type.description}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-[#15803d]">
                                {type.badge}
                              </span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#072a1a] bg-[#072a1a] text-white' : 'border-gray-300'
                              }`}>
                                {isSelected && <CheckCircle2 className="w-3 h-3 text-[#86efac]" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select Date & Time Slot */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-2xl border border-gray-200">
                    {/* Days column */}
                    <div className="md:col-span-6 space-y-2">
                      <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                        2. Escolha o Dia (Próximos Dias Úteis)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableDays.map((day, idx) => {
                          const isDaySelected = selectedDate.toDateString() === day.toDateString();
                          const weekday = day.toLocaleDateString('pt-BR', { weekday: 'short' });
                          const dayNumber = day.getDate();
                          const month = day.toLocaleDateString('pt-BR', { month: 'short' });

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDate(day)}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                isDaySelected
                                  ? 'bg-[#072a1a] text-white border-[#072a1a] shadow-sm'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
                              }`}
                            >
                              <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                                {weekday}
                              </span>
                              <span className="text-base font-bold block">
                                {dayNumber}
                              </span>
                              <span className="text-[10px] block opacity-80 capitalize">
                                {month}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots column */}
                    <div className="md:col-span-6 space-y-2">
                      <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                        3. Escolha o Horário (Horário de Brasília)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => {
                          const isSlotSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                isSlotSelected
                                  ? 'bg-[#15803d] text-white border-[#15803d] shadow-sm'
                                  : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300'
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-gray-500 pt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>Fuso horário detectado: América/São Paulo (GMT-3)</span>
                      </p>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-600">
                      Agendamento para:{' '}
                      <strong className="text-gray-900">
                        {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {selectedTime}
                      </strong>
                    </div>
                    <button
                      type="button"
                      id="proceed-to-consultation-form-btn"
                      onClick={handleNextToForm}
                      className="px-6 py-3 bg-[#072a1a] text-[#86efac] font-bold rounded-xl text-xs hover:bg-[#15803d] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Avançar para Dados do Projeto</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Contact and Project Details Form */}
              {step === 2 && (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#15803d]" />
                      <span>
                        <strong>Reunião:</strong> {consultationTypes.find(t => t.id === consultationType)?.title}
                      </span>
                    </div>
                    <div className="font-bold">
                      {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Arq. Mariana Albuquerque"
                          className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        E-mail Corporativo / Profissional *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="mariana@arquitetura.com.br"
                          className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        WhatsApp / Telefone para Confirmação *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(11) 98765-4321"
                          className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Escritório de Arquitetura ou Empresa
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Ex: Studio Albuquerque Arquitetura"
                          className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Área Estimada em Paredes (m²) ou Ambiente
                      </label>
                      <input
                        type="text"
                        value={projectArea}
                        onChange={(e) => setProjectArea(e.target.value)}
                        placeholder="Ex: 18m² (Living e Hall de Entrada)"
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Código do Projeto AG (Opcional se já tiver)
                      </label>
                      <input
                        type="text"
                        value={projectCodeInput}
                        onChange={(e) => setProjectCodeInput(e.target.value)}
                        placeholder="Ex: AG-8492"
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Objetivo da Reunião ou Dúvidas Técnicas
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Gostaria de alinhar a fixação dos módulos em drywall curvo e revisar os laudos de acústica para pontuação WELL."
                      className="w-full p-3 bg-white rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 text-xs text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
                    >
                      ← Voltar para Horários
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="confirm-consultation-booking-btn"
                      className="px-7 py-3 bg-[#072a1a] text-[#86efac] font-bold rounded-xl text-xs hover:bg-[#15803d] transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Confirmando Agendamento...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#86efac]" />
                          <span>Confirmar Consultoria Técnica</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Confirmation Screen */}
              {step === 3 && (
                <div className="text-center py-6 px-4 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                      Agendamento Confirmado com Sucesso!
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mt-2">
                      Sua reunião técnica foi reservada na agenda
                    </h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                      Enviamos um convite com o link do Google Meet e a confirmação para <strong>{email}</strong>.
                    </p>
                  </div>

                  {/* Meeting Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 max-w-md mx-auto text-left shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-[11px] text-gray-500">Protocolo</span>
                      <strong className="text-xs text-[#072a1a] font-mono">{bookingProtocol}</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-[11px] text-gray-500">Data e Horário</span>
                      <strong className="text-xs text-gray-900">
                        {selectedDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' })} às {selectedTime}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-[11px] text-gray-500">Formato</span>
                      <strong className="text-xs text-emerald-800">
                        {consultationTypes.find(t => t.id === consultationType)?.format}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Responsável All Green</span>
                      <strong className="text-xs text-gray-900">Engenharia de Aplicação All Green</strong>
                    </div>
                  </div>

                  {/* Calendar & WhatsApp Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleOpenGoogleCalendar}
                      className="px-4 py-2.5 bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Adicionar ao Google Calendar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadIcs}
                      className="px-4 py-2.5 bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Baixar Arquivo .ICS (Outlook/Apple)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenWhatsAppConfirmation}
                      className="px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Confirmar no WhatsApp</span>
                    </button>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
                    >
                      Fechar Janela
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Direct Calendly Widget Embed */}
          {activeTab === 'calendly_embed' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    C
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">
                      Canal Oficial Calendly All Green
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Sincronização direta em tempo real com a agenda dos nossos engenheiros
                    </p>
                  </div>
                </div>

                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#072a1a] text-[#86efac] rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#15803d] transition-colors"
                >
                  <span>Abrir em Nova Aba</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Calendly iFrame Embed */}
              <div className="w-full h-[500px] bg-white rounded-2xl border border-gray-200 overflow-hidden relative">
                <iframe
                  src="https://calendly.com"
                  title="Agendamento All Green Calendly"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Trust Bar */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between text-[11px] text-gray-500 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
              Sem custo para arquitetos e especificadores
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#15803d]" />
              Atendimento em até 24h
            </span>
          </div>
          <span>Dúvidas urgentes? Ligue: (11) 98765-4321</span>
        </div>

      </div>
    </div>
  );
};
