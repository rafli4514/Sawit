import { Inter, Poppins } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { DiagnosisProvider } from "./context/DiagnosisContext";
import { Toaster } from "./components/ui/sonner";
import "../styles/globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable} notranslate`} translate="no" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className="font-sans antialiased">
        <AuthProvider>
          <DiagnosisProvider>
            {children}
            <Toaster richColors position="top-right" />
          </DiagnosisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
