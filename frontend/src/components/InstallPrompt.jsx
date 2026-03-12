import { useState, useEffect } from "react";

const DISMISSED_KEY = "lgc-pwa-install-dismissed";

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Do not show if already dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Do not show if app already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e) => {
      e.preventDefault(); // stop default browser install prompt

      // delay showing prompt slightly for better UX
      setTimeout(() => {
        setInstallEvent(e);
        setVisible(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;

    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;

    setVisible(false);
    setInstallEvent(null);

    if (outcome === "dismissed") {
      localStorage.setItem(DISMISSED_KEY, "dismissed");
    }

    if (outcome === "accepted") {
      localStorage.setItem(DISMISSED_KEY, "installed");
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "dismissed");
  };

  if (!visible) return null;

  return (
    <div className="install-prompt" role="banner" aria-label="Install app">
      <div className="install-prompt-inner">
        <p className="install-prompt-text">
          Add <strong>LGC Concept AI</strong> to your home screen for quick
          access — no browser needed.
        </p>
        <div className="install-prompt-actions">
          <button className="install-btn-primary" onClick={handleInstall}>
            Install
          </button>
          <button className="install-btn-dismiss" onClick={handleDismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
