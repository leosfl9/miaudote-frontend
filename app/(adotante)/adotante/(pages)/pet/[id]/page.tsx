"use client"

import Image from "next/image";

import LinkButton from "@/components/LinkButton";
import AnimalPresentation from "@/components/AnimalPresentation";
import { X } from "lucide-react";

import { use, useEffect, useState } from "react";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Animal {
    id: number;
    nome: string;
    especie: string;
    idade: number;
    descricao: string;
    porte: string;
    sexo: string;
    status: string;
    obs: string;
    parceiro: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        cidade: string;
        estado: string;
    };
}

export default function PetPresentation({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [open, setOpen] = useState(false);

    const [animal, setAnimal] = useState<Animal | null>(null);
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    useEffect(() => {
        async function carregarAnimal() {
            try {
            const response = await fetch(`http://localhost:8080/fotos/animal/${id}`);
            if (!response.ok) throw new Error("Erro ao buscar dados");

            const data = await response.json();
            console.log("Dados recebidos:", data);

            const animal = data[0]?.animal;
            const fotos = data.map((item: { foto: string; }) => item.foto);

            console.log("Animal:", animal);
            console.log("Fotos:", fotos);

            setAnimal(animal);
            setFotos(fotos);

            } catch (error) {
            console.error("Erro ao carregar animal:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarAnimal();
    }, [id]);

    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 lxl:relative sm:gap-8 items-center justify-center px-2 md:px-8 py-8 lxl:py-10 
            bg-[url('/grafo_pets.png')] bg-no-repeat bg-cover bg-center flex-1">

            <div className="w-full lxl:absolute lxl:top-10 lxl:pl-10">
                <LinkButton href={"/adotante/home"} text="Voltar" color="white" back={true} />
            </div>

            {animal ? 
                <AnimalPresentation tipo="adotante" nome={animal.nome} descricao={animal.descricao} idade={animal.idade} sexo={animal.sexo} 
                porte={animal.porte} cidade={animal.parceiro.cidade} estado={animal.parceiro.estado} obs={animal.obs} especie={animal.especie}
                fotos={fotos} href="#" onOpenModal={() => setOpen(true)} /> : 
                ""}

            {open && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
                    <div className="relative bg-white rounded-lg p-4 xsm:px-10 xl:px-20 flex flex-col items-center gap-4 
                        max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22 shrink-0">
                            <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                        </div>
                        <div className="absolute top-4 right-4">
                            <X className="text-text-gray w-6 sssm:w-8 h-6 sssm:h-8 cursor-pointer hover:text-miau-green active:text-miau-green" 
                                onClick={() => setOpen(false)} />
                        </div>
                        <h1 className="text-text-light-gray font-bold text-3xl text-center mb-2 tracking-wide">
                            DIRETRIZES DE BOAS PRÁTICAS PARA ADOÇÃO RESPONSÁVEL
                        </h1>
                        <div className="flex flex-col gap-4 xl:gap-6">
                            <div className="flex flex-col md:flex-row text-start gap-4 md:gap-12">
                                <div className="flex flex-col font-bold text-justify md:w-[350px] xl:w-[420px]">
                                    <h2 className="text-miau-purple">1. Segurança do lar</h2>
                                    <p className="text-text-light-gray">• Instale redes de proteção em janelas, sacadas e varandas (essencial para gatos e também para cachorros em locais elevados).</p>
                                    <p className="text-text-light-gray">• Mantenha portões, muros e quintais bem fechados para evitar fugas.</p>
                                    <p className="text-text-light-gray">• Verifique se não há rotas de fuga por frestas, buracos ou telhados.</p>
                                </div>

                                <div className="flex flex-col font-bold text-justify md:w-[350px] xl:w-[420px]">
                                    <h2 className="text-miau-orange">2. Condições financeiras</h2>
                                    <p className="text-text-light-gray">• Tenha recursos para custear alimentação de qualidade, vacinas, consultas veterinárias e eventuais emergências.</p>
                                    <p className="text-text-light-gray">• Lembre-se: a adoção é gratuita, mas a manutenção do pet exige compromisso financeiro constante.</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row text-start gap-4 md:gap-12">
                                <div className="flex flex-col font-bold text-justify md:w-[350px] xl:w-[420px]">
                                    <h2 className="text-miau-green">3. Compromisso com a Saúde e Bem-estar</h2>
                                    <p className="text-text-light-gray">• Levar o animal regularmente ao veterinário para vacinas, consultas e prevenção de doenças.</p>
                                    <p className="text-text-light-gray">• Proporcionar ambiente limpo, seguro e enriquecido (brinquedos, arranhadores para gatos, passeios e exercícios para cães).</p>
                                </div>

                                <div className="flex flex-col font-bold text-justify md:w-[350px] xl:w-[420px]">
                                    <h2 className="text-miau-orange">4. Termo de Responsabilidade</h2>
                                    <p className="text-text-light-gray">• Assinar um termo de adoção responsável, comprometendo-se a:</p>
                                    <p className="text-text-light-gray">- Não abandonar o animal.</p>
                                    <p className="text-text-light-gray">- Não doá-lo a terceiros sem autorização da ONG.</p>
                                    <p className="text-text-light-gray">- Zelar por sua saúde e segurança durante toda a vida.</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row text-start gap-4 md:gap-12">
                                <div className="flex flex-col font-bold text-justify md:w-[350px] xl:w-[420px]">
                                    <h2 className="text-miau-green">5. Localização e Logística</h2>
                                    <p className="text-text-light-gray">• As adoções podem acontecer em diferentes cidades e estados, mas cada ONG define suas regras.</p>
                                    <p className="text-text-light-gray">• Adotantes devem estar dispostos a visitas de acompanhamento ou prestar informações à ONG sobre a adaptação do animal.</p>
                                </div>

                                <div className="flex flex-col font-bold text-justify md:w-[350px] xl:w-[420px]">
                                    <h2 className="text-miau-purple">6. Conscientização e Amor</h2>
                                    <p className="text-text-light-gray">• Adotar é um ato de responsabilidade, não de impulso.</p>
                                    <p className="text-text-light-gray">• O pet será parte da família: ofereça amor, paciência e companhia.</p>
                                    <p className="text-text-light-gray">• Lembre-se: cães e gatos vivem muitos anos — esteja preparado para esse compromisso a longo prazo.</p>
                                </div>
                            </div>

                            <button onClick={async () => {
                                try {
                                    const payload = {
                                        adotanteId: 36,
                                        animalId: id,
                                    };

                                    const response = await fetch(`http://localhost:8080/adocoes/cadastrar`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(payload),
                                    });

                                    if (!response.ok) {
                                        throw new Error("Erro ao solicitar adoção");
                                    }

                                    Swal.fire({
                                        position: "top",
                                        icon: "success",
                                        title: "Solicitação enviada com sucesso!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });

                                    router.push("/adotante/solicitacoes");

                                } catch (error) {
                                    console.error(error);
                                    Swal.fire({
                                        position: "top",
                                        icon: "error",
                                        title: "Erro ao solicitar adoção!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });
                                } 
                            }}
                                className={`w-fit self-center text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                                shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 bg-miau-green hover:bg-miau-light-green active:bg-miau-light-green`}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}