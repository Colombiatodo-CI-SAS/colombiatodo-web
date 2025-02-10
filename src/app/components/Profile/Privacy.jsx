import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

export default function Privacy({ deleteAccount, reAuthUser }) {
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const toggleModal = () => {
        setShowModal(modal => !modal)
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleBtn = async () => {
        setIsLoading(true)
        try {
            await reAuthUser(inputValue)
            await deleteAccount()
            toggleModal()
        } catch (error) {
            console.error(error);
        } finally {
            setInputValue("")
            setIsLoading(false)
        }
    }

    return (
        <>
            {
                showModal && (
                    <Modal showModal={showModal}>
                        <h3 className="font-semibold md:text-lg">Confirmación para eliminar cuenta</h3>
                        <p className="text-sm md:text-base text-pretty">¿Estás seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer</p>
                        <Input
                            type={"password"}
                            placeholder="Ingresa tu contraseña"
                            onChange={handleInputChange}
                        />
                        <div className="flex gap-4">
                            <Button action={toggleModal} variant="secondary">
                                Cancelar
                            </Button>
                            <Button variant="destructive" action={handleBtn} loading={isLoading}>
                                Eliminar
                            </Button>
                        </div>
                    </Modal>
                )
            }

            <section className="flex flex-col gap-5 mt-6">
                <div>
                    <h3 className="font-semibold md:text-lg">Privacidad</h3>
                    <p className="font-light text-sm md:text-base text-pretty">En Colombiatodo CI SAS, nos tomamos muy en serio tu privacidad. Creemos que proteger tu información personal es de suma importancia. Esta página describe nuestras prácticas de privacidad y te proporciona las herramientas para gestionar tu cuenta y tus datos.</p>
                </div>
                <div className="flex flex-col gap-3 border border-gray-300 px-4 py-6 rounded-xl shadow-sm">
                    <h4 className="font-semibold md:text-lg">Elimina tu cuenta</h4>
                    <p className="font-light text-sm md:text-base text-pretty">Eliminar su cuenta es una acción permanente. Una vez eliminada su cuenta, todos sus datos, incluida la información de su perfil, sus publicaciones y cualquier otro contenido que haya creado, se borrarán permanentemente de nuestros servidores. Esta acción no puede deshacerse.</p>
                    <Button variant={"destructive"} action={toggleModal}>
                        Eliminar cuenta
                    </Button>
                </div>
            </section>
        </>
    )
}