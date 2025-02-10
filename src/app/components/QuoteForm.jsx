import { X } from "lucide-react";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import Toast from "./Toast";

export function QuoteForm({ toggleModal }) {

    const [quoteData, setQuoteData] = useState({
        name: "",
        phone: "",
        email: "",
        product: "",
        quantity: "",
        comments: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast, showToast, hideToast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(quoteData)
            }
            const response = await fetch(`${backendUrl}quote-request`, options)
            const data = await response.json()
            if (data.success){
                showToast("Tu cotización ha sido enviada con éxito", "success")
                setQuoteData({
                    name: "",
                    phone: "",
                    email: "",
                    product: "",
                    quantity: "",
                    comments: ""
                })
            } 
        } catch (error) {
            console.error(error);
            showToast("Ha ocurrido un error al enviar la cotización", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        setQuoteData({
            ...quoteData,
            [e.target.name]: e.target.value
        })
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
            <header className="relative">
                <X
                    className="absolute -top-4 cursor-pointer hover:text-green-500 transition-colors"
                    onClick={toggleModal}
                />
                <h3 className="font-semibold md:text-lg text-center">¡Cotiza con nosotros!</h3>
                <p>Completa la siguiente información para cotizar tu proyecto de manera efectiva.</p>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    name={"name"}
                    id={"name"}
                    placeholder={"Nombre"}
                    required
                    label={"Nombre"}
                    type={"text"}
                    onChange={handleInputChange}
                />
                <Input
                    id={"phone"}
                    name={"phone"}
                    placeholder={"Contacto"}
                    required
                    label={"Número de contacto"}
                    type={"tel"}
                    onChange={handleInputChange}
                />
                <Input
                    id={"email"}
                    name={"email"}
                    placeholder={"john@acme.com"}
                    required
                    label={"Correo electrónico"}
                    type={"email"}
                    onChange={handleInputChange}
                />
                <Input
                    id={"product"}
                    name={"product"}
                    placeholder={"Cuéntanos de tu proyecto ¿Cuál producto deseas cotizar?"}
                    required
                    label={"Producto a cotizar"}
                    inputType={"textarea"}
                    onChange={handleInputChange}
                />
                <Input
                    id={"quantity"}
                    name={"quantity"}
                    placeholder={"Indícanos qué cantidad requieres"}
                    required
                    label={"Cantidad"}
                    type={"number"}
                    onChange={handleInputChange}
                />
                <Input
                    id={"comments"}
                    name={"comments"}
                    placeholder={"¿Qué comentarios adicionales tienes?"}
                    label={"Comentarios adicionales"}
                    inputType={"textarea"}
                    onChange={handleInputChange}
                />
                <Button
                    type={"submit"}
                    loading={isLoading}
                >
                    Cotizar ahora
                </Button>
            </form>
        </>
    )
}