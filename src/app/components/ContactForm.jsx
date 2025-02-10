import { CONTACT_INPUTS } from "@/constants/contactInputs"
import Input from "@/components/Input"
import { COUNTRIES } from "@/constants/countries"
import { CONTACT_TOPICS } from "@/constants/contactTopics"
import { Button } from "@/components/Button"
import { useState } from "react"
import Toast from "@/components/Toast"
import { useToast } from "@/hooks/useToast"

export function ContactForm() {
    const [contactData, setContactData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        country: "",
        topic: "",
        message: "",
    })

    const [isLoading, setIsLoading] = useState(false)

    const { toast, showToast, hideToast } = useToast()

    const handleChange = (e) => {
        const { target } = e
        const { name, value } = target
        setContactData({
            ...contactData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactData),
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}contact`, options)
            const data = await response.json()
            if (!data.data.success) {                

                showToast("Hubo un error al enviar el formulario", "error")
                return
            }
            showToast("Formulario enviado correctamente", "success")
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
            setContactData({
                name: "",
                email: "",
                phone: "",
                company: "",
                country: "",
                topic: "",
                message: "",
            })
        }

    }


    return (
        <>
            {
                toast.isVisible && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )
            }
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                {
                    CONTACT_INPUTS.map(({ label, placeholder, name, required, type, id }) => {
                        return (
                            <Input
                                key={id}
                                label={label}
                                type={type}
                                placeholder={placeholder}
                                name={name}
                                value={contactData[name]}
                                required={required}
                                onChange={handleChange}
                            />
                        )
                    })
                }
                <Input
                    inputType="select"
                    label="País"
                    placeholder="Selecciona un país"
                    name="country"
                    required={true}
                    options={COUNTRIES}
                    value={contactData.country}
                    onChange={handleChange}
                />
                <Input
                    inputType="select"
                    label="Asunto"
                    placeholder="Selecciona un asunto"
                    name="topic"
                    required={true}
                    options={CONTACT_TOPICS}
                    value={contactData.topic}
                    onChange={handleChange}
                />
                <label htmlFor="requerimiento" className="flex flex-col gap-2">
                    Requerimiento
                    <textarea
                        name="message"
                        id="requerimiento"
                        onChange={handleChange}
                        value={contactData.message}
                        cols="30"
                        rows="10"
                        placeholder="Escribe tu mensaje..."
                        className="border border-gray-400 rounded-lg p-2 resize-none text-sm"
                    ></textarea>
                </label>
                <Button type={"submit"} loading={isLoading}>
                    Enviar
                </Button>
            </form>
        </>

    )
}