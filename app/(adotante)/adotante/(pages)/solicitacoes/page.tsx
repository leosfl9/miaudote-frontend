"use client"

import AnimalCard from "@/components/AnimalCard";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// tipagem dos dados do animal
interface Animal {
  id: number;
  idPet: number;
  nome: string;
  idade: number;
  especie: string;
  descricao: string;
  obs: string;
  porte: string;
  sexo: string;
  status: string;
  foto: string;
}

export default function SolicitacoesAdocao(){
    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const [animais, setAnimais] = useState<Animal[]>([]); // estado para armazenar a lista de animais
    const [animaisFiltrados, setAnimaisFiltrados] = useState<Animal[]>([])

    const [loading, setLoading] = useState(true); // estado para controlar o carregamento

    // estados dos filtros
    const [filtroAbertas, setFiltroAbertas] = useState("");
    const [filtroEncerradas, setFiltroEncerradas] = useState("");
    const [filtroCanceladas, setFiltroCanceladas] = useState("");

    // inicializa e executa os filtros
    useEffect(() => {
        let filtradas = animais;

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

        setAnimaisFiltrados(filtradas);
    }, [animais, filtroAbertas, filtroEncerradas, filtroCanceladas]);

    useEffect(() => {
        // redireciona para a página de login caso não esteja autenticado
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }
        
        // função para carregar os animais solicitados
        async function carregarAnimais() {
            try {
                // faz a requisição para obter as adoções do adotante
                const response = await fetch(`https://miaudote-8av5.onrender.com/adocoes/adotante/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                
                // trata erros de resposta
                if (!response.ok) {
                    let errorMsg = "Erro ao obter solicitações de adoção!";
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

                const data = await response.json(); // obtém os dados da resposta

                // mapeia os dados para o formato esperado
                const listaAnimais: Animal[] = data.map((item: any) => ({
                    id: item.adocao.id,
                    idPet: item.adocao.animal.id,
                    nome: item.adocao.animal.nome,
                    idade: item.adocao.animal.idade,
                    especie: item.adocao.animal.especie,
                    descricao: item.adocao.animal.descricao,
                    obs: item.adocao.animal.obs,
                    porte: item.adocao.animal.porte,
                    sexo: item.adocao.animal.sexo,
                    status: item.adocao.status,
                    foto: item.fotos[0].foto,
                }));

                setAnimais(listaAnimais); // atualiza o estado com a lista de animais
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
                setLoading(false); // desativa o estado de carregamento
            }
        }

        carregarAnimais(); // chama a função para carregar os animais
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
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Solicitações de adoção</h1>
                <h2 className="text-base 2xl:text-lg">Visualize e gerencie suas solicitações de adoção.</h2>
            </div>

            <div className="flex flex-row flex-wrap gap-4 ssm:gap-8">
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

            <div className="flex flex-col plg:flex-row plg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                {/* se houveren solicitações, exibe-as */}
                {animaisFiltrados.length > 0 ? (
                    animaisFiltrados.map((animal) => (
                    <AnimalCard
                        key={animal.id}
                        idSolicitacao={animal.id}
                        idPet={animal.idPet}
                        tipo="solicitacao"
                        nome={animal.nome}
                        especie={animal.especie}
                        idade={animal.idade.toString()}
                        porte={animal.porte}
                        descricao={animal.descricao}
                        status={animal.status}
                        foto={`data:image/jpeg;base64,${animal.foto}`}
                    />
                    ))
                ) : (
                    // se não houver solicitações, exibe mensagem e link para a home
                    <div className="py-8 px-0 flex flex-col gap-6 text-start text-text-light-gray font-medium text-2xl">
                        <div className="space-y-2 sm:space-y-0">
                            <p>Parece que você ainda não solicitou nenhuma adoção... </p>
                            <p>Que tal dar uma olhadinha nos nossos peludos esperando por um lar?</p>
                        </div>
                        <Link href={"/adotante/home"} className="w-fit px-6 py-2 rounded-3xl text-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition font-medium
                            bg-miau-purple text-background hover:bg-miau-green active:bg-miau-light-green">
                            Pesquisar pets</Link>
                    </div>
                )}

            </div>
        </div>
    );
}