"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import FormButton from "@/components/FormButton";
import { validaCPF } from "@/utils/validaCPF";
import { validaIdade } from "@/utils/validaIdade";
import { validaSenha } from "@/utils/validaSenha";
import { formatarData } from "@/utils/formatarData"

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import Swal from "sweetalert2";
import { useState } from "react";

// objeto do zod para validação de campos do formulário de cadastro de adotantes
const cadastroAdotanteSchema = z.object({ 
    nome: z.string().min(2, "Nome é obrigatório"), 
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido").refine((cpf) => 
        validaCPF(cpf), { message: "CPF inválido" }),
    email: z.email("E-mail inválido"), 
    telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"), 
    dataNasc: z.string().superRefine((val, ctx) => {
        if (val.length < 10) {
            ctx.addIssue({
            code: "custom",
            message: "Data inválida",
            });
            return;
        }
        const { valido, mensagem } = validaIdade(val, 16);
        if (!valido) {
        ctx.addIssue({
            code: "custom",
            message: mensagem ?? "Data inválida",
        });
        }
    }),
    senha: z.string().superRefine((val, ctx) => {
        const {valido, mensagem} = validaSenha(val, 8);
        if (!valido) {
            ctx.addIssue({
                code: "custom",
                message: mensagem ?? "Senha inválida",
            });
        }
    }), 
    confSenha: z.string().min(8, "As senhas devem coincidir"), 
    estado: z.string().min(2, "Estado obrigatório"), 
    cidade: z.string().min(2, "Cidade obrigatória"), }).refine((data) => 
        data.senha === data.confSenha, { 
            message: "As senhas não coincidem", 
            path: ["confSenha"], }); 

// utiliza os tipos definidos no schema do zod
type CadastroAdotanteForm = z.infer<typeof cadastroAdotanteSchema>;

export default function CadastroAdotante() {
    const [sending, setSending] = useState(false); // estado para verificar se função iniciada por botão está sendo realizada, permitindo o bloqueio do botão

    const router = useRouter(); // hook para enviar usuário para outra página

    // variáveis do react hook form
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
    } = useForm<CadastroAdotanteForm>({ 
        resolver: zodResolver(cadastroAdotanteSchema),
        mode: "all",
        shouldFocusError: false,
    });

    // função de envio de formulário
    const onSubmit = async (data: CadastroAdotanteForm) => { 
        try {
            setSending(true); // desabilita o botão de envio

            // formata o objeto json que será enviado para o backend
            const payload = {
                usuario: {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    cidade: data.cidade,
                    estado: data.estado,
                    telefone: data.telefone.replace(/\D/g, ''),
                },
                cpf: data.cpf.replace(/\D/g, ''),
                dataNascimento: formatarData(data.dataNasc),
            };

            // chama a API e armazena a resposta recebida
            const response = await fetch("http://localhost:8080/adotantes/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // remove do json e armazena em uma variável a resposta em caso de erro
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

            sessionStorage.setItem("justRegistered", "adotante"); // armazena na sessão o estado do usuário recém-cadastrado
            router.push("/confirmacao?role=adotante"); // envia o usuário para a tela de confirmação de cadastro, indicando que é um adotante
        } catch (error) {
            // envia um alerta para o usuário caso não haja conexão com o servidor
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Erro de conexão com o servidor!",
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setSending(false); // habilita novamente o botão
        }
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            {/* link para a página de tipo de cadastro */}
            <div className="w-full max-w-4xl lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/tipo-cadastro"} text="Voltar" color="white" back={true} />
            </div>
            
            {/* formulário de cadastro de adotante */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full max-w-4xl px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                    Informações básicas</h1>
                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados pessoais</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Nome completo *" maxLength={100} {...register("nome")}
                            error={errors.nome?.message} name="nome" type="text" placeholder="Digite seu nome e sobrenome" className="mb-2" />
                        <InputField label="CPF *" {...register("cpf")}
                            error={errors.cpf?.message} mask={"000.000.000-00"} name="cpf" inputMode="numeric" type="text" placeholder="Digite seu CPF" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="E-mail *" maxLength={200} {...register("email")} 
                            error={errors.email?.message} name="email" type="text" placeholder="Digite seu e-mail" className="mb-2" />
                        <InputField label="Celular / WhatsApp *" {...register("telefone")}
                            error={errors.telefone?.message} name="telefone" mask={"(00) 00000-0000"} type="text" inputMode="numeric" 
                            placeholder="(00) 00000-0000" className="mb-2" />
                        <InputField label="Data de nascimento *" {...register("dataNasc")}
                            error={errors.dataNasc?.message} mask={"00/00/0000"} name="dataNasc" type="text" placeholder="Digite sua data de nascimento" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Senha *" maxLength={70} {...register("senha")}
                            error={errors.senha?.message} name="senha" type="password" placeholder="Crie uma senha" className="mb-2" />
                        <InputField label="Confirmar senha *" {...register("confSenha")} 
                            error={errors.confSenha?.message} name="confSenha" type="password" placeholder="Digite a senha novamente" className="mb-2" />
                    </div>

                </div>

                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Endereço</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <SelectField defaultValue={""} {...register("estado")} 
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
                        <InputField label="Cidade *" maxLength={40} {...register("cidade")} 
                            error={errors.cidade?.message} name="cidade" type="text" placeholder="Digite a cidade" className="mb-2" />
                    </div>

                </div>

                {/* botão de envio */}
                <FormButton text={`${sending ? "Cadastrando..." : "Cadastrar-se"}`} color={`${sending ? "disabled" : "green"}`} type="submit" 
                    className="mt-2" disabled={sending} />

                {/* link para o login */}
                <div className="w-full text-center text-miau-orange hover:text-miau-green active:text-miau-light-green">
                    <Link href="/login">Já possui uma conta? Faça login!</Link>
                </div>
            </form>
        </div>
    );
}

