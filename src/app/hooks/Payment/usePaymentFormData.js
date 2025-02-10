import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const usePaymentFormData = () => {
    const { user } = useAuth();
    const [shippingData, setShippingData] = useState({
        name: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: "",
        address: "",
        department: "",
        city: "",
        identification: "",
        idType: ""
    });
    const [billingData, setBillingData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        department: "",
        city: "",
        identification: "",
        idType: ""
    });
    const [isShippingFormValid, setIsShippingFormValid] = useState(false);
    const [isBillingFormValid, setIsBillingFormValid] = useState(false);

    useEffect(() => {
        if (user) {
            setShippingData(prevState => ({
                ...prevState,
                name: user.displayName,
                email: user.email
            }));
            setBillingData(prevState => ({
                ...prevState,
                name: user.displayName,
                email: user.email
            }));
        }
    }, [user]);

    const inputOnChange = (e, isBilling = false) => {
        const { name, value } = e.target;
        if (isBilling) {
            setBillingData(prevState => {
                const updatedState = { ...prevState, [name]: value };
                return updatedState;
            });
        } else {
            setShippingData(prevState => {
                const updatedState = { ...prevState, [name]: value };
                return updatedState;
            });
        }
    };

    return {
        shippingData,
        setShippingData,
        billingData,
        setBillingData,
        inputOnChange,
        isShippingFormValid,
        setIsShippingFormValid,
        isBillingFormValid,
        setIsBillingFormValid
    };
};
