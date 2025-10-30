import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

// metadados da aplicação
export const metadata: Metadata = {
  title: "MiAudote",
  description: "Plataforma de adoção de animais",
  icons: {
    icon: "/icon.ico",
  },
  openGraph: {
    title: "MiAudote - Plataforma de adoção de animais",
    description:
      "Adote com amor. Conectamos pessoas e pets que precisam de um lar.",
    url: "https://www.miaudote.org",
    siteName: "MiAudote",
    images: [
      {
        url: "https://www.miaudote.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Logo MiAudote",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MiAudote - Plataforma de adoção de animais",
    description:
      "Adote com amor. Conectamos pessoas e pets que precisam de um lar.",
    images: ["/icon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
    <link rel="icon" href="/icon.ico" sizes="any" type="image/png" />
      <body className={`${fredoka.variable} antialiased`}
        suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
