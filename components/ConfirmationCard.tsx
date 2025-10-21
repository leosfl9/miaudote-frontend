import LinkButton from "./LinkButton";

// tipagem da prop do card de confirmação de cadastro
interface ConfirmationCardProps {
    role: "adotante" | "parceiro";
}

export default function ConfirmationCard({ role }: ConfirmationCardProps) {
    // definição das mensagens exibidas de acordo com o tipo de usuário
    const msgs = {
        adotante: {
            boasVindas: "Boas-vindas, ser humano!",
            confirmacao: "Pets próximos a você já foram avisados. Vamos lá!" 
        },
        parceiro: {
            boasVindas: "Seja bem-vindo!",
            confirmacao: "Agora você pode acessar a plataforma e colocar pets para adoção!"
        }
    }

    const { boasVindas, confirmacao } = msgs[role];

    return (
        <div className="bg-white flex flex-col items-center px-3 ssm:px-10 lg:px-8 sssm:px-8 sssm:max-w-[356px] 
            md:max-w-[400px] lg:max-w-[420px] py-14 rounded-4xl animate-bounce-once ">
            <div className="flex flex-col text-center gap-8">
                {/* ícone de prancheta */}
                <div className="w-full flex justify-center">
                    <img src={'/prancheta.png'} className="text-green-600/50 text-7xl w-18 ssm:w-20 lg:w-24 h-20 ssm:h-24 lg:h-28" />
                </div>

                <div className="flex flex-col gap-6 lg:gap-10 text-text-black">
                    <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Cadastro realizado com sucesso!</h1>
                    {/* exibição dos textos */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        <p className="text-base md:text-lg lg:text-xl">{boasVindas}</p>
                        {/* texto extra para adotantes */}
                        {role === "adotante" && (
                                <p className="text-base md:text-lg lg:text-xl">O <span className="font-semibold">MiAudote</span> agradece a preferência!</p>)}
                        <p className="text-base md:text-lg lg:text-xl">{confirmacao}</p>
                        {/* link para a página de login */}
                        <LinkButton href={"/login"} text="Fazer login" color={`${role === "adotante" ? "orangeWhite" : "purple"}`} className="mt-4" big />
                    </div>
                </div>
            </div>
        </div>
    );  
}