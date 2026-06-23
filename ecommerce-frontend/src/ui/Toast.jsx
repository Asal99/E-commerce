import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = ({ type = "success", message }) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const icons = {
    success: <CheckCircle size={22} />,
    error: <XCircle size={22} />,
    info: <Info size={22} />,
  };

  const styles = {
    success: "bg-black border-white/10 text-white",
    error: "bg-black border-red-500/20 text-white",
    info: "bg-black border-white/10 text-white",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed bottom-6 right-6 z-9999 animate-slideIn">
          <div
            className={`w-85 rounded-2xl border px-5 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${styles[toast.type]}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{icons[toast.type]}</div>

              <p className="text-sm font-medium flex-1">{toast.message}</p>

              <button onClick={() => setToast(null)}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
