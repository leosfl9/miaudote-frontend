"use client"

import RequestCard from "@/components/RequestCard";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// tipagem dos dados da solicitação de adoção
interface Solicitacao {
    id: number;
    nomePet: string;
    nomeAdotante: string;
    data: string;
    foto: string;
    status: string;
}

export default function SolicitacoesAdocao(){
    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const [solicitacoes, setSolitacoes] = useState<Solicitacao[]>([]) // armazena as solicitações
    const [solicitacoesFiltradas, setSolitacoesFiltradas] = useState<Solicitacao[]>([])

    const [loading, setLoading] = useState(true); // estado de loading da página

    // estados dos filtros
    const [filtroAbertas, setFiltroAbertas] = useState("");
    const [filtroEncerradas, setFiltroEncerradas] = useState("");
    const [filtroCanceladas, setFiltroCanceladas] = useState("");

    // inicializa e executa os filtros
    useEffect(() => {
        let filtradas = solicitacoes;

        if (filtroAbertas) {
            filtradas = filtradas.filter((s) =>
                s.status == "Em Aberto"
            );
        }

        if (filtroEncerradas) {
            filtradas = filtradas.filter((s) =>
                s.status == "Encerrada"
            );
        }

        if (filtroCanceladas) {
            filtradas = filtradas.filter((s) =>
                s.status == "Cancelada"
            );
        }

        setSolitacoesFiltradas(filtradas);
    }, [solicitacoes, filtroAbertas, filtroEncerradas, filtroCanceladas]);

    useEffect(() => {
        // se o usuário não estiver logado, é redirecionado para o login
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }

        // carrega as solicitações de adoção
        async function carregarSolicitacoes() {
            try {
                // faz um GET das solicitações de adoção
                const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/parceiro/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                // se der erro, exibe o alerta na tela
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

                const data = await response.json(); // armazena os dados recebidos da API

                // lista as solicitações
                const listaSolicitacoes: Solicitacao[] = data.map((item: any) => {
                    // formata a data recebida
                    const [ano, mes, dia] = item.adocao.dataCadastro.split("-"); 
                    const dataFormatada = `${dia}/${mes}/${ano}`;

                    // retorna um objeto com os dados que serão utilizados
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

                setSolitacoes(listaSolicitacoes); // salva a lista de solicitações
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
                setLoading(false); // termina o loading
            }
        }

        carregarSolicitacoes(); // chama a função
    }, []);

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
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray text-center">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Solicitações de adoção</h1>
                <h2 className="text-base 2xl:text-lg">Visualize e gerencie suas solicitações de adoção.</h2>
            </div>

            <div className="flex flex-row flex-wrap gap-4 ssm:gap-8 justify-center">
                <label className="flex flex-col sm:flex-row items-center gap-1 text-text-light-gray cursor-pointer">
                    <input type="radio" name="status" value="" checked={!filtroAbertas && !filtroEncerradas && !filtroCanceladas} className="cursor-pointer"
                        onChange={() => {
                            setFiltroAbertas("");
                            setFiltroEncerradas("");
                            setFiltroCanceladas("");
                        }} />
                    Todas
                </label>

                <label className="flex flex-col sm:flex-row items-center gap-1 text-text-light-gray cursor-pointer">
                    <input type="radio" name="status" value="Em Aberto" checked={filtroAbertas !== ""} className="cursor-pointer"
                        onChange={() => {
                            setFiltroAbertas("Em Aberto");
                            setFiltroEncerradas("");
                            setFiltroCanceladas("");
                        }} />
                    Em aberto
                </label>

                <label className="flex flex-col sm:flex-row items-center gap-1 text-text-light-gray cursor-pointer">
                    <input type="radio" name="status" value="Encerrada" checked={filtroEncerradas !== ""} className="cursor-pointer"
                        onChange={() => {
                            setFiltroAbertas("");
                            setFiltroEncerradas("Encerrada");
                            setFiltroCanceladas("");
                        }} />
                    Encerradas
                </label>

                <label className="flex flex-col sm:flex-row items-center gap-1 text-text-light-gray cursor-pointer">
                    <input type="radio" name="status" value="Finalizada" checked={filtroCanceladas !== ""} className="cursor-pointer"
                        onChange={() => {
                            setFiltroAbertas("");
                            setFiltroEncerradas("");
                            setFiltroCanceladas("Cancelada");
                        }} />
                    Canceladas
                </label>
            </div>

            <div className="flex flex-col plg:flex-row plg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start justify-center">
                {/* lista as solicitações de adoção */}
                {solicitacoesFiltradas.length > 0 ? (
                    solicitacoesFiltradas.map((solicitacao) => (
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
                    // se não houverem solicitações, exibe uma mensagem
                    <div className="py-8 px-0 text-start text-text-light-gray font-medium text-2xl">
                        {filtroAbertas ? (
                            <p>Ainda não há solicitações, mas em breve alguém especial pode aparecer!</p>
                        ) : filtroEncerradas ? (
                            <p>Nenhuma solicitação encerrada!</p>
                        ) : filtroCanceladas ? (
                            <p>Nenhuma solicitação cancelada!</p>
                        ) : (
                            <p>Ainda não há solicitações, mas em breve alguém especial pode aparecer!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}