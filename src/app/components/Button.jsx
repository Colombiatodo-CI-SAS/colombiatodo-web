import { Loader } from "@/components/Loader";


export function Button({ children, action, type, loading, error, disabled, variant }) {
    if (error) {
        return (
            <button
                type={type}
                className="w-full h-max border text-base md:text-base border-gray-400 rounded-xl py-2 px-4 bg-black text-white hover:bg-white hover:border hover:border-black hover:text-black transition-colors"
                disabled
                aria-label={error}
                >
                {error}
            </button>
        )
    }
    if (disabled) {
        return (
            <button
                type={type}
                className="w-full h-max border text-base md:text-base border-gray-400 rounded-xl py-2 px-4 bg-gray-600 text-white"
                disabled
                aria-label={children}
                title="Rellene el formulario para continuar"
            >
                {children}
            </button>
        )
    }

    if (variant === "destructive" && !loading) {
        return (
            <button
                type={type}
                className="w-full h-max border text-base md:text-base rounded-xl py-2 px-4 bg-red-600 text-white hover:bg-red-800 transition-colors"
                onClick={action}
                aria-label={children}
                >
                {children}
            </button>
        )
    }

    if (variant === "destructive" && loading) {
        return (
            <button
                type={type}
                className="w-full h-max border text-base md:text-base rounded-xl py-2 px-4 bg-red-600 text-white hover:bg-red-800 transition-colors"
                onClick={action}
                aria-label="Cargando"
                >
                <Loader simple/> Cargando...
            </button>
        )
    }

    if (variant === "secondary") {
        return (
            <button
                type={type}
                className="w-full h-max border text-base md:text-base border-gray-400 rounded-xl py-2 px-4 bg-white text-black hover:bg-black hover:border hover:border-white hover:text-white transition-colors"
                onClick={action}
                aria-label={children}
                >
                {children}
            </button>
        )
    }

    return (
        <>
            {
                !loading && !error ?
                    <button
                        type={type}
                        className="w-full h-max border text-base md:text-base border-gray-400 rounded-xl py-2 px-4 bg-black text-white hover:bg-white hover:border hover:border-black hover:text-black transition-colors"
                        onClick={action}
                        aria-label={children}
                        >
                        {children}
                    </button>
                    :
                    <button
                        type={type}
                        className="w-full h-max flex items-center gap-2 justify-center border text-base md:text-base border-gray-400 rounded-xl py-2 px-4 bg-black text-white hover:bg-white hover:border hover:border-black hover:text-black transition-colors"
                        onClick={action}
                        aria-label="Cargando"
                        >
                        <Loader simple/> Cargando...
                    </button>
            }
        </>
    )
}