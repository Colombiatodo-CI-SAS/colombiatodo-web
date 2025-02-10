import { Button } from "@/components/Button";
import { SOCIAL_LINKS } from "@/constants/socialLinks";
import Input from "@/components/Input";
import Link from "next/link";

export function Footer() {
    const footerP = "text-sm text-balance md:text-base"
    return (
        <footer className="border-t mt-16 lg:mt-44 border-gray-300 px-7 md:px-9 py-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-start border-solid border-b border-black border-opacity-20 py-6 w-full gap-4">
                <h2 className="font-bold text-base md:text-lg w-full">Conectamos empresas,<br /> creamos oportunidades</h2>
                <span className='flex flex-col lg:flex-row w-full gap-4'>
                    <form
                        className="w-full grid grid-flow-col gap-4 md:gap-4 items-center"
                    >
                        <Input
                            type="email"
                            placeholder="Correo electrónico"
                        />
                        <Button>Suscribete</Button>
                    </form>
                </span>
            </div>
            <section className="py-8 flex flex-col gap-3 justify-center md:justify-between items-center lg:flex-row">
                <span>
                    <img className="w-28 md:w-40" src="/images/logo_colombiatodo.webp" alt="Logo Colombiatodo" />
                </span>
                <Link 
                className={`${footerP} cursor-pointer hover:text-green-500 transition-colors`}
                href={"/terms-of-use"}
                >
                Términos de uso
                </Link>
                <span className="flex gap-4">
                    {
                        SOCIAL_LINKS.map(({ id, url, label, icon }) => (
                            <a key={id} href={url} target="_blank" className="hover:scale-105 transition-transform">
                                <img src={icon} alt={label} width={"36"} height={"36"} />
                            </a>
                        ))
                    }
                </span>
            </section>
            <section className="p-3 grid place-items-center gap-2">
                <p className={`${footerP} text-gray-500`}>&copy; {new Date().getFullYear()} Colombiatodo CI SAS. Todos los derechos reservados.</p>
                <p className="text-xs text-gray-400">Desarrollado por:
                    <a href="https://sunart-portfolio.vercel.app"
                    className="hover:text-gray-500 transition-colors"
                    target="_blank" rel="noopener noreferrer"
                    >
                        Sunart
                    </a>
                </p>
            </section>
        </footer>
    )
}

