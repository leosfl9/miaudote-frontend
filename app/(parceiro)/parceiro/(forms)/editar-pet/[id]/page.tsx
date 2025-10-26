"use client";

import Link from "next/link";
import NextImage from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect, use } from "react";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import FormButton from "@/components/FormButton";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import { Pencil } from "lucide-react";
import Cropper from "react-easy-crop";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { X } from "lucide-react";

// função utilitária do cropper
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context error");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Erro ao cortar imagem");
        const file = new File([blob], "cropped.jpeg", { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    };
    image.onerror = (err) => reject(err);
  });
}

// objeto do zod para validar formulário de edição de pet
const petSchema = z.object({
    nome: z.string().min(2, "Nome é obrigatório"),
    especie: z.string().min(1, "Selecione a espécie"),
    idade: z.coerce.number().min(1, "Idade é obrigatória"),
    sexo: z.string().min(1, "Selecione o sexo"),
    porte: z.string().min(1, "Selecione o porte"),
    status: z.string().min(1, "Selecione o status"),
    obs: z.string().optional(),
    descricao: z.string().optional(),
    fotos: z
    .array(z.instanceof(File))
    .refine((files) => files && files.length > 0, {
      message: "Adicione pelo menos 1 foto",
    })
    .refine((files) => files.length <= 5, {
      message: "Máximo 5 fotos",
    }),
});

type PetForm = z.infer<typeof petSchema>;

export default function EditarPet({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // pega o id do animal na URL

    // armazena dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const router = useRouter(); // hook de roteamento

    const [deleting, setDeleting] = useState(false); // desabilita os botões de deletar imagem enquanto uma estiver sendo deletada

    // armazena imagens existentes
    const [fotos, setFotos] = useState<{ id: number; foto: string }[]>([]);

    // armazena imagens novas
    const [files, setFiles] = useState<File[]>([]);
    const [croppedFiles, setCroppedFiles] = useState<File[]>([]);

    // controles do crop 
    const [currentCropIndex, setCurrentCropIndex] = useState<number | null>(null);
    const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const [loading, setLoading] = useState(true); // loading da página
    const [sending, setSending] = useState(false); // estado de envio do formulário

    // variáveis do react hook form
    const { 
        register, 
        handleSubmit, 
        clearErrors,
        formState: { errors }, 
        setValue,
    } = useForm({ 
        resolver: zodResolver(petSchema),
        mode: "all",
        shouldFocusError: false,
    });

    useEffect(() => {
        // envia o usuário para o login se ele não estiver autenticado
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }

        // get de dados do pet
        const fetchAnimal = async () => {
            try {
                // recebe os dados da API
                const response = await fetch(`https://miaudote-8av5.onrender.com/fotos/animal/${id}`, {
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
                // armazena os dados da resposta num objeto
                const data = await response.json();
                const animal = data[0]?.animal;

                // apenas por precaução, se não houver animal, envia o usuário para a home
                if (!animal) {
                    Swal.fire({
                        position: "top",
                        icon: "error",
                        title: "Erro ao carregar animal!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    router.push("/parceiro/home");
                    return;
                }

                // insere os dados recebidos nos inputs do formulário
                setValue("nome", animal.nome ?? "");
                setValue("especie", animal.especie ?? "");
                setValue("idade", animal.idade ?? "");
                setValue("sexo", animal.sexo ?? "");
                setValue("status", animal.status ?? "");
                setValue("porte", animal.porte ?? "");
                setValue("obs", animal.obs ?? "");
                setValue("descricao", animal.descricao ?? "");

                // obtém e armazena as imagens cadastradas do pet
                const imagens = data.map((item: any) => ({
                    id: item.id,       
                    foto: item.foto,   
                }));

                setFotos(imagens); // armazena o array de fotos
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
                setLoading(false); // termina o carregamento da página
            }
        };
        
        fetchAnimal(); // chama a função
    }, [setValue]);

    // submit do formulário
    const onSubmit = async (data: PetForm) => {
        try {
            setSending(true); // desabilita o botão de envio

            // formata a resposta no formato esperado pelo backend
            const payload = {
                parceiroId: userId,
                especie: data.especie,
                nome: data.nome,
                sexo: data.sexo,
                porte: data.porte,
                status: data.status,
                idadeInicial: (data.idade).toString(),
                obs: data.obs || "",
                descricao: data.descricao || "",
            };

            // realiza a requisição de patch
            const response = await fetch(`https://miaudote-8av5.onrender.com/animais/${id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // se os dados forem enviados, parte para o envio das novas imagens
            if (response.ok && croppedFiles.length > 0) {
                const formData = new FormData(); // cria um formdata

                // insere as novas imagens no formdata
                croppedFiles.forEach((file) => {
                    formData.append("files", file);
                });

                // cadastra as novas imagens
                const uploadResponse = await fetch(`https://miaudote-8av5.onrender.com/fotos/cadastrar/12`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                });

                // se der erro, exibe na tela
                if (!uploadResponse.ok) {
                    let errorMsg = "Erro ao editar!";
                    try {
                        const text = await uploadResponse.text();
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
            }

            // se der erro no envio dos dados editados do pet, exibe na tela
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

            // caso nenhum erro seja acionado, exibe mensagem de sucesso 
            Swal.fire({
                position: "top",
                icon: "success",
                title: "Alterações salvas!",
                showConfirmButton: false,
                timer: 1500
            });

            router.push("/parceiro/home"); // envia o usuário para a home
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
            setSending(false); // habilita novamente o botão
        }
    };

    // finaliza o crop
    const onCropComplete = (_: any, croppedArea: any) => {
        setCroppedAreaPixels(croppedArea);
    };

    // confirmação de crop
    const handleConfirmCrop = async () => {
        if (currentCropIndex === null) return;
        setIsDisabled(true); // desabilita o botão de confirmar crop

        try {
            const imageFile = files[currentCropIndex];
            const src = URL.createObjectURL(imageFile);
            const croppedImage = await getCroppedImg(src, croppedAreaPixels);
            URL.revokeObjectURL(src);

            setCroppedFiles((prev) => [...prev, croppedImage]);

            if (currentImageSrc) {
            URL.revokeObjectURL(currentImageSrc);
            setCurrentImageSrc(null);
            }
            setCurrentCropIndex(null);
        } catch (err) {
            Swal.fire({ icon: "error", title: "Erro ao cortar imagem" });
        } finally {
            setIsDisabled(false); // habilita novamente o botão
        }
    };

    // lida a troca de imagens já cadastradas e imagens novas
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        const total = fotos.length + croppedFiles.length + selected.length;

        if (total > 5) {
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Máximo de 5 imagens!",
                showConfirmButton: false,
                timer: 1500,
            });
            e.currentTarget.value = "";
            return;
        }

        setFiles(prev => {
            const startIndex = prev.length;
            const newFiles = [...prev, ...selected];
            setCurrentCropIndex(startIndex);
            setCurrentImageSrc(URL.createObjectURL(selected[0]));
            return newFiles;
        });

        e.currentTarget.value = "";
    };

    // função para remover do banco de dados imagens que vieram do cadastro
    const handleRemoveExistingFoto = async (fotoId: number) => {
        // só remove se o animal tiver mais de uma foto cadastrada no banco de dados
        if (fotos.length === 1 && croppedFiles.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Não é possível remover!",
                text: "O pet precisa ter pelo menos uma foto previamente cadastrada.",
                confirmButtonColor: "#1B998B",
            });
            return;
        }

        // modal de confirmação
        const confirm = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa imagem será removida permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1B998B",
            cancelButtonColor: "#F35D5D",
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return; // caso o usuário cancele a ação, não faz nada

        try {
            setDeleting(true); // desabilita os x de excluir imagens

            // requisição para deletar a foto
            const response = await fetch(`https://miaudote-8av5.onrender.com/fotos/${fotoId}/animal/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            // se der erro, exibe
            if (!response.ok) {
                let errorMsg = "Erro ao excluir foto!";
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
            // exibe alerta de sucesso caso a imagem seja excluída
            Swal.fire({
                icon: "success",
                title: "Imagem excluída!",
                showConfirmButton: false,
                timer: 1000,
            });

            setFotos((prev) => prev.filter((foto) => foto.id !== fotoId)); // remove a foto excluída do array

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
            setDeleting(false); // habilita novamente os x de exclusão de fotos
        }
    };

    // remoção de novas imagens
    const handleRemoveNewImage = async (index: number) => {
        // modal de confirmação
        const confirm = await Swal.fire({
            title: "Tem certeza?",
            text: "Deseja mesmo remover a nova imagem?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1B998B",
            cancelButtonColor: "#F35D5D",
            confirmButtonText: "Sim, remover",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return; // não faz nada se o usuário cancelar a ação
        
        // remove dos estados a imagem armazenada neles
        setCroppedFiles(prev => prev.filter((_, i) => i !== index));
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // função para excluir o pet inteiro
    const handleDeletePet = async () => {
        // modal de confirmação
        const confirm = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa ação não poderá ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F35D5D",
            cancelButtonColor: "#1B998B",
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return; // caso o usuário cancele a ação, não faz nada

        try {
            setDeleting(true); // desabilita os botões de deletar

            // requisição para deletar o pet
            const response = await fetch(`https://miaudote-8av5.onrender.com/animais/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            // se der erro, exibe
            if (!response.ok) {
                let errorMsg = "Erro ao excluir o pet!";
                try {
                    const text = await response.text();
                    try {
                        const json = JSON.parse(text);
                        errorMsg = json.message || JSON.stringify(json);
                    } catch {
                        errorMsg = text;
                    }
                } catch {
                    // envia um alerta para o usuário caso não haja conexão com o servidor
                    Swal.fire({
                        icon: "error",
                        title: "Erro de conexão com o servidor!",
                        position: "top",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
                // exibe o erro recebido
                Swal.fire({
                    icon: "error",
                    title: errorMsg,
                    position: "top",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
            // exibe mensagem de sucesso
            Swal.fire({
                icon: "success",
                title: "Pet excluído com sucesso!",
                position: "top",
                showConfirmButton: false,
                timer: 1500,
            });

            router.push("/parceiro/home"); // redireciona o usuário para a home
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro de conexão com o servidor!",
                position: "top",
                showConfirmButton: false,
                timer: 1500,
            });
        } finally {
            setDeleting(false); // habilita os botões de deletar
        }
    };


    // conta quantas fotos estão setadas antes de chamar a função que envia o formulário
    const handleFormSubmit = () => {
        const totalFotos = fotos.length + croppedFiles.length;
        setValue("fotos", Array(totalFotos).fill(new File([], "dummy.jpg")), { shouldValidate: true });
        handleSubmit(onSubmit)();
    };

    // exibe a tela de carregamento enquanto os dados do pet são obtidos
    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            
            <div className="w-full max-w-[640px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/parceiro/home"} text="Voltar" color="white" back={true} />
            </div>
            
            <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit();}} className="bg-white flex flex-col gap-3 items-center w-full max-w-[640px] px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/parceiro/home"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <NextImage src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center mb-2">
                    Editar Pet</h1>

                <div className="flex flex-col w-full gap-2">
                    
                    <div className="flex flex-col">
                        {/* botão de enviar imagens */}
                        <label htmlFor="fotos" className={`flex flex-col gap-5 border-1 
                            ${errors.fotos ? "border-red-500 text-red-500" : "border-input-bd text-text-gray"}  items-center py-3 rounded-md cursor-pointer mb-2`}>
                            <Pencil className="w-6 h-6" />
                            <p className="text-sm ssm:text-base">Clique para adicionar fotos (5 máx.)</p>
                        </label>
                        {errors.fotos && (
                            <p className="text-red-500 text-sm">{errors.fotos.message}</p>
                        )}
                    </div>

                    {/* input escondido, chamado no clique do botão acima */}
                    <input id="fotos" type="file" hidden accept="image/*" onChange={handleFileChange} />

                    {/* prévias das fotos */}
                    {(fotos.length > 0 || croppedFiles.length > 0) && (
                        <div className="grid grid-cols-3 ssm:grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
                            {/* fotos antigas */}
                            {fotos.map((foto, idx) => (
                                <div key={`foto-${foto.id}`} className="relative group">
                                    <NextImage src={`data:image/jpeg;base64,${foto.foto}`} alt={`foto-${idx}`}
                                        width={100} height={100} className="object-cover rounded-md" />
                                    <button type="button" onClick={() => handleRemoveExistingFoto(foto.id)} disabled={deleting}
                                        className={`${(deleting || sending) ? "hidden" : "absolute"} top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center 
                                        justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer group`} >
                                        <X className="w-4 h-4 hover:text-[#F35D5D]" />
                                    </button>
                                </div>
                            ))}

                            {/* fotos novas */}
                            {croppedFiles.map((file, idx) => (
                                <div key={`new-${idx}`} className="relative group">
                                    <NextImage src={URL.createObjectURL(file)} alt={`new-${idx}`}
                                    width={100} height={100} className="object-cover rounded-md" />
                                    <button type="button" onClick={() => handleRemoveNewImage(idx)} disabled={deleting}
                                        className={`${deleting ? "hidden" : "absolute"} top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center 
                                        justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer group`} >
                                        <X className="w-4 h-4 hover:text-[#F35D5D]" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col ssm:flex-row gap-2 lg:gap-3">
                        <InputField label="Nome do pet *" maxLength={100} {...register("nome")} onFocus={() => clearErrors("nome")} 
                            error={errors.nome?.message} name="nome" type="text" placeholder="Digite o nome do pet" className="mb-2" />
                        <SelectField defaultValue={""} {...register("especie")} onFocus={() => clearErrors("especie")}  
                            error={errors.especie?.message} label="Espécie *" name="especie" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Cachorro">Cão</option>
                            <option value="Gato">Gato</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Idade do pet (em anos) *" {...register("idade")} onFocus={() => clearErrors("idade")}  
                            error={errors.idade?.message} mask={"000"} name="idade" type="text" placeholder="Digite a idade do pet" className="mb-2" />
                        <SelectField defaultValue={""} {...register("sexo")} onFocus={() => clearErrors("sexo")}
                            error={errors.sexo?.message} label="Sexo do pet *" name="sexo" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </SelectField>
                        <SelectField defaultValue={""} {...register("porte")} onFocus={() => clearErrors("porte")}
                            error={errors.porte?.message} label="Porte do pet *" name="porte" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Pequeno">Pequeno</option>
                            <option value="Médio">Médio</option>
                            <option value="Grande">Grande</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <SelectField defaultValue={""} {...register("status")} onFocus={() => clearErrors("status")}
                            error={errors.status?.message} label="Status do pet *" name="status" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione uma opção</option>
                            <option value="Disponível">Disponível</option>
                            <option value="Adotado">Adotado</option>
                            <option value="Indisponível">Indisponível</option>
                        </SelectField>
                        <InputField label="Observações importantes" {...register("obs")} onFocus={() => clearErrors("obs")}  
                            error={errors.obs?.message} name="obs" type="text" placeholder="Ex.: FIV/FELV positivo, castrado..." className="mb-2" />
                    </div>

                    <div>
                        <TextAreaField label="Descrição do pet" rows={5} {...register("descricao")} onFocus={() => clearErrors("descricao")}
                            error={errors.descricao?.message} name="descricao" placeholder="Descreva brevemente o comportamento do pet" className="mb-2" />
                    </div>

                </div>

                {/* botão de envio do formulário */}
                <FormButton text={`${sending ? "Salvando..." : "Salvar alterações"}`} color={`${sending || deleting ? "disabled" : "green"}`} type="submit" 
                    className="mt-2" disabled={sending || deleting} />

                {/* botão de exclusão do pet */}
                <div className="flex w-full justify-end">
                    <button type="button" onClick={handleDeletePet} disabled={sending || deleting} className={`w-fitrounded-md font-semibold 
                        text-[#F35D5D] hover:text-[#F35D5D]/80 transition cursor-pointer ${sending || deleting ? "text-text-gray" : ""}`}>
                        {deleting ? "Excluindo..." : "Excluir pet"}
                    </button>
                </div>
            </form>

            {/* modal de cropper */}
            {currentCropIndex !== null && currentImageSrc && (
                // escurece o fundo da tela
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="relative w-[90vw] h-[80vh] bg-white rounded-lg p-4 flex flex-col">
                        {/* área do cropper */}
                        <div className="relative flex-1">
                            <Cropper 
                                image={URL.createObjectURL(files[currentCropIndex])} 
                                crop={crop} 
                                zoom={zoom}
                                aspect={1} 
                                onCropChange={setCrop} 
                                onZoomChange={setZoom} 
                                onCropComplete={onCropComplete} 
                            />
                        </div>

                        {/* botões de envio ou cancelamento */}
                        <div className="flex justify-end gap-2 mt-4 z-10">
                            <button type="button" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold text-lg"
                                onClick={() => {
                                    if (currentImageSrc) {
                                    URL.revokeObjectURL(currentImageSrc);
                                    setCurrentImageSrc(null);
                                    }
                                    setCurrentCropIndex(null);
                                }} >
                                Cancelar
                            </button>

                            <button type="button" className={`px-4 py-2 font-semibold text-lg text-white rounded-md cursor-pointer
                            ${isDisabled ? "bg-miau-green/70" : "bg-miau-green hover:bg-miau-green/80"}`} onClick={handleConfirmCrop} disabled={isDisabled} >
                                {isDisabled ? "Enviando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}