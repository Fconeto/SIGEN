import { useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { SigenButton } from "@/components/sigen-button";
import { cn } from "@/lib/utils";

export interface SigenDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  message: string;
  type?: "error" | "success" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export const defaultDialogs = {
  error: {
    isOpen: true,
    type: "error",
    title: "Não foi possivel realizar a operação!",
    message: "Por favor, tente novamente mais tarde.",
  } as SigenDialogProps,
};

export function SigenDialog({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  showCancel = false,
}: SigenDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50";
      case "success":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className="text-lg font-semibold text-gray-900">
              {title ||
                (type === "error"
                  ? "Erro"
                  : type === "success"
                  ? "Sucesso"
                  : type === "warning"
                  ? "Atenção"
                  : "Informação")}
            </h2>
          </div>
          <SigenButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </SigenButton>
        </div>

        <div className={cn("p-4 border-l-4", getColors())}>
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          {showCancel && (
            <SigenButton
              variant="ghost"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              {cancelText}
            </SigenButton>
          )}
          <SigenButton onClick={handleConfirm}>{confirmText}</SigenButton>
        </div>
      </div>
    </div>
  );
}
