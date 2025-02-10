import { useState } from "react";

export const useToast = () => {
    const [toast, setToast] = useState({
        message: "",
        type: "",
        isVisible: false,
    })

    const showToast = (message, type) => {
        setToast({ message, type, isVisible: true })
    }

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };


    return {
        toast,
        showToast,
        hideToast,
    }
}