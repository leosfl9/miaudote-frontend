import PublicNavbar from "@/components/PublicNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <PublicNavbar />
        {children}
      </body>
    </html>
  );
}