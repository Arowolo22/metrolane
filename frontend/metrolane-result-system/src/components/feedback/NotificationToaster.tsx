import { Toaster } from "sonner"

export function NotificationToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={4}
      duration={4_500}
      toastOptions={{
        className: "font-sans",
      }}
    />
  )
}
