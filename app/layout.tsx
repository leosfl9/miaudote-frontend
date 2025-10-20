import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiAudote",
  description: "Plataforma de adoção de animais",
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
