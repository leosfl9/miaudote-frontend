"use client";

import Link from "next/link";
import NextImage from "next/image";
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


const petSchema = z.object({
    nome: z.string().min(2, "Nome é obrigatório"),
    especie: z.string().min(1, "Selecione a espécie"),
    idade: z.number().min(1, "Idade é obrigatória"),
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
    const { id } = use(params);

    const router = useRouter();

    const [deleting, setDeleting] = useState(false);

    // imagens existentes
    const [fotos, setFotos] = useState<{ id: number; foto: string }[]>([]);

    // imagens novas
    const [files, setFiles] = useState<File[]>([]);
    const [croppedFiles, setCroppedFiles] = useState<File[]>([]);

    // controles do crop 
    const [currentCropIndex, setCurrentCropIndex] = useState<number | null>(null);
    const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

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
    });

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const res = await fetch(`http://localhost:8080/fotos/animal/${id}`);
                if (!res.ok) throw new Error("Erro ao buscar animal");

                const data = await res.json();
                console.log(data);

                const animal = data[0]?.animal;

                if (!animal) throw new Error("Animal não encontrado");

                setValue("nome", animal.nome ?? "");
                setValue("especie", animal.especie ?? "");
                setValue("idade", animal.idade ?? "");
                setValue("sexo", animal.sexo ?? "");
                setValue("status", animal.status ?? "");
                setValue("porte", animal.porte ?? "");
                setValue("obs", animal.obs ?? "");
                setValue("descricao", animal.descricao ?? "");

                const imagens = data.map((item: any) => ({
                    id: item.id,       
                    foto: item.foto,   
                }));

                setFotos(imagens);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimal();
    }, [setValue]);

    const onCropComplete = (_: any, croppedArea: any) => {
        setCroppedAreaPixels(croppedArea);
    };

    const handleConfirmCrop = async () => {
        if (currentCropIndex === null) return;
        setIsDisabled(true);

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
            console.error(err);
            Swal.fire({ icon: "error", title: "Erro ao cortar imagem" });
        } finally {
            setIsDisabled(false);
        }
    };

    const onSubmit = async (data: PetForm) => {
        try {
            setSending(true);

            const payload = {
                parceiroId: 37,
                especie: data.especie,
                nome: data.nome,
                sexo: data.sexo,
                porte: data.porte,
                status: data.status,
                idadeInicial: (data.idade).toString(),
                obs: data.obs || "",
                descricao: data.descricao || "",
            };

            const response = await fetch(`http://localhost:8080/animais/${id}/parceiro/37`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (croppedFiles.length > 0) {
                const formData = new FormData();

                croppedFiles.forEach((file) => {
                    formData.append("files", file);
                });

                const uploadResponse = await fetch(`http://localhost:8080/fotos/cadastrar/${id}`, {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Erro ao enviar imagens");
                }
            }


            Swal.fire({
                position: "top",
                icon: "success",
                title: "Alterações salvas!",
                showConfirmButton: false,
                timer: 1500
            });

            router.push("/parceiro/home");

            if (!response.ok) {
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Erro ao editar!",
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

        } catch (error) {
            console.error("Erro ao editar:", error);
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Erro ao editar!",
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setSending(false);
        }
    };

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

    const handleRemoveExistingFoto = async (fotoId: number) => {
        if (fotos.length === 1 && croppedFiles.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Não é possível remover!",
                text: "O pet precisa ter pelo menos uma foto previamente cadastrada.",
                confirmButtonColor: "#1B998B",
            });
            return;
        }

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

        if (!confirm.isConfirmed) return;

        try {
            setDeleting(true);

            const response = await fetch(`http://localhost:8080/fotos/${fotoId}/animal/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir imagem");
            }

            Swal.fire({
                icon: "success",
                title: "Imagem excluída!",
                showConfirmButton: false,
                timer: 1200,
            });

            setFotos((prev) => prev.filter((foto) => foto.id !== fotoId));

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Erro ao excluir imagem!",
                timer: 1200,
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleRemoveNewImage = async (index: number) => {
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

        if (!confirm.isConfirmed) return;
        
        setCroppedFiles(prev => prev.filter((_, i) => i !== index));
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = () => {
        const totalFotos = fotos.length + croppedFiles.length;
        setValue("fotos", Array(totalFotos).fill(new File([], "dummy.jpg")), { shouldValidate: true });
        handleSubmit(onSubmit)();
    };

    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
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
                        <label htmlFor="fotos" className={`flex flex-col gap-5 border-1 
                            ${errors.fotos ? "border-red-500 text-red-500" : "border-input-bd text-text-gray"}  items-center py-3 rounded-md cursor-pointer mb-2`}>
                            <Pencil className="w-6 h-6" />
                            <p className="text-sm ssm:text-base">Clique para adicionar fotos (5 máx.)</p>
                        </label>
                        {errors.fotos && (
                            <p className="text-red-500 text-sm">{errors.fotos.message}</p>
                        )}
                    </div>

                    <input id="fotos" type="file" hidden multiple accept="image/*" onChange={handleFileChange} />

                    {(fotos.length > 0 || croppedFiles.length > 0) && (
                        <div className="grid grid-cols-3 ssm:grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
                            {fotos.map((foto, idx) => (
                                <div key={`foto-${foto.id}`} className="relative group">
                                    <NextImage src={`data:image/jpeg;base64,${foto.foto}`} alt={`foto-${idx}`}
                                        width={100} height={100} className="object-cover rounded-md" />
                                    <button type="button" onClick={() => handleRemoveExistingFoto(foto.id)} disabled={deleting}
                                        className={`${deleting ? "hidden" : "absolute"} top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center 
                                        justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer group`} >
                                        <X className="w-4 h-4 hover:text-[#F35D5D]" />
                                    </button>
                                </div>
                            ))}

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

                <FormButton text={`${sending ? "Salvando..." : "Salvar alterações"}`} color={`${sending ? "disabled" : "green"}`} type="submit" 
                    className="mt-2 mb-2" disabled={sending} />
            </form>

            {currentCropIndex !== null && currentImageSrc && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="relative w-[90vw] h-[80vh] bg-white rounded-lg p-4 flex flex-col">
                        <div className="relative flex-1">
                            <Cropper image={URL.createObjectURL(files[currentCropIndex])} crop={crop} zoom={zoom}
                                aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                        </div>

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