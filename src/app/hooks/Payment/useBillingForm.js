import { useState, useEffect } from "react";
import { usePaymentFormData } from "@/hooks/Payment/usePaymentFormData";
import { useMiPaquete } from "@/hooks/useMiPaquete";

export default function useBillingForm() {
    const [billingInput, setBillingInput] = useState(true);
    const { billingData, setBillingData, inputOnChange, isBillingFormValid, setIsBillingFormValid } = usePaymentFormData();
    const [selectedDepartment, setSelectedDepartment] = useState(billingData.department || "");
    const [selectedCity, setSelectedCity] = useState(billingData.city || "");
    const [cities, setCities] = useState([]);
    const [citiesMiPaquete, setCitiesMiPaquete] = useState([]);
    const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false)

    const { getLocations } = useMiPaquete();

    useEffect(() => {
        getLocations()
            .then(data => setCitiesMiPaquete(data))
            .catch(error => console.error(error));
    }, []);

    const checkLocalStorage = () => {
        if (typeof window !== 'undefined') {
            setIsLocalStorageAvailable(true);
        }
    }
    useEffect(() => {
        checkLocalStorage()
    }, []);

    useEffect(() => {
        if (isLocalStorageAvailable) {
            localStorage.setItem("billingData", JSON.stringify(billingData));
        }
    }, [billingData, isLocalStorageAvailable]);

    const handleDepartmentChange = (e) => {
        const departmentValue = e.target.value;
        setSelectedDepartment(departmentValue);
        setCities(getDepartmentCities(departmentValue));
        setSelectedCity("");
        inputOnChange(e, true); // Pass event and set as billing data
    };

    const getDepartmentCities = (departmentValue) => {
        const citiesByDepartment = citiesMiPaquete.filter(d => d.departmentOrStateCode === departmentValue);

        if (citiesByDepartment.length > 0) {
            const citySet = new Set();
            const mappedCities = [];

            citiesByDepartment.forEach(city => {
                if (!citySet.has(city.locationCode)) {
                    citySet.add(city.locationCode);
                    mappedCities.push({
                        id: city.locationCode,
                        value: city.locationCode,
                        label: city.locationName
                    });
                }
            });

            return mappedCities.sort((a, b) => a.label.localeCompare(b.label));
        }

        return [];
    };

    const handleCityChange = (e) => {
        const cityValue = e.target.value;
        setSelectedCity(cityValue);
        inputOnChange(e, true); // Pass event and set as billing data
    };

    useEffect(() => {
        const isValid = Object.values(billingData).every(field => field.trim() !== "");
        setIsBillingFormValid(isValid);
    }, [billingData]);

    return {
        billingInput,
        toggleBillingInput: () => setBillingInput(prevState => !prevState),
        inputOnChange,
        billingData,
        selectedDepartment,
        handleDepartmentChange,
        cities,
        handleCityChange,
        selectedCity,
        isBillingFormValid,
        citiesMiPaquete
    };
}
