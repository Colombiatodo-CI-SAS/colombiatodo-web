"use client"
import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
    const { resetPassword, isLoading, error } = useAuth()
    const [email, setEmail] = useState()
    const router = useRouter()

    const handleOnSubmit = async (e) => {
        e.preventDefault()
        try {
            await resetPassword(email)
        } catch (error) {
            console.error(error);
        }
    }

    const handleInput = (e) => {
        const { target } = e
        setEmail(target.value)
    }

    return (
        <section className="w-3/5 flex flex-col justify-center gap-8 mx-auto">
            <div>
                <h3 className="font-bold text-2xl text-center">¿Olvidaste tu contraseña?</h3>
                <p className="text-balance text-center">No importa, nos pasa a todos. Escribe tu correo electrónico y te mandaremos un enlace para reiniciar tu contraseña</p>
            </div>
            <form className="flex flex-col gap-3 items-center" onSubmit={handleOnSubmit}>
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                <Input
                    label={"Correo electrónico"}
                    type={"email"}
                    placeholder={"correo@email.com"}
                    onChange={handleInput}
                />
                <fieldset className="w-full">
                    <Button type={"submit"} loading={isLoading}>
                        Reiniciar contraseña
                    </Button>
                </fieldset>
            </form>
        </section>

    )
}