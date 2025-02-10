/* eslint-disable @next/next/no-img-element */
"use client"
import Link from "next/link";
import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { SelectInput } from "@/components/SelectInput";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {

    const auth = useAuth()
    const { handleFormChange, handleRegister, isLoading } = auth


    return (
        <section className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:items-start lg:border lg:border-gray-300 lg:rounded-xl lg:shadow-sm">
            <img
                src="/images/form_img.webp"
                alt="Imagen de login"
                className="hidden lg:block w-full h-full object-cover rounded-l-xl"
            />

            <form
                className="flex flex-col gap-6 w-full lg:p-16"
                onSubmit={handleRegister}>
                <div className="w-full flex flex-col items-center">
                    <h2 className="font-bold text-xl">Únete a nuestra comunidad</h2>
                    <p className="text-base text-center text-balance">Crea tu cuenta y disfruta de los beneficios de Colombiatodo B2C/B2B</p>
                </div>
                <fieldset className="flex flex-col gap-6">
                    <Input
                        type={"text"}
                        name={"name"}
                        id={"name"}
                        placeholder={"Ingresa tu nombre"}
                        label={"Nombre"}
                        required={true}
                        onChange={handleFormChange}
                    />
                    <SelectInput />
                    <Input
                        type={"email"}
                        name={"email"}
                        id={"email"}
                        placeholder={"Ingresa tu email"}
                        label={"Email"}
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
                        htmlFor="terms-conditions"
                        className="text-base md:text-sm flex items-center gap-1"
                    >
                        <input
                            type="checkbox"
                            name="terms-conditions"
                            id="terms-conditions"
                            required={true} />
                        Acepto términos y condiciones
                    </label>
                </fieldset>
                <Button type={"submit"}
                loading={isLoading}
                >Regístrate</Button>
                <hr className="border-gray-300 my-6" />
                <Link
                    href={"/login"}
                    className="block text-base text-center mx-auto lg:text-sm hover:text-blue-700 transition-colors"
                >
                    ¿Ya tienes una cuenta? Inicia sesión
                </Link>
            </form>
        </section>
    )
}