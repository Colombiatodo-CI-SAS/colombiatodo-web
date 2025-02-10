"use client"
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { useState } from "react";

export default function Info({ user }) {

    const [profileInfo, setProfileInfo] = useState({
        name: user.displayName,
        email: user.email,
    })

    const [isLoading, setIsLoading] = useState(false);

    const inputOnChange = (e) => {
        const { name, value } = e.target;
        setProfileInfo(prevState => {
            const updatedState = { ...prevState, [name]: value };
            // const isValid = Object.values(updatedState).every(field => field.trim() !== "");
            // setIsFormValid(isValid);
            return updatedState;
        });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            console.log(profileInfo);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmitForm}>
            <section>
                <h3 className="font-semibold md:text-lg">Perfil</h3>
                <p className="font-light text-sm md:text-base">Actualiza tu información personal</p>
            </section>
            <fieldset className="flex flex-col gap-4">
                <Input
                    type={"text"}
                    label={"Nombre"}
                    name={"name"}
                    value={profileInfo.name}
                    onChange={inputOnChange}
                />
                <Input
                    type={"email"}
                    label={"Email"}
                    name={"email"}
                    value={profileInfo.email}
                    onChange={inputOnChange}
                />
                <Input
                    type={"password"}
                    label={"Contraseña"}
                    name={"password"}
                    onChange={inputOnChange}
                />
            </fieldset>
            <Button loading={isLoading} type={"submit"}>
                Actualizar información
            </Button>
        </form>
    )
}