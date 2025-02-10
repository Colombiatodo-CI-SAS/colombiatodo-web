"use client"
import Link from "next/link";
import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* eslint-disable @next/next/no-img-element */
export default function Login() {
    const auth = useAuth()
    const router = useRouter()
    const { handleFormChange, handleLogin, isLoading, user, handleError } = auth

    useEffect(() => {
        if (!isLoading && user?.emailVerified) {
            router.push("/")
        }
    }, [user, router, isLoading])


    return (
        <section className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:items-start lg:border lg:border-gray-300 lg:rounded-xl lg:shadow-sm">
            <img
                src="/images/form_img.webp"
                alt="Imagen de login"
                className="hidden lg:block w-full h-full object-cover rounded-l-xl"
            />
            <form className="flex flex-col gap-6 w-full lg:p-16" onSubmit={handleLogin}>
                <div className="w-full flex flex-col items-center">
                    <h2 className="font-bold text-xl">Bienvenid@ de vuelta</h2>
                    <p className="text-base">Qué bueno tenerte de nuevo</p>
                </div>
                <fieldset className="flex flex-col gap-6">
                    <p className="text-sm text-red-500">
                        {handleError()}
                    </p>
                    <Input
                        type={"email"}
                        name={"email"}
                        id={"email"}
                        placeholder={"Ingresa tu correo electrónico"}
                        label={"Correo electrónico"}
                        required={true}
                        onChange={handleFormChange}
                    />
                    <Input
                        type={"password"}
                        name={"password"}
                        id={"password"}
                        placeholder={"Ingresa tu contraseña"}
                        label={"Contraseña"}
                        required={true}
                        onChange={handleFormChange}
                    />
                </fieldset>
                <fieldset className="flex justify-between">
                    <label
                        htmlFor="remember-me"
                        className="text-base md:text-sm flex items-center gap-1 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            name="remember-me"
                            id="remember-me" />
                        Recordarme
                    </label>
                    <Link
                        href="/login/reset-password"
                        className="text-base md:text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </fieldset>
                <Button type={"submit"}
                    loading={isLoading}>Iniciar sesión</Button>
                <hr className="border-gray-300 my-6" />
                <Link
                    href={"/register"}
                    className="block text-base text-center md:text-sm mx-auto hover:text-blue-700 transition-colors"
                >
                    ¿No tienes una cuenta? Crea una cuenta
                </Link>
            </form>
        </section>
    )
}