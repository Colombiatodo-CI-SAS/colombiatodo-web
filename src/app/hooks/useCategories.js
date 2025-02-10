import { getCategories } from "@/services/GetCategories"
import { useEffect, useState } from "react"

export const useCategories = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const getCategoriesData = async () => {
        setIsLoading(true)
        setError(false)
        try {
            const categoriesData = await getCategories()
            setCategories(categoriesData.data)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
            setError(error)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getCategoriesData()
    }, [])

    return {
        categories,
        isLoading,
        error
    }
}