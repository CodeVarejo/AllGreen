import { registerSW } from 'virtual:pwa-register';

export function setupServiceWorker() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('[PWA] Nova versão disponível do aplicativo All Green.');
      },
      onOfflineReady() {
        console.log('[PWA] Aplicativo pronto para uso offline! Catálogo botânico e calculadoras cacheados.');
      },
      onRegisteredSW(swUrl, r) {
        console.log(`[PWA] Service Worker registrado com sucesso: ${swUrl}`);
      },
      onRegisterError(error) {
        console.warn('[PWA] Erro ao registrar Service Worker:', error);
      },
    });

    return updateSW;
  }
  return undefined;
}
