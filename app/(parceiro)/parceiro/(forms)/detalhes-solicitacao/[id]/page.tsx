"use client";

import Link from "next/link";
import NextImage from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect, use } from "react";

import mascaraCPF from "@/utils/mascaraCPF";
import mascaraTelefone from "@/utils/mascaraTelefone";

import LinkButton from "@/components/LinkButton";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// tipagem dos dados recebidos da API
interface Adocao {
  status: string;
  cpf: string;
  dataCadastro: string;
  adotante: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    estado: string;
  };
  animal: {
    id: number;
    nome: string;
  };
}

export default function DetalhesSolicitacao({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // obtém o id da solicitação, que vem como parâmetro na url

    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const router = useRouter(); // hook de roteamento

    const [adocao, setAdocao] = useState<Adocao | null>(null); // armazena os dados da adoção
    const [loading, setLoading] = useState(true); // estado da página, que carrega enquanto os dados são recebidos

    // estados para desabilitar os botões de envio
    const [sendingFinalizar, setSendingFinalizar] = useState(false);
    const [sendingCancelar, setSendingCancelar] = useState(false);

    useEffect(() => {
        // envia o usuário para o login se ele não estiver autenticado
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }

        // get de dados da solicitação de adoção
        async function carregarSolicitacao() {
            try {
                // recebe os dados da API
                const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                // se a API retornar erro, exibe
                if (!response.ok) {
                    let errorMsg = "Erro ao buscar solicitação!";
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

                // armazena os dados da resposta no estado da adoção
                const data = await response.json();
                setAdocao(data.adocao);
            } catch (error) {
                // envia um alerta para o usuário caso não haja conexão com o servidor
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Erro de conexão ao servidor!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } finally {
                setLoading(false); // carrega a página
            }
        }

        carregarSolicitacao(); // chama a função quando a url é lida por completo
    }, [id]);

    // exibe a tela de carregamento enquanto os dados da solicitação são obtidos
    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    // apenas por precaução, se o estado de adoção não tiver nada, envia o usuário para a página de solicitações
    if (!adocao) {
        Swal.fire({
            position: "top",
            icon: "error",
            title: "Erro ao carregar detalhes!",
            showConfirmButton: false,
            timer: 1500
        });
        router.push("/parceiro/solicitacoes");
        return;
    }
    
    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            
            <div className="w-full max-w-[580px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/parceiro/solicitacoes"} text="Voltar" color="white" back={true} />
            </div>
            
            <form className="bg-white flex flex-col gap-3 items-center w-full max-w-[580px] px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/parceiro/home"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <NextImage src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center mb-4">
                    Solicitação de adoção</h1>

                {/* preenchimento dos campos com os dados da API */}
                <div className={`flex flex-col w-full gap-2 ${adocao.status != "Em Aberto" ? "pb-4" : ""}`}>
                    <div className="flex flex-col gap-4">
                        {adocao.status != "Em Aberto" && (
                            <div className="flex flex-col">
                                <h2 className="font-medium text-lg text-text-gray">Status</h2>
                                <h3 className="font-semibold text-lg text-text-light-gray text-ellipsis overflow-clip line-clamp-2">{adocao.status}</h3>
                            </div>
                        )}

                        <div className="flex flex-col">
                            <h2 className="font-medium text-lg text-text-gray">Nome do pet</h2>
                            <h3 className="font-semibold text-lg text-text-light-gray text-ellipsis overflow-clip line-clamp-2">{adocao.animal.nome}</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-lg text-text-gray">Nome do adotante</h2>
                            <h3 className="font-semibold text-lg text-text-light-gray text-ellipsis overflow-clip line-clamp-2">{adocao.adotante.nome}</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-lg text-text-gray">CPF do adotante</h2>
                            <h3 className="font-semibold text-lg text-text-light-gray">{mascaraCPF(adocao.cpf)}</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-lg text-text-gray">Celular do adotante</h2>
                            <h3 className="font-semibold text-lg text-text-light-gray">{mascaraTelefone(adocao.adotante.telefone)}</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-lg text-text-gray">E-mail do adotante</h2>
                            <h3 className="font-semibold text-lg text-text-light-gray text-ellipsis overflow-clip">{adocao.adotante.email}</h3>
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-medium text-lg text-text-gray">Local</h2>
                            <h3 className="font-semibold text-lg text-text-light-gray text-ellipsis overflow-clip">
                                <span>{adocao.adotante.cidade}</span> - <span>{adocao.adotante.estado}</span></h3>
                        </div>
                    </div>
                </div>

                {/* apenas se a adoção ainda estiver em aberto, exibe os botões */}
                {adocao.status == "Em Aberto" && (
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col xsm:flex-row xsm:gap-3">
                            {/* botão de finalizar adoção */}
                            <button onClick={async () => { 
                                try {
                                    setSendingFinalizar(true); // desabilita os botões

                                    // modal de confirmação
                                    const confirm = await Swal.fire({
                                        title: "Tem certeza?",
                                        text: "A solicitação será finalizada com adoção.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#1B998B",
                                        cancelButtonColor: "#F35D5D",
                                        confirmButtonText: "Sim, finalizar solicitação",
                                        cancelButtonText: "Cancelar",
                                    });
                            
                                    if (!confirm.isConfirmed) return; // caso o usuário cancele a ação, não faz nada

                                    // chama a API para atualizar o status da solicitação de adoção
                                    const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/${id}`, {
                                        method: "PATCH",
                                        headers: {
                                            "Authorization": `Bearer ${token}`,
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ status: "Finalizada com adoção" }),
                                    });

                                    // se a API retornar erro, exibe
                                    if (!response.ok) {
                                        let errorMsg = "Erro ao finalizar adoção!";
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

                                    // mensagem de sucesso, caso não haja erro
                                    Swal.fire({
                                        position: "top",
                                        icon: "success",
                                        title: "Adoção finalizada com sucesso!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });

                                    router.push("/parceiro/solicitacoes"); // envia o usuário para a página de solicitações
                                } catch (error) {
                                    // envia um alerta para o usuário caso não haja conexão com o servidor
                                    Swal.fire({
                                        position: "top",
                                        icon: "error",
                                        title: "Erro de conexão ao servidor!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });
                                } finally {
                                    setSendingFinalizar(false); // habilita os botões novamente
                                }
                            }}
                                disabled={sendingFinalizar || sendingCancelar}
                                className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 
                                    ${(sendingFinalizar || sendingCancelar) ? "bg-miau-green/70" : "bg-miau-green hover:bg-miau-light-green active:bg-miau-light-green"}`}>
                                    {sendingFinalizar ? "Finalizando..." : "Finalizar adoção"}
                            </button>

                            {/* botão de cancelar adoção */}
                            <button onClick={async () => {
                                    try {
                                        setSendingCancelar(true); // desabilita os botões

                                        // modal de confirmação
                                        const confirm = await Swal.fire({
                                            title: "Tem certeza?",
                                            text: "A solicitação será cancelada.",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#F35D5D",
                                            cancelButtonColor: "#1B998B",
                                            confirmButtonText: "Sim, cancelar solicitação",
                                            cancelButtonText: "Cancelar",
                                        });
                                
                                        if (!confirm.isConfirmed) return; // caso o usuário cancele a ação, não faz nada

                                        // chama a API para atualizar o status da solicitação de adoção
                                        const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/${id}`, {
                                            method: "PATCH",
                                            headers: {
                                                "Authorization": `Bearer ${token}`,
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ status: "Finalizada por desistência do parceiro" }),
                                        });

                                        // se a API retornar erro, exibe
                                        if (!response.ok) {
                                            let errorMsg = "Erro ao cancelar adoção!";
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

                                        // mensagem de sucesso, caso não haja erro
                                        Swal.fire({
                                            position: "top",
                                            icon: "success",
                                            title: "Adoção cancelada com sucesso!",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });

                                        router.push("/parceiro/solicitacoes"); // envia o usuário para a página de solicitações

                                    } catch (error) {
                                        // envia um alerta para o usuário caso não haja conexão com o servidor
                                        Swal.fire({
                                            position: "top",
                                            icon: "error",
                                            title: "Erro de conexão ao servidor!",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                    } finally {
                                        setSendingCancelar(false); // habilita os botões novamente
                                    }
                                }}
                                disabled={sendingFinalizar || sendingCancelar}
                                className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 
                                    ${(sendingCancelar || sendingFinalizar) ? "bg-[#F35D5D]/70" : "bg-[#F35D5D] hover:bg-[#fA7C7C] active:bg-[#fA7C7C]"}`}>
                                    {sendingCancelar ? "Cancelando..." : "Cancelar adoção"}
                            </button>
                        </div>

                        {/* botão de contatar o adotante, envia o usuário para o whatsapp com mensagem inicial pronta para envio (podendo ser editada) */}
                        <button className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                            shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 bg-miau-purple hover:bg-miau-purple/80 active:bg-miau-purple/80`}
                            onClick={(e) => {
                                e.preventDefault();
                                const mensagem = `Olá! Estou te contatando para tratarmos da sua solicitação de adoção do pet ${adocao.animal.nome}, no site MiAudote.`;
                                const url = `https://wa.me/+55${adocao.adotante.telefone}?text=${encodeURIComponent(mensagem)}`;
                                window.open(url, "_blank");
                            }}>
                            Contatar adotante
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
