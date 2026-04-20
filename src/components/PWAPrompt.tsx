import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download, RefreshCw, X } from 'lucide-react';

export default function PWAPrompt() {
  // PWA Update Prompt
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const closeUpdate = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const closeInstall = () => {
    setShowInstall(false);
  };

  if (!offlineReady && !needRefresh && !showInstall) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 md:left-24 md:translate-x-0 z-[100] flex flex-col gap-2 w-[90%] max-w-sm animate-fade-in">
      
      {/* Install Prompt */}
      {showInstall && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-sky-100 dark:border-slate-700 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sky-text dark:text-sky-dark-text text-sm">Instal Ruang Jurnal</h3>
              <p className="text-xs text-sky-text-muted mt-1">Instal aplikasi ke layar utama agar bisa diakses kapan saja meski offline.</p>
            </div>
            <button onClick={closeInstall} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X size={16} className="text-slate-400" />
            </button>
          </div>
          <button 
            onClick={handleInstall}
            className="w-full bg-sky-button dark:bg-sky-dark-accent text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Download size={16} />
            Instal Sekarang
          </button>
        </div>
      )}

      {/* Update/Offline Prompt */}
      {(offlineReady || needRefresh) && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-sky-100 dark:border-slate-700 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sky-text dark:text-sky-dark-text text-sm">
                {offlineReady ? 'Aplikasi Siap Offline' : 'Update Baru Tersedia!'}
              </h3>
              <p className="text-xs text-sky-text-muted mt-1">
                {offlineReady 
                  ? 'Aplikasi sudah bisa dikerjakan tanpa internet.'
                  : 'Versi terbaru Ruang Jurnal tersedia. Update sekarang untuk menikmati fitur terbaru.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            {needRefresh && (
              <button 
                onClick={() => updateServiceWorker(true)}
                className="flex-1 bg-sky-button dark:bg-sky-dark-accent text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <RefreshCw size={16} />
                Update Sekarang
              </button>
            )}
            <button 
              onClick={closeUpdate}
              className={`py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${needRefresh ? 'flex-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'w-full bg-sky-50 dark:bg-slate-700 text-sky-button dark:text-sky-dark-accent'}`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
