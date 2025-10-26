"use client"

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import FormButton from "@/components/FormButton";
import { validaSenha } from "@/utils/validaSenha";
import mascaraTelefone from "@/utils/mascaraTelefone";

import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// objeto do zod para validar formulário
const parceiroSchema = z.object({ 
    nome: z.string().min(2, "Nome é obrigatório"), 
    email: z.email("E-mail inválido"), 
    telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"), 
    senha: z.string().max(70, "Máx. 70 caracteres"), 
    confSenha: z.string().max(70, "Máx. 70 caracteres"), 
    site: z.string().optional(), 
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
            
type ParceiroForm = z.infer<typeof parceiroSchema>;

export default function Configuracoes() {
    // pega dos cookies os dados de autenticação do usuário
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    const router = useRouter(); // hook de roteamento

    const [loading, setLoading] = useState(true); // estado de loading da página
    const [sending, setSending] = useState(false); // estado de envio de formulário
    const [deleting, setDeleting] = useState(false); // estado de exclusão de conta
    
    // variáveis do react hook form
    const { 
        register, 
        handleSubmit, 
        setValue,
        clearErrors,
        formState: { errors }, 
    } = useForm<ParceiroForm>({ 
        resolver: zodResolver(parceiroSchema),
        mode: "all",
        shouldFocusError: false,
    });

    // submit do form
    const onSubmit = async (data: ParceiroForm) => { 
        try {
            setSending(true); // desabilita o botão de envio

            // formata o json a ser enviado
            const payload = {
                usuario: {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    telefone: data.telefone.replace(/\D/g, ''),
                    estado: data.estado,
                    cidade: data.cidade,
                },
                site: data.site,
            };

            // se o usuário editou a senha, envia junto
            if (data.senha.trim() !== "") {
                payload.usuario.senha = data.senha;
            }

            // chama a API com método PATCH
            const response = await fetch(`https://miaudote-8av5.onrender.com/parceiros/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // se der erro, exibe alerta
            if (!response.ok) {
                let errorMsg = "Erro ao editar dados!";
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

            // mensagem de sucesso
            Swal.fire({
                position: "top",
                icon: "success",
                title: "Alterações salvas!",
                showConfirmButton: false,
                timer: 1500
            });

            router.push('/parceiro/home'); // envia o usuário para home
        } catch (error) {
            // erro de conexão
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

    // função para excluir conta
    const handleDeleteConta = async () => {
        // modal de confirmação
        const confirm = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa ação não poderá ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F35D5D",
            cancelButtonColor: "#1B998B",
            confirmButtonText: "Sim, excluir conta",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return; // caso o usuário cancele a ação, não faz nada

        try {
            setDeleting(true); // desabilita os botões de deletar

            // requisição para deletar a conta
            const response = await fetch(`https://miaudote-8av5.onrender.com/parceiros/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            // se der erro, exibe
            if (!response.ok) {
                let errorMsg = "Erro ao excluir conta!";
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
                title: "Conta excluída com sucesso!",
                position: "top",
                showConfirmButton: false,
                timer: 1000,
            });

            // espera o alerta terminar antes de deslogar
                setTimeout(() => {
                    handleLogout(); // desloga o usuário
                }, 1000);

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

    useEffect(() => {
        // envia o usuário para a página de login se ele não estiver autenticado
        if (!token || !userId) {
            window.location.href = "/login";
            return;
        }
        
        // obtém os dados do parceiro
        const fetchParceiro = async () => {
            try {
                // armazena os dados
                const response = await fetch(`https://miaudote-8av5.onrender.com/parceiros/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                // se der erro, exibe alerta
                if (!response.ok) {
                    let errorMsg = "Erro ao obter dados!";
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

                // insere os dados do usuário nos inputs
                const parceiro = await response.json();

                setValue("nome", parceiro.nome ?? "");
                setValue("email", parceiro.email ?? "");
                setValue("telefone", mascaraTelefone(parceiro.telefone ?? ""));
                setValue("estado", parceiro.estado ?? "");
                setValue("cidade", parceiro.cidade ?? "");
                setValue("site", parceiro.site ?? "");

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
                setLoading(false); // termina o carregamento
            }
        };

        fetchParceiro(); // chama a função
    }, [setValue]);

    // função de logout usando api em typescript
    const handleLogout = async () => {
        try {
            // chama a API
            const response = await fetch("/api/logout", { 
                method: "POST" 
            });

            // mensagem de sucesso
            if (response.ok) {
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Deslogado com sucesso!",
                    showConfirmButton: false,
                    timer: 1000
                });

                // espera o alerta terminar antes de redirecionar
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            } else {
                // mensagem de falha
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Falha ao deslogar!",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        } catch (err) {
            // mensagem de erro
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Erro ao deslogar!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

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
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl">Configurações</h1>
                <h2 className="text-base 2xl:text-lg">Configurações do perfil de parceiro</h2>
            </div>

            <div className="w-full items-center justify-center flex flex-col gap-6">

                {/* formulário de edição de perfil */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-col gap-3 items-center w-full px-3 ssm:px-8 sm:px-12 xl:px-24 pt-6 pb-10 rounded-4xl">
                    <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                        Informações básicas</h1>
                    <div className="flex flex-col gap-1 self-start w-full">
                        <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados da ONG/Protetor</h2>
                        <hr className="border-hr" />
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                            <InputField label="Nome da ONG/Protetor *" maxLength={100} {...register("nome")} onFocus={() => clearErrors("nome")} 
                                error={errors.nome?.message} name="nome" type="text" placeholder="Digite o nome" className="mb-2" />
                            <InputField label="Celular / Whatsapp *" {...register("telefone")} onFocus={() => clearErrors("telefone")} error={errors.telefone?.message} 
                                name="telefone" mask={"(00) 00000-0000"} type="text" inputMode="numeric" placeholder="Digite um número para contato" className="mb-2" />
                            <div className="sm:col-span-2 lg:col-span-1">
                                <InputField label="E-mail *" maxLength={200} {...register("email")} onFocus={() => clearErrors("email")} 
                                    error={errors.email?.message} name="email" type="text" placeholder="Digite o e-mail" className="mb-2" />
                            </div>
                        </div>

                        <div>
                            <InputField label="Site ou rede social" maxLength={255} {...register("site")} onFocus={() => clearErrors("site")} 
                                error={errors.site?.message} name="site" type="text" placeholder="Link do site ou rede social" className="mb-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                            <InputField label="Nova senha" maxLength={70} {...register("senha")} onFocus={() => clearErrors("senha")} 
                                error={errors.senha?.message} name="senha" type="password" placeholder="Nova senha" className="mb-2" />
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

                    {/* botão de envio */}
                    <FormButton text={`${sending ? "Salvando..." : "Salvar alterações"}`} color={`${sending || deleting ? "disabled" : "green"}`} 
                        type="submit" className="mt-2" disabled={sending || deleting} />

                    {/* botão de exclusão de conta */}
                    <div className="flex w-full justify-end">
                        <button type="button" onClick={handleDeleteConta} disabled={sending || deleting } className={`w-fitrounded-md font-semibold 
                            text-[#F35D5D] hover:text-[#F35D5D]/80 transition cursor-pointer ${sending || deleting ? "text-text-gray" : ""}`}>
                            {deleting ? "Excluindo..." : "Excluir conta"}
                        </button>
                    </div>
                </form>

                {/* botão de logout */}
                <div className="w-full flex justify-center">
                    <button onClick={handleLogout} className="border-2 border-[#F35D5D] hover:bg-[#F35D5D] active:bg-[#F35D5D] px-12 py-2 rounded-lg 
                        text-[#F35D5D] hover:text-background active:text-background font-medium cursor-pointer">
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}