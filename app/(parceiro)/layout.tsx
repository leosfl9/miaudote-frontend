import PrivateNavbar from "@/components/PrivateNavbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <PrivateNavbar tipo="parceiro" />
        {children}
    </>

  );
}