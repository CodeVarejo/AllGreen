import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Leaf,
  Award,
  Volume2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  ShieldCheck,
  RefreshCw,
  Bot,
  Layers,
  Clock
} from 'lucide-react';
import { PortalNotification } from '../types';

interface NotificationCenterProps {
  notifications: PortalNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onActionClick: (notification: PortalNotification) => void;
  onTriggerSimulation: (type: 'ai' | 'project' | 'botanical' | 'leed') => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onActionClick,
  onTriggerSimulation,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'ai' | 'project' | 'technical'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'ai') return n.type === 'ai_assistant_message';
    if (filter === 'project') return n.type === 'project_status';
    if (filter === 'technical') return n.type === 'leed_well_update' || n.type === 'botanical_update';
    return true;
  });

  const getNotificationIcon = (type: PortalNotification['type']) => {
    switch (type) {
      case 'ai_assistant_message':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center shrink-0 border border-emerald-300 shadow-2xs">
            <Bot className="w-5 h-5 text-[#15803d]" />
          </div>
        );
      case 'project_status':
        return (
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center shrink-0 border border-teal-300 shadow-2xs">
            <Layers className="w-5 h-5 text-teal-800" />
          </div>
        );
      case 'leed_well_update':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
        );
      case 'botanical_update':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center shrink-0 border border-emerald-300 shadow-2xs">
            <Leaf className="w-5 h-5 text-[#15803d]" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 border border-blue-300 shadow-2xs">
            <Volume2 className="w-5 h-5 text-blue-700" />
          </div>
        );
    }
  };

  const getNotificationBadge = (type: PortalNotification['type']) => {
    switch (type) {
      case 'ai_assistant_message':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-[#072a1a] border border-emerald-300 flex items-center gap-1">
            <Bot className="w-2.5 h-2.5 text-[#15803d]" />
            Assistente IA
          </span>
        );
      case 'project_status':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-teal-100 text-teal-900 border border-teal-300 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-teal-700" />
            Status da Obra
          </span>
        );
      case 'leed_well_update':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <Award className="w-2.5 h-2.5" />
            LEED & WELL
          </span>
        );
      case 'botanical_update':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <Leaf className="w-2.5 h-2.5" />
            Laudo Botânico
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Notification Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 border-l border-gray-200">
        
        {/* Panel Header */}
        <div className="p-5 bg-[#072a1a] text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#86efac] text-[#072a1a] flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <span>Alertas & Notificações</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#86efac] text-[#072a1a] text-[10px] font-extrabold">
                    {unreadCount} novas
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-emerald-200">
                Status de projetos, mensagens da IA e laudos técnicos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar Notificações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Quick Actions */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  filter === 'all'
                    ? 'bg-[#072a1a] text-[#86efac]'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  filter === 'unread'
                    ? 'bg-[#072a1a] text-[#86efac]'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Não Lidas ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('ai')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  filter === 'ai'
                    ? 'bg-[#072a1a] text-[#86efac]'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Assistente IA
              </button>
              <button
                onClick={() => setFilter('project')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  filter === 'project'
                    ? 'bg-[#072a1a] text-[#86efac]'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Obras & Status
              </button>
              <button
                onClick={() => setFilter('technical')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  filter === 'technical'
                    ? 'bg-[#072a1a] text-[#86efac]'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Laudos
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            {unreadCount > 0 ? (
              <button
                onClick={onMarkAllAsRead}
                className="text-[#15803d] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marcar todas como lidas</span>
              </button>
            ) : (
              <span className="text-[11px] text-gray-400 font-medium">Todas as notificações lidas</span>
            )}

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onTriggerSimulation('ai')}
                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold px-2.5 py-1 rounded-full border border-emerald-200 transition-colors cursor-pointer"
                title="Simular nova mensagem do Assistente IA"
              >
                + Testar IA
              </button>
              <button
                onClick={() => onTriggerSimulation('project')}
                className="text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold px-2.5 py-1 rounded-full border border-teal-200 transition-colors cursor-pointer"
                title="Simular atualização de obra"
              >
                + Testar Obra
              </button>
            </div>
          </div>

        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-gray-800 text-sm">
                Nenhuma notificação encontrada
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Você será alertado quando o Assistente IA gerar novas simulações, o status de uma obra avançar ou laudos técnicos forem emitidos.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl transition-all border ${
                  !n.isRead 
                    ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(n.type)}

                  <div className="flex-1 space-y-1.5 min-w-0">
                    
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getNotificationBadge(n.type)}
                          {n.projectCode && (
                            <span className="text-[10px] font-mono font-bold text-gray-500">
                              {n.projectCode}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-bold leading-snug ${!n.isRead ? 'text-[#072a1a]' : 'text-gray-900'}`}>
                          {n.title}
                        </h4>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#15803d] shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {n.description}
                    </p>

                    {/* Impact Summary Pill */}
                    {n.impactSummary && (
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200 space-y-1 text-[10px] shadow-2xs">
                        <div className="flex items-center justify-between text-gray-500 font-semibold">
                          <span>Parâmetro: {n.impactSummary.parameterChanged}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-gray-400 line-through">{n.impactSummary.oldValue}</span>
                          <span className="text-[#15803d] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ➔ {n.impactSummary.newValue}
                          </span>
                        </div>
                        {(n.impactSummary.deltaLeed || n.impactSummary.deltaWell) && (
                          <div className="flex items-center gap-2 pt-0.5 text-[#072a1a] font-bold">
                            {n.impactSummary.deltaLeed && <span>• LEED: {n.impactSummary.deltaLeed}</span>}
                            {n.impactSummary.deltaWell && <span>• WELL: {n.impactSummary.deltaWell}</span>}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1.5">
                      <span className="text-[10px] text-gray-500 font-medium font-mono">
                        {n.timestamp}
                      </span>

                      <div className="flex items-center gap-2">
                        {n.actionLabel && (
                          <button
                            onClick={() => {
                              onMarkAsRead(n.id);
                              onActionClick(n);
                            }}
                            className="text-[11px] font-bold text-[#072a1a] hover:text-[#15803d] flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-full border border-gray-200 hover:border-emerald-300 transition-colors shadow-2xs"
                          >
                            <span>{n.actionLabel}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteNotification(n.id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                          title="Remover notificação"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#15803d]" />
            <span className="text-[11px] font-medium">Sincronização em tempo real</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-full transition-colors cursor-pointer text-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

