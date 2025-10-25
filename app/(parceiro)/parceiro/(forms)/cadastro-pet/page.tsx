"use client";

import Link from "next/link";
import NextImage from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import TextAreaField from "@/components/TextAreaField";
import FormButton from "@/components/FormButton";

import { X } from "lucide-react";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import { Pencil } from "lucide-react";
import Cropper from "react-easy-crop";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// função utilitária para cortar imagem
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

// objeto do zod para validar formulário de cadastro de pet
const petSchema = z.object({
    nome: z.string().min(2, "Nome é obrigatório"),
    especie: z.string().min(1, "Selecione a espécie"),
    idade: z.string().min(1, "Idade é obrigatória"),
    sexo: z.string().min(1, "Selecione o sexo"),
    porte: z.string().min(1, "Selecione o porte"),
    obs: z.string().optional(),
    descricao: z.string().optional(),
    fotos: z
    .custom<File[]>()
    .refine((files) => files && files.length > 0, {
      message: "Adicione pelo menos 1 foto",
    })
    .refine((files) => files.length <= 5, {
      message: "Máximo 5 fotos",
    }),
});

type PetForm = z.infer<typeof petSchema>;

export default function CadastroPet() {
    // armazena dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    // se o usuário não estiver autenticado, o envia para o login
    useEffect (() => {
        if (!token || !userId) router.push("/login");
    }, [])

    const router = useRouter(); // hook de roteamento

    // variáveis do react hook form
    const { 
        register, 
        handleSubmit, 
        clearErrors,
        formState: { errors }, 
        setValue,
    } = useForm<PetForm>({ 
        resolver: zodResolver(petSchema),
        mode: "all",
        shouldFocusError: false,
        defaultValues: {
            fotos: [], 
        },
    });

    // estados de imagens
    const [files, setFiles] = useState<File[]>([]);
    const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
    const [currentCropIndex, setCurrentCropIndex] = useState<number | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);

    const [isDisabled, setIsDisabled] = useState(false); // estado para desabilitar o botão de confirmar corte de imagem

    // sempre que uma foto é cortada, é inserida no array de fotos, que faz parte do formulário
    useEffect(() => {
        setValue("fotos", croppedFiles, { shouldValidate: croppedFiles.length > 0 });
    }, [croppedFiles, setValue]);


    // crop completo
    const onCropComplete = (_: any, croppedArea: any) => {
        setCroppedAreaPixels(croppedArea);
    };

    // confirmação de crop de imagem
    const handleConfirmCrop = async () => {
        if (currentCropIndex === null) return;
        setIsDisabled(true); // desabilita o botão de confirmação

        try {
            const imageFile = files[currentCropIndex];
            const src = URL.createObjectURL(imageFile);
            const croppedImage = await getCroppedImg(src, croppedAreaPixels);
            // revoga a URL temporária criada
            URL.revokeObjectURL(src);

            setCroppedFiles((prev) => [...prev, croppedImage]);

            // limpa URL atual e fecha modal
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

    // seleção de arquivos
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);

        if (selected.length + files.length > 5) {
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Máximo de 5 imagens!",
                showConfirmButton: false,
                timer: 1500
            });
            e.currentTarget.value = "";
            return;
        }

        // atualiza files e abre o cropper para a primeira imagem nova
        setFiles(prev => {
            const startIndex = prev.length; // índice da primeira imagem nova
            const newFiles = [...prev, ...selected];

            // abre o cropper para a primeira imagem nova
            setCurrentCropIndex(startIndex);
            // cria URL para o cropper usar imediatamente (limpeza abaixo)
            setCurrentImageSrc(URL.createObjectURL(selected[0]));

            return newFiles;
        });

        // reset do input para permitir selecionar o mesmo arquivo em seguida
        e.currentTarget.value = "";
    };

    const [sending, setSending] = useState(false); // estado que desabilita botão de cadastro

    // submit do formulário
    const onSubmit = async (data: PetForm) => {     
        setSending(true); // desabilita botão de cadastro

        try {
            const formData = new FormData(); // cria um objeto do tipo multipart/form-data, que o backend espera receber

            // campos
            formData.append("parceiroId", userId ?? "");
            formData.append("especie", data.especie);
            formData.append("nome", data.nome);
            formData.append("sexo", data.sexo);
            formData.append("porte", data.porte);
            formData.append("status", "Disponível"); // valor default do cadastro
            formData.append("idadeInicial", data.idade);
            formData.append("obs", data.obs || "");
            formData.append("descricao", data.descricao || "");

            // adiciona os arquivos de imagem ao formdata
            data.fotos.forEach((foto) => {
                formData.append("fotos", foto);
            });

            // fetch da API com método POST
            const response = await fetch("http://localhost:8080/animais/cadastrar", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            // se a API retornar erro, exibe
            if (!response.ok) {
                let errorMsg = "Erro ao cadastrar!";
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
                title: "Animal cadastrado com sucesso!",
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

    // remoção de imagens clicando no x
    const handleRemoveImage = (index: number) => {
        setCroppedFiles((prev) => prev.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            
            <div className="w-full max-w-[640px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/parceiro/home"} text="Voltar" color="white" back={true} />
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full max-w-[640px] px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/parceiro/home"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <NextImage src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center mb-2">
                    Cadastrar novo Pet</h1>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col">
                        {/* botão de enviar imagens */}
                        <label htmlFor="fotos" className={`flex flex-col gap-5 border-1 
                            ${errors.fotos ? "border-red-500 text-red-500" : "border-input-bd text-text-gray"}  items-center py-3 rounded-md cursor-pointer mb-2`}>
                            <Pencil className="w-6 h-6" />
                            <p className="text-sm ssm:text-base">Clique para adicionar fotos (5 máx.) *</p>
                        </label>
                        {errors.fotos && (
                            <p className="text-red-500 text-sm">{errors.fotos.message}</p>
                        )}
                    </div>

                    {/* input escondido, chamado no clique do botão acima */}
                    <input id="fotos" type="file" hidden multiple accept="image/*" onChange={handleFileChange} />

                    {/* preview de imagens cortadas */}
                    {croppedFiles.length > 0 && (
                        <div className="place-items-center grid grid-cols-3 ssm:grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
                            {croppedFiles.map((file, idx) => (
                                <div key={idx} className="relative group">
                                    <NextImage src={URL.createObjectURL(file)} alt={`foto-${idx}`}
                                    width={100} height={100} className="object-cover rounded-md" />
                                    {sending ? "" : (
                                        <button type="button" onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center
                                        opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer group"><X className="w-4 h-4 hover:text-[#F35D5D]"/></button>
                                    )}
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

                    <div className="flex flex-col gap-2 lg:gap-3">
                        <InputField label="Observações importantes" {...register("obs")} onFocus={() => clearErrors("obs")}  
                            error={errors.obs?.message} name="obs" type="text" placeholder="Ex.: FIV/FELV positivo, castrado..." className="mb-2" />
                        <TextAreaField label="Descrição do pet" rows={5} {...register("descricao")} onFocus={() => clearErrors("descricao")}
                            error={errors.descricao?.message} name="descricao" placeholder="Descreva brevemente o comportamento do pet" className="mb-2" />
                    </div>

                </div>

                {/* botão de envio do formulário */}
                <FormButton text={`${sending ? "Cadastrando..." : "Cadastrar Pet"}`} color={`${sending ? "disabled" : "green"}`} 
                    type="submit" className="mt-2 mb-2" disabled={sending} />
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

                        <button type="button" className={`px-4 py-2 font-semibold text-lg text-white
                            ${isDisabled ? "bg-miau-green/70" : "bg-miau-green hover:bg-miau-green/80 active:bg-miau-green/80"} rounded-md cursor-pointer`} 
                            onClick={handleConfirmCrop} disabled={isDisabled} >
                            {isDisabled ? "Enviando..." : "Confirmar"}
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}
