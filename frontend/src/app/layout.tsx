import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

// Metadata statik olarak tanımlanmalı, ancak gerçek uygulamada
// bu bilgiler API'den alınabilir ve generateMetadata fonksiyonu kullanılabilir
export const metadata: Metadata = {
  title: "Football School CMS",
  description: "Professional Football School Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={poppins.className}>
        <main className="bg-gray-50">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
