"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#486284] group-[.toaster]:border-[#E5E7EB] group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/15 group-[.toaster]:ring-1 group-[.toaster]:ring-[#E5E7EB] group-[.toaster]:rounded-xl group-[.toaster]:font-opensans group-[.toaster]:backdrop-blur-sm group-[.toaster]:border-opacity-60 group-[.toaster]:p-4 group-[.toaster]:min-w-[320px] group-[.toaster]:max-w-[400px]",
          description: "group-[.toast]:text-[#6B7280] group-[.toast]:font-opensans group-[.toast]:text-sm group-[.toast]:leading-relaxed",
          actionButton: "group-[.toast]:bg-[#2F6FED] group-[.toast]:text-white group-[.toast]:hover:bg-[#1E5BC6] group-[.toast]:font-opensans group-[.toast]:font-semibold group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:shadow-sm",
          cancelButton: "group-[.toast]:bg-[#F3F4F6] group-[.toast]:text-[#6B7280] group-[.toast]:hover:bg-[#E5E7EB] group-[.toast]:font-opensans group-[.toast]:font-semibold group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:shadow-sm",
          // Success variant styling - using project's color scheme
          success: "group-[.toaster]:bg-[#F0FDF4] group-[.toaster]:text-[#166534] group-[.toaster]:border-[#BBF7D0] group-[.toaster]:ring-[#BBF7D0] group-[.toaster]:shadow-green-200/30 group-[.toaster]:backdrop-blur-sm",
          // Error/Destructive variant styling - using project's color scheme
          error: "group-[.toaster]:bg-[#FEF2F2] group-[.toaster]:text-[#DC2626] group-[.toaster]:border-[#FECACA] group-[.toaster]:ring-[#FECACA] group-[.toaster]:shadow-red-200/30 group-[.toaster]:backdrop-blur-sm",
          // Warning variant styling - using project's color scheme
          warning: "group-[.toaster]:bg-[#FFFBEB] group-[.toaster]:text-[#D97706] group-[.toaster]:border-[#FED7AA] group-[.toaster]:ring-[#FED7AA] group-[.toaster]:shadow-amber-200/30 group-[.toaster]:backdrop-blur-sm",
          // Info variant styling - using project's primary blue color
          info: "group-[.toaster]:bg-[#EFF6FF] group-[.toaster]:text-[#2F6FED] group-[.toaster]:border-[#BFDBFE] group-[.toaster]:ring-[#BFDBFE] group-[.toaster]:shadow-blue-200/30 group-[.toaster]:backdrop-blur-sm",
        },
      }}
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "#486284",
          "--normal-border": "#E5E7EB",
          "--success-bg": "#F0FDF4",
          "--success-text": "#166534",
          "--success-border": "#BBF7D0",
          "--error-bg": "#FEF2F2",
          "--error-text": "#DC2626",
          "--error-border": "#FECACA",
          "--warning-bg": "#FFFBEB",
          "--warning-text": "#D97706",
          "--warning-border": "#FED7AA",
          "--info-bg": "#EFF6FF",
          "--info-text": "#2F6FED",
          "--info-border": "#BFDBFE",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
