"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";
import { useState } from "react";
import Cookies from "js-cookie";

import LinkButton from "@/components/LinkButton";
import InputField from "@/components/InputField";
import FormButton from "@/components/FormButton";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

// objeto do zod para validação de campos do formulário de login
const loginSchema = z.object({
    email: z.email("E-mail inválido"),
    senha: z.string().min(1, "Senha obrigatória")
})

// utiliza os tipos definidos no schema do zod
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const [sending, setSending] = useState(false);

    const router = useRouter();

    // variáveis do react hook form
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
    } = useForm<LoginForm>({ 
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => { 
        try {
            setSending(true);

            // formata o objeto json que será enviado para o backend
            const payload = {
                email: data.email,
                senha: data.senha,
            };

            // chama a API e armazena a resposta recebida
            const response = await fetch("http://localhost:8080/usuarios/login", {
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

            // lê o corpo da resposta como JSON
            const dataResponse = await response.json();

            // extrai o token, id e tipo do usuário
            const token = dataResponse.token;
            const userId = dataResponse.id;
            const tipo = dataResponse.tipo;

            // pega o tempo de expiração do token, definido em ms no backend
            const jwtExpirationMs = 3600000;
            const expiresInDays = jwtExpirationMs / (24 * 60 * 60 * 1000);

            // seta os cookies
            Cookies.set("token", token, { expires: expiresInDays, path: "/"  });
            Cookies.set("userId", userId, { expires: expiresInDays, path: "/"  });
            Cookies.set("tipo", tipo, { expires: expiresInDays, path: "/"  });

            Swal.fire({
                position: "top",
                icon: "success",
                title: "Seja bem-vindo!",
                showConfirmButton: false,
                timer: 1500
            });

            // redireciona baseado no tipo de usuário
            if (tipo === "parceiro") {
                router.push("/parceiro/home");
            } else {
                router.push("/adotante/home");
            }
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
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 
            bg-[url('/grafo_fundo.png')] bg-no-repeat bg-cover bg-center">
            {/* link para a home */}
            <div className="w-full max-w-[300px] md:max-w-[340px] lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/"} text="Voltar" color="white" back={true} />
            </div>
            
            {/* formulário de login */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-4 xl:gap-6 items-center
                w-full max-w-[300px] md:max-w-[340px] 2xl:max-w-[380px] px-5 md:px-6 lg:px-8 py-6 rounded-4xl ">
                <Link href={"/"} className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </Link>

                <div className="flex flex-col gap-2 lg:gap-3 w-full">
                    <InputField label="E-mail *" maxLength={200} {...register("email")} error={errors.email?.message} 
                        name="email" type="text" placeholder="Digite seu e-mail" className="mb-2" />
                    <InputField label="Senha *" maxLength={70} {...register("senha")} error={errors.senha?.message} 
                        name="senha" type="password" placeholder="Digite sua senha" className="mb-2" />
                </div>

                {/* botão de envio */}
                <FormButton text={`${sending ? "Entrando..." : "Entrar"}`} color={`${sending ? "disabled-purple" : "purple"}`} type="submit" disabled={sending} className="mt-2" />

                {/* link para o cadastro */}
                <div className="w-full text-center text-sm md:text-base text-miau-purple hover:text-miau-green active:text-miau-light-green">
                    <Link href="/tipo-cadastro">Ainda não possui conta? Cadastre-se!</Link>
                </div>
            </form>
        </div>
    );
}