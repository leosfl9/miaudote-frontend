// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import ConfirmationCard from "@/components/ConfirmationCard";

import { CircleCheckBig } from "lucide-react";
import LinkButton from "@/components/LinkButton";

export default function ConfirmacaoSolicitacao() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const role = searchParams.get("role") as "adotante" | "parceiro" | null;

//   const [valid, setValid] = useState(false);

//   useEffect(() => {
//     const flag = sessionStorage.getItem("justRegistered");
//     if (!role || !flag || flag !== role) {
//       router.replace("/tipo-cadastro"); // se não tiver flag válida, expulsa
//     } else {
//       setValid(true);
//     }
//   }, [role, router]);

//   if (!valid) return null; // evita piscar a tela errada

  return (
    <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
      bg-[url('/grafo_fundo.png')] bg-no-repeat bg-cover bg-center">
      <div className="bg-white flex flex-col items-center px-3 ssm:px-10 lg:px-8 sssm:px-8 sssm:max-w-[356px] 
        md:max-w-[400px] lg:max-w-[420px] py-14 rounded-4xl">
        <div className="flex flex-col text-center gap-8">
          <div className="w-full flex justify-center">
            <CircleCheckBig className="text-green-600/50 text-7xl w-20 ssm:w-24 lg:w-28 h-20 ssm:h-24 lg:h-28" />
          </div>

          <div className="flex flex-col gap-6 lg:gap-10 text-text-black">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Solicitação enviada com sucesso!</h1>
            <div className="flex flex-col gap-2">
              <LinkButton href={"/adotante/confirmacao"} text="Whatsapp ONG" color={`green`} className="mt-4" big />
              <LinkButton href={"/adotante/home"} text="Página principal" color={`orangeWhite`} className="mt-4" big />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}