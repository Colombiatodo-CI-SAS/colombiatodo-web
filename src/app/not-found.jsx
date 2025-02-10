import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center gap-4 lg:gap-10 mt-24 lg:mt-44">
            <h2 className="text-3xl font-bold text-center">Oops! Parece que estás perdido</h2>
            <h3 className="text-base font-light text-balance text-center w-full">La página que estás buscando no existe. Volvamos a un lugar que reconozcas.</h3>
            <Link
                href="/"
            >
                <Button>Volver al home</Button>
            </Link>
        </div>
    )
}