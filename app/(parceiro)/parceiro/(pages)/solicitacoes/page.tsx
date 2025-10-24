"use client"

import RequestCard from "@/components/RequestCard";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Solicitacao {
    id: number;
    nomePet: string;
    nomeAdotante: string;
    data: string;
    foto: string;
    status: string;
}

export default function SolicitacoesAdocao(){
    const token = Cookies.get("token");
    const id = Cookies.get("userId");

    const [solicitacoes, setSolitacoes] = useState<Solicitacao[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        async function carregarSolicitacoes() {
            try {
            const response = await fetch(`http://localhost:8080/adocoes/parceiro/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                let errorMsg = "Erro ao buscar solicitações!";
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

            const data = await response.json();
            console.log("Dados recebidos:", data);

            const listaSolicitacoes: Solicitacao[] = data.map((item: any) => {
                const [ano, mes, dia] = item.adocao.dataCadastro.split("-");
                const dataFormatada = `${dia}/${mes}/${ano}`;

                return {
                    id: item.adocao.id,
                    idPet: item.adocao.animal.id,
                    idAdotante: item.adocao.adotante.id,
                    nomePet: item.adocao.animal.nome,
                    nomeAdotante: item.adocao.adotante.nome,
                    data: dataFormatada,
                    status: item.adocao.status,
                    foto: item.fotos[0].foto,
                };
            });

            setSolitacoes(listaSolicitacoes);

            } catch (error) {
                console.error("Erro ao carregar solicitações:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarSolicitacoes();
    }, []);

    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Solicitações de adoção</h1>
                <h2 className="text-base 2xl:text-lg">Visualize e gerencie suas solicitações de adoção.</h2>
            </div>

            <div className="flex flex-col plg:flex-row plg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                {solicitacoes.length > 0 ? (
                    solicitacoes.map((solicitacao) => (
                        <RequestCard 
                            key={solicitacao.id}
                            id={solicitacao.id}
                            nome={solicitacao.nomePet}
                            adotante={solicitacao.nomeAdotante}
                            status={solicitacao.status}
                            data={solicitacao.data}
                            foto={`data:image/jpeg;base64,${solicitacao.foto}`} 
                        />
                    ))
                ) : (
                    <div className="py-8 px-0 text-start text-text-light-gray font-medium text-2xl">
                        <p>Ainda não há solicitações, mas em breve alguém especial pode aparecer!</p>
                    </div>
                )}

            </div>
        </div>
    );
}