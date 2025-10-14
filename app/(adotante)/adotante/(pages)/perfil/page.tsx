"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import FormButton from "@/components/FormButton";
import { validaSenha } from "@/utils/validaSenha";
import mascaraTelefone from "@/utils/mascaraTelefone";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import Swal from "sweetalert2";

const adotanteSchema = z.object({ 
    nome: z.string().min(2, "Nome é obrigatório"), 
    email: z.email("E-mail inválido"), 
    telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"), 
    senha: z.string().max(70, "Máx. 70 caracteres"), 
    confSenha: z.string().max(70, "Máx. 70 caracteres"),  
    estado: z.string().min(2, "Estado obrigatório"), 
    cidade: z.string().min(2, "Cidade obrigatória"), }).superRefine((data, ctx) => {
        const senhaPreenchida = data.senha.trim() !== "";
        const confPreenchida = data.confSenha.trim() !== "";

        if ((senhaPreenchida && !confPreenchida) || (!senhaPreenchida && confPreenchida)) {
            ctx.addIssue({
                code: "custom",
                path: ["confSenha"],
                message: "Ambos os campos de senha devem ser preenchidos",
            });
            return;
        }

        if (senhaPreenchida && confPreenchida) {
            if (data.senha !== data.confSenha) {
                ctx.addIssue({
                    code: "custom",
                    path: ["confSenha"],
                    message: "As senhas não coincidem",
                });
                return;
            }

            const {valido, mensagem} = validaSenha(data.senha, 8);

            if (!valido) {
                ctx.addIssue({
                    code: "custom",
                    path: ["senha"],
                    message: mensagem ?? "Senha inválida",
                });
                return;
            }
        }
    });
            
type AdotanteForm = z.infer<typeof adotanteSchema>;

export default function PerfilAdotante() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    const { 
        register, 
        handleSubmit, 
        setValue,
        clearErrors,
        formState: { errors }, 
    } = useForm<AdotanteForm>({ 
        resolver: zodResolver(adotanteSchema),
        mode: "all",
        shouldFocusError: false,
    });

    const onSubmit = async (data: AdotanteForm) => { 
        try {
            setSending(true);

            const payload = {
                usuario: {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    telefone: data.telefone.replace(/\D/g, ''),
                    estado: data.estado,
                    cidade: data.cidade
                }
            };

            if (data.senha.trim() !== "") {
                payload.usuario.senha = data.senha;
            }

            console.log("Enviando dados:", payload);

            const response = await fetch("http://localhost:8080/adotantes/39", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            Swal.fire({
                position: "top",
                icon: "success",
                title: "Alterações salvas!",
                showConfirmButton: false,
                timer: 1500
            });

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

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const res = await fetch("http://localhost:8080/adotantes/39");
                if (!res.ok) throw new Error("Erro ao buscar usuário");

                const usuario = await res.json();

                setValue("nome", usuario.nome ?? "");
                setValue("email", usuario.email ?? "");
                setValue("telefone", mascaraTelefone(usuario.telefone ?? ""));
                setValue("estado", usuario.estado ?? "");
                setValue("cidade", usuario.cidade ?? "");

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // <-- termina o carregamento
            }
        };

        fetchUsuario();
    }, [setValue]);

    if (loading) {
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-4 items-center justify-center bg-miau-purple">
                <div className="w-10 h-10 border-4 border-background border-t-transparent rounded-full animate-spin"></div>
                <p className="text-background font-medium text-xl">Carregando...</p>
                {/* opcional: pode trocar por um spinner bonito */}
            </div>
        );
    }
    
    return (
        
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Meus perfil</h1>
                <h2 className="text-base 2xl:text-lg">Configurações do perfil pessoal</h2>
            </div>

            <div className="w-full items-center justify-center flex">

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full px-3 ssm:px-8 sm:px-12 xl:px-24 pt-6 pb-10 rounded-4xl">
                    <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                        Informações básicas</h1>
                    <div className="flex flex-col gap-1 self-start w-full">
                        <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados pessoais</h2>
                        <hr className="border-hr" />
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                            <InputField label="Nome completo *" maxLength={100} {...register("nome")} onFocus={() => clearErrors("nome")} 
                                error={errors.nome?.message} name="nome" type="text" placeholder="Digite seu nome e sobrenome" className="mb-2" />
                            <InputField label="Celular / WhatsApp *" {...register("telefone")} onFocus={() => clearErrors("telefone")} 
                                error={errors.telefone?.message} name="telefone" mask={"(00) 00000-0000"} type="text" inputMode="numeric" 
                                placeholder="(00) 00000-0000" className="mb-2" />
                            <div className="sm:col-span-2 lg:col-span-1">
                                <InputField label="E-mail *" maxLength={200} {...register("email")} onFocus={() => clearErrors("email")} 
                                    error={errors.email?.message} name="email" type="text" placeholder="Digite seu e-mail" className="mb-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                            <InputField label="Nova senha" maxLength={70} {...register("senha")} onFocus={() => clearErrors("senha")} 
                                error={errors.senha?.message} name="senha" type="password" placeholder="Sua nova senha" className="mb-2" />
                            <InputField label="Confirmar nova senha" maxLength={70} {...register("confSenha")} onFocus={() => clearErrors("confSenha")} 
                                error={errors.confSenha?.message} name="confSenha" type="password" placeholder="Repita a nova senha" className="mb-2" />
                        </div>

                    </div>

                    <div className="flex flex-col gap-1 self-start w-full">
                        <h2 className="text-miau-green text-sm lg:text-base font-medium">Endereço</h2>
                        <hr className="border-hr" />
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                            <SelectField defaultValue={""} {...register("estado")} onFocus={() => clearErrors("estado")} 
                                error={errors.estado?.message} label="Estado *" name="estado" className="appearance-none mb-2">
                                <option value={""} disabled>Selecione o estado</option>
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
                            <InputField label="Cidade *" maxLength={40} {...register("cidade")} onFocus={() => clearErrors("cidade")} 
                                error={errors.cidade?.message} name="cidade" type="text" placeholder="Digite a cidade" className="mb-2" />
                        </div>
                    </div>

                    <FormButton text={`${sending ? "Salvando..." : "Salvar alterações"}`} color={`${sending ? "disabled" : "green"}`} type="submit" className="mt-2" disabled={sending} />

                </form>
            </div>
        </div>
    );
}