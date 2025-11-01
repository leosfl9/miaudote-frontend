import PublicNavbar from "@/components/PublicNavbar";

export default function ComoAdotar() { 
  return ( 
    <div className="flex flex-col min-h-screen"> 
        {/* chamada da navbar */}
        <PublicNavbar /> 
        <div className="flex items-center justify-center px-2 ssm:px-4 py-8 bg-miau-gray flex-col flex-1"> 
            {/* textos explicativos */}
            <div className="bg-background rounded-2xl ssm:rounded-4xl flex flex-col gap-8 pt-9 pb-2 px-6 ssm:px-10 xsm:px-14 md:px-16 lg:px-20 max-w-fit">
                <h1 className="text-3xl md:text-4xl font-semibold text-center text-miau-green">Como adotar um pet?</h1>
                <div className="flex flex-col gap-4 lg:gap-8">
                    <div className="flex flex-col md:flex-row text-start justify-around gap-4 md:gap-12 xl:gap-18">
                        <div className="flex flex-col text-justify md:w-[280px] lg:w-[340px] xl:w-[370px] md:space-y-2">
                            <h2 className="text-text-black font-semibold text-lg lg:text-xl xl:text-2xl">
                                <span className="text-miau-purple text-2xl lg:text-3xl pr-1 font-bold">1.</span> Escolha sua nova companhia</h2>
                            <p className="text-text-light-gray font-medium xl:text-lg">Aplique filtros, escolha por localização, sexo e espécie.</p>
                        </div>

                        <div className="flex flex-col font-bold text-justify md:w-[280px] lg:w-[340px] xl:w-[370px] md:space-y-2">
                            <h2 className="text-text-black font-semibold text-lg lg:text-xl xl:text-2xl">
                                <span className="text-miau-purple text-2xl lg:text-3xl pr-1 font-bold">2.</span> Solicite adoção</h2>
                            <p className="text-text-light-gray font-medium xl:text-lg">Ao solicitar adoção, a ONG/protetor responsável recebe seu pedido.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row text-start justify-around gap-4 md:gap-12 xl:gap-18">
                        <div className="flex flex-col font-bold text-justify md:w-[280px] lg:w-[340px] xl:w-[370px] md:space-y-2">
                            <h2 className="text-text-black font-semibold text-lg lg:text-xl xl:text-2xl">
                                <span className="text-miau-purple text-2xl lg:text-3xl pr-1 font-bold">3.</span> Aguarde o contato do parceiro</h2>
                            <p className="text-text-light-gray font-medium xl:text-lg">A ONG/protetor responsável entrará em contato para marcar a entrevista ou visita.</p>
                        </div>

                        <div className="flex flex-col font-bold text-justify md:w-[280px] lg:w-[340px] xl:w-[370px] md:space-y-2">
                            <h2 className="text-text-black font-semibold text-lg lg:text-xl xl:text-2xl">
                                <span className="text-miau-purple text-2xl lg:text-3xl pr-1 font-bold">4.</span> Adote com responsabilidade!</h2>
                            <p className="text-text-light-gray font-medium xl:text-lg">Finalize a adoção, siga as orientações da ONG/parceiro e celebre essa nova conexão.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end -mt-6">
                    <img src={"/selo.png"} alt="Ícone de selo de aprovação" className="w-20 sm:w-24 h-20 sm:h-24" />
                </div>
            </div>
        </div> 
    </div> 
  ); 
}
