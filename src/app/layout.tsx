import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "AMA Management",
  description: "Sistema de gerenciamento AMA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
