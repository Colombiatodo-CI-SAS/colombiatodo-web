"use client"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Input({
    id,
    type,
    label,
    placeholder,
    name,
    required,
    value,
    onChange,
    inputType,
    options,
    defaultValue,

}) {
    const [viewPassword, setViewPassword] = useState(false)
    const router = useRouter()
    const isRegisteredPage = router.pathname === "/register"

    const togglePasswordView = () => {
        setViewPassword(prevState => !prevState)
    }

    const toggleInputType = (type) => {
        if (type === "password") {
            return viewPassword ? "text" : type
        }
        return type
    }

    const inputPattern = () => {
        if (name === "password" && isRegisteredPage) {
            return "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&*]{6,}$";
        }
        switch (name) {
            case "identification":
                return "\\d{6,10}";

            case "phoneNumber":
                return "3\\d{9}";

            case "email":
                return "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

            default:
                return null;
        }
    };

    const inputTitle = () => {
        switch (name) {
            case "identification":
                return "El número de identificación debe tener entre 6 y 10 dígitos, sin incluir letras ni caracteres especiales.";

            case "phoneNumber":
                return "Ingresa un número de celular válido";

            case "email":
                return "Ingresa un correo electrónico válido";

            case "password":
                return "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número.";

            default:
                return null;
        }
    }

    if (inputType === "select") {
        return (
            <SelectInput
                id={id}
                label={label}
                name={name}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                options={options}
            />
        )
    }

    if (inputType === "textarea") {
        return (
            <TextAreaInput
                id={id}
                label={label}
                name={name}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        )
    }

    return (
        <label htmlFor={id} className="flex flex-col gap-1 text-base w-full">
            <span>{label} {required && <span className="text-red-500">*</span>}</span>
            <section className="relative flex items-center">
                <input
                    type={toggleInputType(type)}
                    placeholder={placeholder}
                    id={id}
                    name={name}
                    className="text-base md:text-sm w-full h-max p-3 border border-gray-300 rounded-xl focus:outline-gray-400 hover:border-black transition-colors"
                    required={required}
                    value={value}
                    onChange={onChange}
                    defaultValue={defaultValue}
                    pattern={inputPattern() || undefined}
                    title={inputTitle()}
                />
                {
                    type === "password" ?
                        !viewPassword ?
                            <EyeOff
                                className="absolute right-3 cursor-pointer"
                                onClick={togglePasswordView} />
                            :
                            <Eye
                                className="absolute right-3 cursor-pointer"
                                onClick={togglePasswordView} />
                        : null
                }
            </section>
        </label>
    )
}


function SelectInput({ id, label, placeholder, name, required, value, onChange, options }) {
    return (
        <label htmlFor={id} className="flex flex-col gap-1 text-base w-full">
            <span>{label} {required && <span className="text-red-500">*</span>}</span>
            <select
                key={id}
                id={id}
                name={name}
                className="text-base md:text-sm w-full h-max p-3 border border-gray-300 rounded-xl focus:outline-gray-400 hover:border-black transition-colors"
                required={required}
                defaultValue={""}
                onChange={onChange}
            >
                <option value="" disabled>{placeholder}</option>
                {
                    options.map((option) => (
                        <option key={option.id} value={option.value}>{option.label}</option>
                    ))
                }
            </select>
        </label>
    )
}

function TextAreaInput({ id, label, placeholder, name, required, value, onChange }) {
    return (
        <label htmlFor={id} className="flex flex-col gap-1 text-base w-full">
            <span>{label} {required && <span className="text-red-500">*</span>}</span>
            <section className="relative flex items-center">
                <textarea
                    rows={4}
                    placeholder={placeholder}
                    id={id}
                    name={name}
                    className="text-base md:text-sm w-full h-max p-3 border border-gray-300 rounded-xl focus:outline-gray-400 hover:border-black transition-colors"
                    required={required}
                    value={value}
                    onChange={onChange}
                />
            </section>
        </label>
    )

}
