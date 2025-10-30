"use client"

import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// tipagem dos dados do animal
interface Animal {
  id: number;
  nome: string;
  idade: number;
  especie: string;
  descricao: string;
  obs: string;
  porte: string;
  sexo: string;
  status: string;
  foto: string;
  parceiro: string;
  estado: string;
  favorito: boolean;
  favoritoId: number | null,
}

export default function homeAdotante(){
    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const [animais, setAnimais] = useState<Animal[]>([]); // armazena dados do animal
    const [loading, setLoading] = useState(true); // estado de loading da página

    // gerenciamento de paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // carrega os animais se o usuário estiver autenticado
    useEffect(() => {
        if (token && userId) carregarAnimais();
    }, []);

    async function carregarAnimais() {
        try {
            setLoading(true); // inicia o loading da página

            // faz uma requisição do tipo GET para a API
            const response = await fetch(`https://miaudote-8av5.onrender.com/fotos/adotante/${userId}/pagina/${paginaAtual}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            
            // se der errado, exibe um alerta
            if (!response.ok) {
                let errorMsg = "Erro ao obter favoritos!";
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

            // armazena o total de páginas, retornado pela API
            if (data.length > 0) {
                setTotalPaginas(data[0].totalPaginas);
            }
                
            // armazena o array de objetos
            const listaAnimais: Animal[] = data.map((item: any) => ({
                id: item.animal.id,
                nome: item.animal.nome,
                idade: item.animal.idade,
                especie: item.animal.especie,
                descricao: item.animal.descricao,
                obs: item.animal.obs,
                porte: item.animal.porte,
                sexo: item.animal.sexo,
                status: item.animal.status,
                foto: item.foto,
                parceiro: item.animal.parceiro.nome,
                estado: item.animal.parceiro.estado,
                favorito: item.favorito,
                favoritoId: item.favoritoId,
            }));
    
            setAnimais(listaAnimais); // armazena a lista de animais
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
            setLoading(false); // termina o loading da página
        }
    }

    const [favoritandoId, setFavoritandoId] = useState<number | null>(null); // armazena id do animal favoritado
    
    async function handleFavorito(idPet: number, favorito: boolean, favoritoId: number | null) {
        let isMounted = true; 
        setFavoritandoId(idPet); // seta o id do animal a ser desfavoritado

        try {
            // atualização otimista, assume que a API retornou sucesso
            if (isMounted) {
                setAnimais((prev) =>
                    prev.map((animal) =>
                        animal.id === idPet
                            ? { ...animal, favorito: !favorito }
                            : animal
                    )
                );
            }

            // controlador para abortar se o usuário recarregar ou sair da página
            const controller = new AbortController();
            window.addEventListener("beforeunload", () => controller.abort());

            // só pode remover se existir favoritoId
            if (favorito && favoritoId !== null) {
                // realiza a requisição de DELETE do favorito
                const response = await fetch(`https://miaudote-8av5.onrender.com/favoritos/${favoritoId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                // se der erro, exibe um alerta
                if (!response.ok) {
                    let errorMsg = "Erro ao remover favorito!";
                    try {
                        const text = await response.text();
                        try {
                            const json = JSON.parse(text);
                            errorMsg = json.message || JSON.stringify(json);
                        } catch {
                            errorMsg = text;
                        }
                    } catch {
                        // exibe erro de conexão com o servidor
                        Swal.fire({
                            position: "top",
                            icon: "error",
                            title: "Erro de conexão com o servidor!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }

                    // reverte o estado otimista
                    if (isMounted) {
                        setAnimais((prev) =>
                            prev.map((animal) =>
                                animal.id === idPet
                                    ? { ...animal, favorito, favoritoId }
                                    : animal
                            )
                        );
                    }
                    // exibe mensagem de erro do backend
                    Swal.fire({
                        position: "top",
                        icon: "error",
                        title: errorMsg,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    return;
                }

                // atualiza estado final se não houver erro
                if (isMounted) {
                    setAnimais((prev) =>
                        prev.map((animal) =>
                            animal.id === idPet
                                ? { ...animal, favorito: false, favoritoId: null }
                                : animal
                        )
                    );
                }
            }
        } catch (error: any) {
            if (error.name === "AbortError") {
                return; // apenas ignora
            }

            // erro genérico
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Não foi possível atualizar os favoritos.",
                showConfirmButton: false,
                timer: 1000,
            });

            // reverte o estado em erro inesperado
            if (isMounted) {
                setAnimais((prev) =>
                    prev.map((animal) =>
                        animal.id === idPet
                            ? { ...animal, favorito, favoritoId }
                            : animal
                    )
                );
            }
        } finally {
            if (isMounted) setFavoritandoId(null); // remove o id do favorito
            isMounted = false;
            await carregarAnimais(); // recarrega os animais
        }
    }

    // tela de carregamento
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
                <h1 className="font-bold text-3xl 2xl:text-4xl">Meus favoritos</h1>
                <h2 className="text-base 2xl:text-lg">Visualize  seus favoritos, toda beleza do mundo em um só lugar!</h2>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start justify-center">
                {/* se houverem animais, exibe-os */}
                {animais.length > 0 ? (
                    animais.map((animal) => (
                    <AnimalCard
                        key={animal.id}
                        idPet={animal.id}
                        tipo="adotante"
                        nome={animal.nome}
                        parceiro={animal.parceiro}
                        especie={animal.especie}
                        idade={animal.idade.toString()}
                        porte={animal.porte}
                        sexo={animal.sexo}
                        estado={animal.estado}
                        descricao={animal.descricao}
                        status={animal.status}
                        foto={`data:image/jpeg;base64,${animal.foto}`}
                        favoritoId={animal.favoritoId}
                        onToggleFavorito={handleFavorito}
                        disabled={favoritandoId === animal.id}
                        favorito />
                    ))
                ) : (
                    // se não houverem animais, exibe uma mensagem e link para a home
                    <div className="py-8 px-0 flex flex-col gap-6 text-start text-text-light-gray font-medium text-2xl">
                        <div className="space-y-2 sm:space-y-0">
                            <p>Parece que você ainda não tem nenhum pet favorito...</p>
                            <p>Que tal encontrar um novo melhor amigo?</p>
                        </div>
                        <Link href={"/adotante/home"} className="w-fit px-6 py-2 rounded-3xl text-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition font-medium
                            bg-miau-purple text-background hover:bg-miau-green active:bg-miau-light-green">
                            Pesquisar pets</Link>
                    </div>
                )}
            </div>

            {/* exibe os botões de paginação apenas se existirem animais */}
            {animais.length > 0 && (
                <div className="flex flex-row gap-3 text-background w-full items-center justify-center text-center mt-2">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                        <button key={num} onClick={() => setPaginaAtual(num)}
                            className={`w-8 h-8 font-semibold rounded-lg text-center cursor-pointer
                            ${paginaAtual === num ? "bg-miau-orange text-white" 
                            : "bg-miau-purple hover:bg-miau-purple/80 active:bg-miau-purple/80 text-background"}`}>
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}