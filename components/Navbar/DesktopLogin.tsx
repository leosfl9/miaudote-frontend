import LinkButton from "../LinkButton";

export default function DesktopLogin() {
    return (
        // componente de botão de link para a página de login
        <LinkButton href={"/login"} text={"Login"} hidden={true} color="white"/>
    );
}