import React, { useState, useEffect } from 'react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Building,
  TrendingUp,
  Award,
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

export interface CustomerTestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatarUrl: string;
  sector: 'Corporativo' | 'Residencial' | 'Saúde & Clínicas' | 'Hotelaria & Gastronomia';
  rating: number;
  projectTitle: string;
  quote: string;
  metricLabel: string;
  metricValue: string;
  metricSub: string;
  wellLeedTag: string;
  projectCode: string;
}

const TESTIMONIALS_DATA: CustomerTestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Dra. Camila Nogueira',
    role: 'Diretora de Operações & Workplace Experience',
    company: 'Fintech Nexus Pagamentos',
    location: 'Av. Brigadeiro Faria Lima, SP',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    sector: 'Corporativo',
    rating: 5,
    projectTitle: 'Parede Verde Preservada de 32m² no Open Space',
    quote: 'A instalação dos módulos Plug & Play foi impecável: em apenas um final de semana nosso andar corporativo se transformou. O isolamento acústico nas reuniões melhorou drasticamente e os colaboradores relatam muito mais bem-estar no retorno presencial.',
    metricLabel: 'Ganho em Produtividade',
    metricValue: '+18.4%',
    metricSub: 'Pesquisa interna de clima',
    wellLeedTag: 'Certificação WELL Gold S04',
    projectCode: 'AG-8492',
  },
  {
    id: 'test-2',
    name: 'Arq. Rodrigo Valente',
    role: 'Sócio-Fundador',
    company: 'Valente & Associados Arquitetura',
    location: 'Jardins, São Paulo',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    sector: 'Residencial',
    rating: 5,
    projectTitle: 'Varanda Gourmet & Living Integrado',
    quote: 'Para clientes de alto padrão, a naturalidade do toque e a ausência de irrigação são diferenciais cruciais. Especificamos All Green em mais de 12 coberturas residenciais com zero dor de cabeça de pós-obra e manutenção nula.',
    metricLabel: 'Economia de Água Anual',
    metricValue: '100% Zero',
    metricSub: 'Sem gotejamento ou mofo',
    wellLeedTag: 'Sustentabilidade FSC',
    projectCode: 'AG-7120',
  },
  {
    id: 'test-3',
    name: 'Dra. Beatriz Ferraz',
    role: 'Médica & Diretora Clínica',
    company: 'Instituto de Dermatologia & Longevidade',
    location: 'Vila Nova Conceição, SP',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813511-285fe243f56d?auto=format&fit=crop&w=300&q=80',
    sector: 'Saúde & Clínicas',
    rating: 5,
    projectTitle: 'Green Art Musgo Polar na Recepção e Salas de Espera',
    quote: 'Em ambientes de saúde, plantas vivas podem acumular umidade e pragas. O musgo polar escandinavo preservado da All Green trouxe a biofilia e tranquilidade que nossos pacientes precisavam com total assepsia e laudo de retardância ao fogo.',
    metricLabel: 'Redução de Ansiedade Relatada',
    metricValue: '-42%',
    metricSub: 'Questionário de acolhimento',
    wellLeedTag: 'Laudo IPT Fogo NBR 9442',
    projectCode: 'AG-9304',
  },
  {
    id: 'test-4',
    name: 'Marcelo Brandão',
    role: 'Gerente Geral de Engenharia & Facilities',
    company: 'Grand Hotel & Resort Botanique',
    location: 'Campos do Jordão, SP',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    sector: 'Hotelaria & Gastronomia',
    rating: 5,
    projectTitle: 'Jardins Verticais Anti-UV no Lobby e Restaurante',
    quote: 'Substituímos nosso antigo jardim natural que gastava R$ 4.500 mensais em jardineiros e trocas de mudas mortas. A All Green instalou o sistema permanente anti-UV e já economizamos mais de R$ 90 mil em manutenção em 2 anos.',
    metricLabel: 'Economia Operacional (OpEx)',
    metricValue: 'R$ 54k/ano',
    metricSub: 'Payback atingido em 8 meses',
    wellLeedTag: 'Garantia Fabril 5 Anos',
    projectCode: 'AG-5819',
  },
  {
    id: 'test-5',
    name: 'Arq. Juliana Siqueira',
    role: 'Diretora de Sustentabilidade',
    company: 'Studio Gaia EcoDesign',
    location: 'Curitiba, PR',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    sector: 'Corporativo',
    rating: 5,
    projectTitle: 'Edifício Corporativo Triple A',
    quote: 'Os arquivos BIM e o laudo de absorção acústica NRC 0.89 facilitaram a homologação dos créditos na certificação LEED v4.1. A All Green foi a única fabricante nacional que entregou todos os laudos exigidos pela auditoria internacional.',
    metricLabel: 'Créditos LEED Conquistados',
    metricValue: '+15 Créditos',
    metricSub: 'Materiais & Conforto Acústico',
    wellLeedTag: 'LEED v4.1 Homologado',
    projectCode: 'AG-6288',
  }
];

interface CustomerTestimonialsProps {
  onOpenConsultation?: () => void;
  onOpenSimulator?: () => void;
  onOpenProjectDetail?: (projectCode: string) => void;
}

export const CustomerTestimonials: React.FC<CustomerTestimonialsProps> = ({
  onOpenConsultation,
  onOpenSimulator,
  onOpenProjectDetail,
}) => {
  const [activeSector, setActiveSector] = useState<string>('Todos');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);

  const sectors = ['Todos', 'Corporativo', 'Residencial', 'Saúde & Clínicas', 'Hotelaria & Gastronomia'];

  const filteredTestimonials = TESTIMONIALS_DATA.filter((item) => {
    if (activeSector === 'Todos') return true;
    return item.sector === activeSector;
  });

  // Reset current index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSector]);

  // Autoplay interval
  useEffect(() => {
    if (!isAutoplay || filteredTestimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoplay, filteredTestimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const currentItem = filteredTestimonials[currentIndex] || filteredTestimonials[0];

  return (
    <section
      id="customer-testimonials"
      className="bg-[#f3f7f4] py-16 md:py-24 border-b border-gray-200/80 relative overflow-hidden"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with ScrollReveal */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#15803d] uppercase tracking-widest bg-emerald-100/90 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#15803d]" />
              <span>DEPOIMENTOS & RESULTADOS DE IMPACTO</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-900 leading-tight">
              A confiança de quem vive a <br className="hidden sm:inline" />
              <span className="italic font-light text-[#15803d]">biofilia de alto padrão</span> todos os dias.
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Descubra como arquitetos premiados, diretores corporativos e gestores de patrimônio alcançaram ganhos reais de produtividade, acústica e sustentabilidade com a All Green.
            </p>
          </div>
        </ScrollReveal>

        {/* Sector Filter Chips */}
        <ScrollReveal animation="fade-up" delay={0.1} distance={15}>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-5 mt-3">
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSector(sec)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSector === sec
                    ? 'bg-[#072a1a] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-[#072a1a]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Main Testimonial Card Carousel */}
        <div className="mt-8 max-w-5xl mx-auto">
          <ScrollReveal animation="fade-up" delay={0.15} distance={25}>
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden relative">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center"
                >
                  {/* Left Column: Author Photo & Impact Metric */}
                  <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <img
                        src={currentItem.avatarUrl}
                        alt={currentItem.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-4 border-emerald-100"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-[#072a1a] text-[#86efac] p-1.5 rounded-full shadow-md border-2 border-white" title="Cliente & Especificador Verificado">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-gray-900 text-lg leading-tight">
                        {currentItem.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                        {currentItem.role}
                      </p>
                      <p className="text-xs font-semibold text-[#15803d] mt-0.5">
                        {currentItem.company}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {currentItem.location}
                      </p>
                    </div>

                    {/* Impact Metric Badge Card */}
                    <div className="w-full bg-[#f3f7f4] p-3.5 rounded-2xl border border-emerald-200/80 text-center shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                        {currentItem.metricLabel}
                      </span>
                      <strong className="text-2xl font-serif font-bold text-[#072a1a] block mt-0.5">
                        {currentItem.metricValue}
                      </strong>
                      <span className="text-[11px] font-semibold text-[#15803d] block">
                        {currentItem.metricSub}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Quote, Stars, Project Specs & Actions */}
                  <div className="lg:col-span-8 space-y-5 lg:border-l lg:border-gray-100 lg:pl-8">
                    
                    {/* Top Meta: Stars & Sector Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(currentItem.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                        <span className="text-xs font-bold text-gray-800 ml-1.5">
                          5.0 / 5.0
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#072a1a] text-[10px] font-bold">
                          {currentItem.sector}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-mono font-bold">
                          Cód. {currentItem.projectCode}
                        </span>
                      </div>
                    </div>

                    {/* Project Title */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Projeto Executado
                      </span>
                      <h3 className="font-serif font-bold text-gray-900 text-base sm:text-lg">
                        {currentItem.projectTitle}
                      </h3>
                    </div>

                    {/* Quote Text */}
                    <div className="relative">
                      <Quote className="w-8 h-8 text-emerald-200 absolute -top-3 -left-3 -z-10 opacity-70" />
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic">
                        "{currentItem.quote}"
                      </p>
                    </div>

                    {/* Certification Badge & Footer Info */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#15803d]" />
                        <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {currentItem.wellLeedTag}
                        </span>
                      </div>

                      {onOpenConsultation && (
                        <button
                          type="button"
                          id={`testimonial-consult-btn-${currentItem.id}`}
                          onClick={onOpenConsultation}
                          className="text-xs font-bold text-[#072a1a] hover:text-[#15803d] flex items-center gap-1.5 transition-colors cursor-pointer group"
                        >
                          <span>Agendar Consultoria para Espaço Semelhante</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Carousel Navigation Controls Bar */}
              <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex items-center justify-between">
                
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {filteredTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx ? 'w-6 bg-[#072a1a]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir para depoimento ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Autoplay toggle & Next / Prev Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAutoplay(!isAutoplay)}
                    className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-200/60 transition-colors cursor-pointer"
                    title={isAutoplay ? 'Pausar carrossel automático' : 'Ativar reprodução automática'}
                  >
                    {isAutoplay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span className="hidden sm:inline">{isAutoplay ? 'Pausar' : 'Play'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      id="prev-testimonial-btn"
                      onClick={handlePrev}
                      className="p-2 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                      aria-label="Depoimento anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-bold text-gray-600 px-1 font-mono">
                      {currentIndex + 1} / {filteredTestimonials.length}
                    </span>

                    <button
                      type="button"
                      id="next-testimonial-btn"
                      onClick={handleNext}
                      className="p-2 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                      aria-label="Próximo depoimento"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </ScrollReveal>
        </div>

        {/* Bottom CTA Strip */}
        <ScrollReveal animation="fade-up" delay={0.2} distance={20}>
          <div className="mt-12 text-center bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                Quer transformar o seu ambiente com biofilia de impacto?
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Receba uma consultoria técnica de compatibilização ou simule seu espaço em tempo real.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {onOpenConsultation && (
                <button
                  type="button"
                  id="testimonials-cta-consultation-btn"
                  onClick={onOpenConsultation}
                  className="px-4 py-2.5 bg-[#072a1a] text-[#86efac] font-bold rounded-xl text-xs hover:bg-[#15803d] transition-all cursor-pointer shadow-md"
                >
                  Agendar Consultoria
                </button>
              )}

              {onOpenSimulator && (
                <button
                  type="button"
                  id="testimonials-cta-simulator-btn"
                  onClick={onOpenSimulator}
                  className="px-4 py-2.5 bg-white text-[#072a1a] border border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Simulador IA
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
