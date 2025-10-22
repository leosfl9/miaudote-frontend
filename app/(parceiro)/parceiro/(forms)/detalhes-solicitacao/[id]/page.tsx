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
    const { id } = use(params);

    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const router = useRouter();

    const [adocao, setAdocao] = useState<Adocao | null>(null);
    const [loading, setLoading] = useState(true);
    const [sendingFinalizar, setSendingFinalizar] = useState(false);
    const [sendingCancelar, setSendingCancelar] = useState(false);

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        async function carregarSolicitacao() {
            try {
            const response = await fetch(`http://localhost:8080/adocoes/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) throw new Error("Erro ao buscar dados");

            const data = await response.json();
            console.log("Dados recebidos:", data);

            setAdocao(data.adocao);

            } catch (error) {
                console.error("Erro ao carregar solicitações:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarSolicitacao();
    }, [id]);

    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

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

                {adocao.status == "Em Aberto" && (
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col xsm:flex-row xsm:gap-3">
                            <button onClick={async () => {
                                try {
                                    setSendingFinalizar(true);

                                    const response = await fetch(`http://localhost:8080/adocoes/${id}`, {
                                        method: "PATCH",
                                        headers: {
                                            "Authorization": `Bearer ${token}`,
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ status: "Finalizada com adoção" }),
                                    });

                                    if (!response.ok) {
                                        let errorMsg = "Erro ao editar!";
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
                                                timer: 2000,
                                            });
                                        }
                            
                                        // exibe o erro recebido
                                        Swal.fire({
                                            position: "top",
                                            icon: "error",
                                            title: errorMsg,
                                            showConfirmButton: false,
                                            timer: 2500,
                                        });
                                        return;
                                    }

                                    Swal.fire({
                                        position: "top",
                                        icon: "success",
                                        title: "Adoção finalizada com sucesso!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });

                                    router.push("/parceiro/solicitacoes");

                                } catch (error) {
                                    console.error(error);
                                    Swal.fire({
                                        position: "top",
                                        icon: "error",
                                        title: "Erro ao finalizar adoção!",
                                        showConfirmButton: false,
                                        timer: 1500,
                                    });
                                } finally {
                                    setSendingFinalizar(false);
                                }
                            }}
                                disabled={sendingFinalizar || sendingCancelar}
                                className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 
                                    ${(sendingFinalizar || sendingCancelar) ? "bg-miau-green/70" : "bg-miau-green hover:bg-miau-light-green active:bg-miau-light-green"}`}>
                                    {sendingFinalizar ? "Finalizando..." : "Finalizar adoção"}
                            </button>

                            <button onClick={async () => {
                                    try {
                                        setSendingCancelar(true);

                                        const response = await fetch(`http://localhost:8080/adocoes/${id}`, {
                                            method: "PATCH",
                                            headers: {
                                                "Authorization": `Bearer ${token}`,
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ status: "Finalizada por desistência do parceiro" }),
                                        });

                                        if (!response.ok) {
                                            let errorMsg = "Erro ao editar!";
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
                                                    timer: 2000,
                                                });
                                            }
                                
                                            // exibe o erro recebido
                                            Swal.fire({
                                                position: "top",
                                                icon: "error",
                                                title: errorMsg,
                                                showConfirmButton: false,
                                                timer: 2500,
                                            });
                                            return;
                                        }

                                        Swal.fire({
                                            position: "top",
                                            icon: "success",
                                            title: "Adoção cancelada com sucesso!",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });

                                        router.push("/parceiro/solicitacoes");

                                    } catch (error) {
                                        console.error(error);
                                        Swal.fire({
                                            position: "top",
                                            icon: "error",
                                            title: "Erro ao cancelar adoção!",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                    } finally {
                                        setSendingCancelar(false);
                                    }
                                }}
                                disabled={sendingFinalizar || sendingCancelar}
                                className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 
                                    ${(sendingCancelar || sendingFinalizar) ? "bg-[#F35D5D]/70" : "bg-[#F35D5D] hover:bg-[#fA7C7C] active:bg-[#fA7C7C]"}`}>
                                    {sendingCancelar ? "Cancelando..." : "Cancelar adoção"}
                            </button>
                        </div>

                        <button className={`w-full text-lg xl:text-xl px-8 py-1 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                            shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-4 mb-2 bg-miau-purple hover:bg-miau-purple/80 active:bg-miau-purple/80`}>
                            Contatar adotante
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
