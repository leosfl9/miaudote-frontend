"use client"

import AnimalCard from "@/components/AnimalCard";
import SelectField from "@/components/SelectField";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
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
  favoritoId: number | null;
}

export default function HomeAdotante(){
    // dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    // lista de animais
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [animaisFiltrados, setAnimaisFiltrados] = useState<Animal[]>([]);

    const [loading, setLoading] = useState(true); // estado de loading da página

    // gerenciamento de paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // estado dos filtros
    const [filtroEspecie, setFiltroEspecie] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroSexo, setFiltroSexo] = useState("");

    // limpa filtros
    function limparFiltros() {
        setFiltroEspecie("");
        setFiltroEstado("");
        setFiltroSexo("");
        setAnimaisFiltrados(animais);
    }

    // inicializa e executa os filtros
    useEffect(() => {
        let filtrados = animais;

        if (filtroEspecie) {
            filtrados = filtrados.filter((a) =>
                a.especie.toLowerCase() === filtroEspecie.toLowerCase()
            );
        }

        if (filtroEstado) {
            filtrados = filtrados.filter((a) =>
                a.estado.toLowerCase() === filtroEstado.toLowerCase()
            );
        }

        if (filtroSexo) {
            filtrados = filtrados.filter((a) =>
                a.sexo.toLowerCase() === filtroSexo.toLowerCase()
            );
        }

        setAnimaisFiltrados(filtrados);
    }, [animais, filtroEspecie, filtroEstado, filtroSexo]);

    // se o usuário estiver autenticado, carrega os animais
    useEffect(() => {
        if (token && userId) carregarAnimais();
    }, [paginaAtual]);
    

    async function carregarAnimais() {
      try {
        setLoading(true); // inicia o loading da página

        // obtém os dados dos animais
        const response = await fetch(`https://miaudote-8av5.onrender.com/fotos/pagina/${paginaAtual}/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        // exibe alerta de erro se der errado
        if (!response.ok) {
            let errorMsg = "Erro ao obter animais!";
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

        const data = await response.json(); // armazena os dados dos animais

        // seta o total de páginas
        if (data.length > 0) {
            setTotalPaginas(data[0].totalPaginas);
        }
            
        // armazena os dados dos animais em array
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

        setAnimais(listaAnimais); // seta a lista de animais

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

    const [favoritandoId, setFavoritandoId] = useState<number | null>(null); // armazena o id do animal sendo favoritado

    async function handleFavorito(idPet: number, favorito: boolean, favoritoId: number | null) {
        let isMounted = true;
        setFavoritandoId(idPet); // armazena o id do pet sendo favoritado

        try {
            // atualização otimista
            if (isMounted) {
                setAnimais((prev) =>
                    prev.map((animal) =>
                    animal.id === idPet
                        ? { ...animal, favorito: !favorito }
                        : animal
                    )
                );
            }

            const controller = new AbortController(); // cria um AbortController para poder cancelar o fetch se desmontar
            window.addEventListener("beforeunload", () => controller.abort()); // cancela o fetch se a página for recarregada ou o componente desmontar

            // deleta dos favoritos se o pet já estiver favoritado
            if (favorito && favoritoId !== null) {
                const response = await fetch(`https://miaudote-8av5.onrender.com/favoritos/${favoritoId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                // exibe erro se der errado
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
            } else {
                // se o animal não estava favoritado, torna-o favorito
                const response = await fetch("https://miaudote-8av5.onrender.com/favoritos/cadastrar", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        adotanteId: userId,
                        animalId: idPet,
                    }),
                    signal: controller.signal,
                });

                // se der erro, exibe alerta
                if (!response.ok) {
                    let errorMsg = "Erro ao adicionar favorito!";
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
        
                    if (isMounted) {
                        setAnimais((prev) =>
                            prev.map((animal) =>
                                animal.id === idPet
                                    ? { ...animal, favorito, favoritoId }
                                    : animal
                            )
                        );
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

                const novoFav = await response.json(); // obtém o id do novo favorito

                if (isMounted) {
                    setAnimais((prev) =>
                    prev.map((animal) =>
                        animal.id === idPet
                        ? { ...animal, favorito: true, favoritoId: novoFav.id }
                        : animal
                    )
                    );
                }
            }
        } catch (error: any) {
            if (error.name === "AbortError") {
                return; // apenas ignora
            }

            Swal.fire({
                position: "top",
                icon: "error",
                title: "Não foi possível atualizar os favoritos.",
                showConfirmButton: false,
                timer: 1000,
            });

            if (isMounted) {
                // reverte o estado apenas se ainda estiver montado
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
        }
    }

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
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 w-full">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl text-center">Pets disponíveis para adoção</h1>
            </div>

            {/* filtros */}
            <div className="flex flex-col plg:flex-row justify-between items-center plg:gap-2 lg:gap-4 mb-4">
                <div className="flex flex-col xsm:flex-row gap-1 xsm:gap-2 lg:gap-4 w-full">

                    <SelectField name="filtroEspecie" label="Espécie" className="appearance-none mb-2"
                        value={filtroEspecie} onChange={(e) => setFiltroEspecie(e.target.value)} >
                        <option value={""} disabled>Pesquise por espécie</option>
                        <option value="Cachorro">Cão</option>
                        <option value="Gato">Gato</option>
                    </SelectField>

                    <SelectField name="filtroEstado" label="Estado" className="appearance-none mb-2"
                        value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} >
                        <option value={""} disabled>Pesquise por estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </SelectField>

                    <SelectField name="filtroSexo" label="Sexo" className="appearance-none mb-2"
                        value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)} >
                        <option value={""} disabled>Pesquise por sexo</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </SelectField>
                </div>

                {/* botão que limpa filtros */}
                <button onClick={limparFiltros} className={`w-full plg:w-[220px] mt-4 text-lg xl:text-xl px-8 py-2 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] h-fit bg-miau-purple hover:bg-miau-light-green active:bg-miau-light-green`}>
                    Limpar filtros
                </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">
                {/* listagem de animais */}
                {animaisFiltrados.length > 0 ? (
                    animaisFiltrados.map((animal) => (
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
                        favorito={animal.favorito}
                        favoritoId={animal.favoritoId}
                        onToggleFavorito={handleFavorito}
                        disabled={favoritandoId === animal.id}
                    />
                    ))
                ) : (
                    // exibe mensagem se nenhum animal foi encontrado
                    <div className="py-8 px-0 flex flex-col gap-6 w-full text-center text-text-light-gray font-medium text-2xl">
                        <div className="space-y-2 sm:space-y-0">
                            <p>Nenhum animal encontrado!</p>
                            <p>Onde será que eles estão?</p>
                        </div>
                    </div>
                )}
            </div>

            {/* exibe botões de paginação se houver pelo menos um animal */}
            {animaisFiltrados.length > 0 && (
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