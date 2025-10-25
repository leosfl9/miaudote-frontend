"use client"

import LinkButton from "@/components/LinkButton";
import AnimalPresentation from "@/components/AnimalPresentation";

import { X } from "lucide-react";

import Cookies from "js-cookie";
import { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// tipagem de dados do animal
interface Animal {
    id: number;
    nome: string;
    especie: string;
    idade: number;
    descricao: string;
    porte: string;
    sexo: string;
    status: string;
    statusAdocao: string;
    dataAdocao: string;
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

export default function DetalhesSolicitacao({ params }: { params: Promise<{ id: string }> }) {
    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const { id } = use(params); // pega o id da solicitação pela URL

    // estado do modal de cancelamento de adoção
    const [openCancela, setOpenCancela] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const [animal, setAnimal] = useState<Animal | null>(null); // armazena dados do animal
    const [status, setStatus] = useState(undefined); // armazena o status da solicitação
    const [dataAdocao, setDataAdocao] = useState(undefined); // armazena a data da solicitação 
    const [fotos, setFotos] = useState([]); // armazena as fotos

    const [loading, setLoading] = useState(true); // estado de loading da página

    const router = useRouter(); // hook de roteamento

    // altera o estilo da página quando o modal de cancelamento for aberto
    useEffect(() => {
        if (openCancela) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openCancela]);

    useEffect(() => {
        // redireciona para o login se o usuário não estiver autenticado
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }

        // carrega dados da solicitação de adoção
        async function carregarSolicitacao() {
            try {
                // obtém os dados da solicitação
                const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                
                // se der erro, exibe um alerta
                if (!response.ok) {
                    let errorMsg = "Erro ao obter solicitação de adoção!";
                    try {
                        const text = await response.text();
                        try {
                            const json = JSON.parse(text);
                            errorMsg = json.message || JSON.stringify(json);
                        } catch {
                            errorMsg = text;
                        }
                    } catch (error) {
                        // envia um alerta para o usuário caso não haja conexão com o servidor
                        Swal.fire({
                            position: "top",
                            icon: "error",
                            title: "Erro de conexão com o servidor!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
        
                    // exibe o erro recebido
                    Swal.fire({
                        position: "top",
                        icon: "error",
                        title: errorMsg,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    return;
                }

                const data = await response.json(); // armazena  os dados da solicitação

                // armazena os dados variados
                const statusAdocao = data.adocao.status;
                const dataAdocao = data.adocao.dataCadastro;
                const animal = data.adocao.animal;
                const fotos = data.fotos.map((item: { foto: string; }) => item.foto);

                // seta os dados variados
                setAnimal(animal);
                setStatus(statusAdocao);
                setDataAdocao(dataAdocao);
                setFotos(fotos);
            } catch (error) {
                // envia um alerta para o usuário caso não haja conexão com o servidor
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Erro de conexão com o servidor!",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } finally {
                setLoading(false); // termina o carregamento da página
            }
        }

        carregarSolicitacao(); // chama a função quando a URL termina de ser lida
    }, [id]);

    // tela de loading
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
                <LinkButton href={"/adotante/solicitacoes"} text="Voltar" color="white" back={true} />
            </div>

            {/* se o animal estiver definido, apresenta seus dados */}
            {animal 
                ? <AnimalPresentation tipo="solicitacao" nome={animal.nome} descricao={animal.descricao} idade={animal.idade} sexo={animal.sexo} 
                    porte={animal.porte} cidade={animal.parceiro.cidade} estado={animal.parceiro.estado} obs={animal.obs} especie={animal.especie}
                    fotos={fotos} href="#" telefone={animal.parceiro.telefone} onOpenModalCancela={() => setOpenCancela(true)} status={status} dataAdocao={dataAdocao} /> 
                : ""
            }

            {/* exibe o modal de cancelamento de solicitação */}
            {openCancela && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setOpenCancela(false)}>
                    <div className="relative bg-white rounded-lg px-4 ssm:px-6 pt-12 ssm:pt-14 pb-4 sm:pb-6 flex flex-col items-center gap-4 
                        max-h-[90vh] max-w-[280px] ssm:max-w-[320px] sm:max-w-[340px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute top-4 right-4">
                            <X className="text-text-gray w-6 sssm:w-8 h-6 sssm:h-8 cursor-pointer hover:text-miau-green active:text-miau-green" 
                                onClick={() => setOpenCancela(false)} />
                        </div>
                        <h1 className="text-text-light-gray font-bold text-3xl ssm:text-4xl text-center mb-2 tracking-wide">
                            Tem certeza?
                        </h1>
                        <div className="flex flex-col gap-4 xl:gap-6 text-center">
                            <h2 className="text-text-gray text-xl ssm:text-2xl">Deseja mesmo cancelar a solicitação de adoção?</h2>

                            {/* botão de cancelar solicitação */}
                            <button onClick={async () => {
                                try {
                                    setCancelling(true); // desabilita o botão de cancelar

                                    // chama o PATCH da API, alterando o status da solicitação
                                    const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/${id}`, {
                                        method: "PATCH",
                                        headers: {
                                            "Authorization": `Bearer ${token}`,
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ 
                                            status: "Finalizada por desistência do adotante" 
                                        }),
                                    });

                                    // se der erro, exibe um alerta
                                    if (!response.ok) {
                                        let errorMsg = "Erro ao cancelar solicitação de adoção!";
                                        try {
                                            const text = await response.text();
                                            try {
                                                const json = JSON.parse(text);
                                                errorMsg = json.message || JSON.stringify(json);
                                            } catch {
                                                errorMsg = text;
                                            }
                                        } catch (error) {
                                            // envia um alerta para o usuário caso não haja conexão com o servidor
                                            Swal.fire({
                                                position: "top",
                                                icon: "error",
                                                title: "Erro de conexão com o servidor!",
                                                showConfirmButton: false,
                                                timer: 1500,
                                            });
                                        }
                            
                                        // exibe o erro recebido
                                        Swal.fire({
                                            position: "top",
                                            icon: "error",
                                            title: errorMsg,
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                        return;
                                    }

                                    // mensagem de sucesso
                                    Swal.fire({
                                        position: "top",
                                        icon: "success",
                                        title: "Adoção cancelada com sucesso!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });

                                    router.push("/adotante/solicitacoes"); // envia o usuário para a página de solicitações

                                } catch (error) {
                                    // envia um alerta para o usuário caso não haja conexão com o servidor
                                    Swal.fire({
                                        position: "top",
                                        icon: "error",
                                        title: "Erro de conexão com o servidor!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });
                                } finally {
                                    setCancelling(false); // habilita novamento o botão
                                }
                            }}
                                className={`w-fit self-center text-lg ssm:text-xl px-8 py-1 rounded-[48px] transition-colors  
                                shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 text-white font-semibold cursor-pointer
                                ${cancelling ? "bg-miau-purple/70" : "bg-miau-purple hover:bg-miau-light-green active:bg-miau-light-green"}`}
                                disabled={cancelling}>
                                {cancelling ? "Cancelando..." : (<p>Confirmar <span className="hidden sm:inline">cancelamento</span></p>)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}