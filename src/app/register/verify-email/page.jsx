"use client"
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function VerifyEmail() {
    const { emailVerification, user, isLoading } = useAuth()
    return (
        <section className="w-3/5 flex flex-col justify-center gap-8 mx-auto">
            <div className="flex flex-col gap-6">
                <h3 className="font-bold text-2xl text-center">Verifica tu email para continuar</h3>
                <p className="text-balance text-center">
                    ¡Gracias por registrarte! Para completar el registro, revisa tu correo electrónico y verifica tu cuenta con el enlace que te enviamos para <Link
                        href={"/login"}
                        className="text-xs md:text-base text-blue-500 hover:text-blue-700 cursor-pointer">
                        iniciar sesión.
                    </Link>
                </p>
                <hr />
                <div className="flex flex-col gap-2">
                    <p className="text-center">¿No recibiste ningún correo?</p>
                    <Button action={() => { emailVerification(user) }} loading={isLoading}>
                        Reenviar enlace de verificación
                    </Button>
                </div>
            </div>
        </section>
    )
}