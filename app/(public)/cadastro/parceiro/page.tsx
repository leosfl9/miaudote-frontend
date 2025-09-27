import LinkButton from "@/components/LinkButton";
import Image from "next/image";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import FormButton from "@/components/FormButton";

export default function CadastroParceiro() {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center min-h-screen px-2 md:px-8 py-6 lxl:py-10 bg-[url('/grafo_cadastro.png')] bg-no-repeat bg-cover bg-center">
            <div className="w-full max-w-4xl lxl:absolute lxl:top-10 2xl:top-24 lxl:left-10 2xl:left-18">
                <LinkButton href={"/tipo-cadastro"} text="Voltar" color="white" back={true} />
            </div>
            
            <div className="bg-white flex flex-col gap-3 items-center w-full max-w-4xl px-3 md:px-6 lg:px-12 py-6 rounded-xl">
                <div className="relative w-40 h-14 md:w-48 md:h-18 lg:w-56 lg:h-20 xl:w-64 xl:h-22">
                    <Image src="/logo-main.png" alt="Cadastro de parceiro" fill />
                </div>
                <h1 className="text-miau-green font-bold text-[22px] lg:text-3xl xl:text-[34px] text-center">
                    Informações básicas</h1>
                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Dados da ONG/protetor</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Nome da ONG/protetor *" name="nome" type="text" placeholder="Digite o nome" className="mb-2" />
                        <SelectField label="Tipo *" name="tipo" className="appearance-none mb-2">
                            <option value="">Selecione o tipo</option>
                            <option value="ONG">ONG</option>
                            <option value="Protetor">Protetor</option>
                        </SelectField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="CNPJ ou CPF *" name="documento" type="text" placeholder="Digite o CNPJ ou CPF" className="mb-2" />
                        <InputField label="Telefone *" name="telefone" type="text" placeholder="Digite o telefone" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="E-mail *" name="email" type="text" placeholder="Digite o e-mail" className="mb-2" />
                        <InputField label="Senha *" name="nome" type="password" placeholder="Digite a senha" className="mb-2" />
                    </div>

                    <InputField label="Site ou rede social" name="site" type="text" placeholder="Link do site ou rede social" className="mb-2" />
                </div>

                <div className="flex flex-col gap-1 self-start w-full">
                    <h2 className="text-miau-green text-sm lg:text-base font-medium">Endereço</h2>
                    <hr className="border-hr" />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="CEP *" name="cep" type="text" placeholder="Digite o CEP" className="mb-2" />
                        <InputField label="Estado *" name="estado" type="text" placeholder="Digite o estado" className="mb-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Bairro *" name="bairro" type="text" placeholder="Digite o bairro" className="mb-2" />
                        <InputField label="Cidade *" name="cidade" type="text" placeholder="Digite a cidade" className="mb-2" />
                    </div>

                    <InputField label="Logradouro *" name="logradouro" type="text" placeholder="Digite o logradouro" className="mb-2" />

                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <InputField label="Número *" name="numero" type="text" placeholder="Digite o número" className="mb-2" />
                        <InputField label="Complemento" name="complemento" type="text" placeholder="Digite o complemento" className="mb-2" />
                    </div>
                </div>

                <FormButton text="Confirmar" color="green" />

            </div>
        </div>
    );

}

