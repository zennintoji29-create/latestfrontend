import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

let globalToastCallback: ((options: { title: string; description?: string; variant?: string }) => void) | null = null;

export function toast(options: { title: string; description?: string; variant?: string }) {
  if (globalToastCallback) {
    globalToastCallback(options);
  } else {
    console.log("Toast:", options.title, options.description);
  }
}

export function Toaster() {
  const { toasts, addToast } = useToast();

  // Register global toast callback
  globalToastCallback = addToast;

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
