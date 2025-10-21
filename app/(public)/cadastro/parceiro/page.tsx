"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import FormButton from "@/components/FormButton";
import { validaCPF } from "@/utils/validaCPF";
import { validaCNPJ } from "@/utils/validaCNPJ";
import { validaSenha } from "@/utils/validaSenha";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import Swal from "sweetalert2";

// objeto do zod para validação de campos do formulário de cadastro de parceiros
const cadastroSchema = z.object({ 
    nome: z.string().min(2, "Nome é obrigatório"), 
    tipo: z.string().min(1, "Selecione o tipo"),
    email: z.email("E-mail inválido"), 
    documento: z.string().superRefine((val, ctx) => {
        const limpo = val.replace(/\D/g, "");

        const valido = 
            (limpo.length === 11 && validaCPF(val)) ||
            (limpo.length === 14 && validaCNPJ(val));

        if (!valido) {
            ctx.addIssue({
            code: "custom",
            message: "Número de documento inválido",
            });
        }
    }),
    telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"), 
    senha: z.string().superRefine((val, ctx) => {
        const {valido, mensagem} = validaSenha(val, 8);
        if (!valido) {
            ctx.addIssue({
                code: "custom",
                message: mensagem ?? "Senha inválida",
            });
        }
    }), 
    site: z.string().optional(),
    estado: z.string().min(2, "Estado obrigatório"), 
    cidade: z.string().min(2, "Cidade obrigatória"), });

// utiliza os tipos definidos no schema do zod
type CadastroForm = z.infer<typeof cadastroSchema>;

export default function CadastroParceiro() {
    // estado para verificar se função iniciada por botão está sendo realizada, permitindo o bloqueio do botão
    const [sending, setSending] = useState(false);

    // hook para enviar usuário para outra página
    const router = useRouter();

    // variáveis do react hook form
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
    } = useForm<CadastroForm>({ 
        resolver: zodResolver(cadastroSchema),
        mode: "all" 
    });

    // função de envio de formulário
    const onSubmit = async (data: CadastroForm) => {
        try {
            // desabilita o botão de envio
            setSending(true);

            // formata o objeto json que será enviado para o backend
            const payload = {
                documento: data.documento.replace(/\D/g, ''),
                tipo: data.tipo,
                site: data.site,
                usuario: {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    estado: data.estado,
                    cidade: data.cidade,
                    telefone: data.telefone.replace(/\D/g, ''),
                },
            };

            // chama a API e armazena a resposta recebida
            const response = await fetch("http://localhost:8080/parceiros/cadastrar", {
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

            // armazena na sessão o estado do usuário recém-cadastrado
            sessionStorage.setItem("justRegistered", "parceiro");
            // envia o usuário para a tela de confirmação de cadastro, indicando que é um parceiro
            router.push("/confirmacao?role=parceiro");

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
            // habilita novamente o botão
            setSending(false);
        }
    };


    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">

            {/* link para a página de tipo de cadastro */}
            <div className="w-full max-w-4xl lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/tipo-cadastro"} text="Voltar" color="white" back={true} />
            </div>
            
            {/* formulário de cadastro de parceiro */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full max-w-4xl px-3 md:px-6 lg:px-12 py-6 rounded-4xl">
                <Link href={"/"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                    Informações básicas</h1>
                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados da ONG/protetor</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Nome da ONG/protetor *" maxLength={100} {...register("nome")} 
                            error={errors.nome?.message} name="nome" type="text" placeholder="Digite o nome" className="mb-2" />
                        <SelectField defaultValue={""} {...register("tipo")}
                            error={errors.tipo?.message} label="Tipo *" name="tipo" className="appearance-none mb-2">
                            <option value={""} disabled>Selecione o tipo</option>
                            <option value="ONG">ONG</option>
                            <option value="Protetor">Protetor</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="CNPJ ou CPF *" {...register("documento")}
                            error={errors.documento?.message} mask={[{mask: "000.000.000-00", overwrite: true}, {mask: "00.000.000/0000-00", overwrite: true}]} 
                            name="documento" type="text" placeholder="Digite o CNPJ ou CPF" className="mb-2" />
                        <InputField label="E-mail *" maxLength={200} {...register("email")} 
                            error={errors.email?.message} name="email" type="text" placeholder="Digite o e-mail" className="mb-2" />
                        <InputField label="Telefone *" {...register("telefone")} error={errors.telefone?.message} 
                            mask={"(00) 00000-0000"} name="telefone" type="text" placeholder="Digite o telefone" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Senha *" maxLength={70} {...register("senha")} 
                            error={errors.senha?.message} name="senha" type="password" placeholder="Crie uma senha" className="mb-2" />
                        <InputField label="Site ou rede social" maxLength={255} {...register("site")} 
                            error={errors.site?.message} name="site" type="text" placeholder="Link do site ou rede social" className="mb-2" />
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
                <FormButton text={`${sending ? "Cadastrando..." : "Confirmar cadastro"}`} color={`${sending ? "disabled" : "green"}`} type="submit" 
                    className="mt-2" disabled={sending} />

                {/* link para o login */}
                <div className="w-full text-center text-miau-orange hover:text-miau-green active:text-miau-light-green">
                    <Link href="/login">Já possui uma conta? Faça login!</Link>
                </div>

            </form>
        </div>
    );

}

