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
    shortcut: "/icon_gato_256.png",
    apple: "/icon_gato_512.png",
  },
  openGraph: {
    title: "MiAudote",
    description: "Plataforma de adoção de animais",
    url: "https://www.miaudote.org",
    siteName: "MiAudote",
    images: [
      {
        url: "https://www.miaudote.org/icon_gato_256.png",
        width: 256,
        height: 256,
        alt: "Logo MiAudote",
      },
    ],
    locale: "pt_BR",
    type: "website",
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
