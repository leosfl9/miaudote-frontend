"use client"

import RequestCard from "@/components/RequestCard";

import { useEffect, useState } from "react";

interface Solicitacao {
    id: number;
    nomePet: string;
    nomeAdotante: string;
    data: string;
    foto: string;
    status: string;
}

export default function SolicitacoesAdocao(){
    const [solicitacoes, setSolitacoes] = useState<Solicitacao[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarSolicitacoes() {
            try {
            const response = await fetch(`http://localhost:8080/adocoes/parceiro/37`);
            if (!response.ok) throw new Error("Erro ao buscar dados");

            const data = await response.json();
            console.log("Dados recebidos:", data);

            const listaSolicitacoes: Solicitacao[] = data.map((item: any) => ({
                id: item.id,
                idPet: item.foto.animal.id,
                idAdotante: item.adotante.id,
                nomePet: item.foto.animal.nome,
                nomeAdotante: item.adotante.nome,
                // data: item.data,
                status: item.status,
                foto: item.foto.foto,
            }));

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
                {/* <RequestCard nome={data.nome} /> */}
                {solicitacoes.length > 0 ? (
                    solicitacoes.map((solicitacao) => (
                        <RequestCard 
                            key={solicitacao.id}
                            nome={solicitacao.nomePet}
                            adotante={solicitacao.nomeAdotante}
                            status={solicitacao.status}
                            foto={`data:image/jpeg;base64,${solicitacao.foto}`} 
                        />
                    ))
                ) : (
                    <div className="py-8">
                        <p className="text-text-light-gray font-medium text-2xl">
                        Nenhuma solicitação de adoção!
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}