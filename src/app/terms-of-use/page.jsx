import { TERMS_OF_USE } from "@/constants/termsOfUse"

export const metadata = {
    title: "Términos de uso | Colombiatodo CI SAS",
    description: "Términos de uso de Colombiatodo CI SAS. Conoce las condiciones de uso de nuestro sitio web y servicios.",
}

export default function TermsOfUse(params) {
    return (
        <section className="space-y-4">
            <h3 className="font-semibold text-xl">Términos de uso | Colombiatodo CI SAS</h3>
            <hr />
            <ol className="list-decimal list-inside space-y-4">
                {
                    TERMS_OF_USE.map(({ id, title, content }) => {
                        return (
                            <li key={id}>
                                <h4 className="font-semibold text-lg">{title}</h4>
                                <p>{content}</p>
                            </li>
                        )
                    })
                }
            </ol>
        </section>
    )
}