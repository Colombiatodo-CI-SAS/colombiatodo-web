import { getBrands } from "@/services/GetBrands"
import { useEffect, useState } from "react"

export const useBrands = () => {
    const [brands, setBrands] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const getBrandsData = async () => {
        setIsLoading(true)
        setError(false)
        try {
            const brandsData = await getBrands()
            setBrands(brandsData.data)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
            setError(error)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getBrandsData()
    }, [])

    return {
        brands,
        isLoading,
        error
    }
}