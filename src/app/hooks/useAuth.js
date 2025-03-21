import { useContext } from "react"
import { AuthContext } from "@/context/Auth/AuthContext"

export const useAuth = () => {
    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error("useAuth must be used within a AuthContextProvider")
    }

    return authContext
}