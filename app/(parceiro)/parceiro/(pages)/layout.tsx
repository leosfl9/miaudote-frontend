import PrivateNavbar from "@/components/PrivateNavbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
        <PrivateNavbar tipo="parceiro" />
        {children}
    </div>

  );
}