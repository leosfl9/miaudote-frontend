import PublicNavbar from "@/components/PublicNavbar";

export default function Sobre() { 
  return ( 
    <div className="flex flex-col min-h-screen"> 
        {/* chamada da navbar */}
        <PublicNavbar /> 
        <div className="flex items-center justify-center px-2 ssm:px-4 py-8 bg-miau-gray flex-col flex-1"> 
            {/* textos explicativos */}
            <div className="bg-background rounded-2xl ssm:rounded-4xl flex flex-col gap-8 pt-9 pb-12 px-6 ssm:px-10 xsm:px-14 md:px-20 max-w-[960px]">
                <h1 className="text-3xl md:text-4xl font-semibold text-center text-miau-green">Sobre nós</h1>
                <div className="space-y-8 md:space-y-12 text-justify text-lg md:text-2xl">
                    <p className="text-text-black font-medium">
                        O MiAudote é resultado de um projeto desenvolvido por alunos do curso de Análise e Desenvolvimento de Sistemas da FATEC-SP (2025), 
                        com o objetivo de facilitar e incentivar a adoção responsável de animais. A iniciativa propõe uma plataforma que conecta adotantes e ONGs, 
                        promovendo um processo de adoção mais eficiente, transparente e acolhedora.
                    </p>
                    <p className="text-text-black font-medium">
                        Mais do que um site, o MiAudote representa uma forma de usar a inovação para gerar impacto social, conectando vidas e promovendo o bem-estar animal.
                    </p>
                    <p className="text-text-black font-medium">
                        Acreditamos que a empatia e o acesso à informação são fundamentais para transformar a realidade de milhares de animais que aguardam um lar. 
                        Este projeto também reflete o aprendizado e a prática dos alunos envolvidos, 
                        unindo conhecimento técnico e propósito social em uma solução que busca inspirar mudanças reais.
                    </p>
                </div>
            </div>
        </div> 
    </div> 
  ); 
}
