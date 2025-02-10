export const CONTACT_INPUTS = [
    {
        id: crypto.randomUUID(),
        label: "Nombre",
        placeholder: "Ingresa tu nombre",
        name: "name",
        required: true,
        type: "text"
    },
    {
        id: crypto.randomUUID(),
        label: "Empresa (opcional)",
        placeholder: "Ingresa la empresa",
        name: "company",
        required: false,
        type: "text"
    },
    {
        id: crypto.randomUUID(),
        label: "Email",
        placeholder: "Ingresa tu email",
        name: "email",
        required: true,
        type: "email"
    },
    {
        id: crypto.randomUUID(),
        label: "Celular",
        placeholder: "Ingresa tu celular",
        name: "phone",
        required: true,
        type: "tel"
    },
]