import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miaudote",
  description: "Plataforma de adoção de animais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
    <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={`${fredoka.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
