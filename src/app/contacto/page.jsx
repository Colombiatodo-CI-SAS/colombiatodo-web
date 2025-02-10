"use client"
import { Mail, Phone } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"

export default function Contacto() {
    return (
        <section className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-24">
            <section className="flex flex-col gap-3">
                <div>
                    <h2 className="font-bold text-2xl">Contáctanos</h2>
                    <p className="text-sm lg:text-base">Estamos atentos a tus requerimientos. Te daremos una respuesta lo más pronto posible.</p>
                </div>
                <ContactForm />
            </section>
            <div className="flex flex-col gap-3 lg:gap-8 lg:bg-gray-300 lg:p-8 lg:rounded-lg lg:justify-center lg:h-max lg:w-full">
                <h3 className="font-bold">Información adicional</h3>
                <ul className="flex flex-col gap-4">
                    <li className="flex gap-3 text-sm items-center"><Mail /><a href="mailto:">ecommerce@colombiatodo.com</a></li>
                    <li className="flex gap-3 text-sm items-center"><Phone />+57 305 3440115</li>
                    {/* <li className="flex gap-2 text-sm"><Building />Dirección</li>
                    <li className="flex gap-2 text-sm"><CalendarClock />Horarios</li> */}
                </ul>
            </div>
        </section>
    )
}


