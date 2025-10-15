import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";
import SelectField from "@/components/SelectField";

export default function homeAdotante(){
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-16 md:px-20 lg:px-30 py-4 sm:py-8 lg:py-10 ">
            <div className="flex flex-col gap-2 text-text-light-gray">
                <h1 className="font-bold text-3xl 2xl:text-4xl text-center">Pets disponíveis para adoção</h1>
            </div>

            <div className="flex flex-col plg:flex-row justify-between items-center plg:gap-2 lg:gap-4 mb-4">
                <div className="flex flex-col xsm:flex-row gap-1 xsm:gap-2 lg:gap-4 w-full">

                    <SelectField defaultValue={""} name="filtroEspecie" label="Espécie" className="appearance-none mb-2" >
                        <option value={""} disabled>Pesquise por espécie</option>
                        <option value="Cachorro">Cão</option>
                        <option value="Gato">Gato</option>
                    </SelectField>

                    <SelectField defaultValue={""} name="filtroEstado" label="Estado" className="appearance-none mb-2" >
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

                    <SelectField defaultValue={""} name="filtroSexo" label="Sexo" className="appearance-none mb-2" >
                        <option value={""} disabled>Pesquise por sexo</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </SelectField>
                </div>

                <button className={`w-full plg:w-[220px] mt-4 text-lg xl:text-xl px-8 py-2 rounded-[48px] transition-colors text-white font-semibold cursor-pointer 
                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] h-fit bg-miau-purple hover:bg-miau-light-green active:bg-miau-light-green`}>
                    Aplicar filtros
                </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-6 items-center lg:items-start">

                {/* <AnimalCard tipo="adotante" />
                <AnimalCard tipo="adotante" />
                <AnimalCard tipo="adotante" />
                <AnimalCard tipo="adotante" />
                <AnimalCard tipo="adotante" /> */}

            </div>
        </div>
    );
}