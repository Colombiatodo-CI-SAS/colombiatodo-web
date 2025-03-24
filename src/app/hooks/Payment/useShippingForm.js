import { useState, useEffect } from "react";
import { usePaymentFormData } from "@/hooks/Payment/usePaymentFormData";
import { useMiPaquete } from "@/hooks/useMiPaquete";
import { addAddressToDB, db } from "@/services/Firebase";
import { useAuth } from "../useAuth";

export const useShippingForm = (mercadopagoPayment, shoppingCart, selectedAddress) => {
    const { shippingData, setShippingData, inputOnChange, isShippingFormValid, setIsShippingFormValid } = usePaymentFormData();
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [cities, setCities] = useState([]);
    const [citiesMiPaquete, setCitiesMiPaquete] = useState([]);
    const [transportation, setTransportation] = useState([]);
    const [paymentOptions, setPaymentOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cheapestShipping, setCheapestShipping] = useState({
        name: "",
        shippingCost: 0,
        img: "",
        shippingTime: 0,
    });
    const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false)
    const { getLocations, quoteShipping } = useMiPaquete();
    const { user } = useAuth()
    const [isLoadingShipping, setIsLoadingShipping] = useState(false);

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
            localStorage.setItem("shippingData", JSON.stringify(shippingData));
        }
    }, [shippingData, isLocalStorageAvailable]);

    useEffect(() => {
        getLocations()
            .then(data => setCitiesMiPaquete(data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (shippingData.city && shoppingCart) {
            const setTransportationData = async () => {
                setIsLoadingShipping(true)
                try {
                    const transportationData = await quoteShipping(shippingData.city, shoppingCart);
                    setTransportation(transportationData);
                } catch (error) {
                    console.error(error);

                } finally {
                    setIsLoadingShipping(false)
                }
            };
            setTransportationData();
        }
    }, [shippingData.city, shoppingCart]);

    const handleDepartmentChange = (e) => {
        const departmentValue = e.target.value;
        setSelectedDepartment(departmentValue);
        setCities(getDepartmentCities(departmentValue));
        setSelectedCity("");
        inputOnChange(e); // Pass event and set as shipping data
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
        inputOnChange(e); // Pass event and set as shipping data
    };

    const findLowestShippingCost = () => {
        if (!Array.isArray(transportation) || transportation.length === 0) {
            return { deliveryCompanyName: "", shippingCost: 0, deliveryCompanyImgUrl: "", shippingTime: 0 };
        }

        return transportation.reduce((lowest, current) => {
            return current.shippingCost < lowest.shippingCost ? current : lowest;
        });
    };

    useEffect(() => {
        try {
            setIsLoadingShipping(true)
            const lowestShippingCost = findLowestShippingCost();
            setCheapestShipping({
                name: lowestShippingCost.deliveryCompanyName,
                shippingCost: lowestShippingCost.shippingCost,
                img: lowestShippingCost.deliveryCompanyImgUrl,
                shippingTime: lowestShippingCost.shippingTime,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingShipping(false)
        }
    }, [transportation]);

    const handleFormSubmit = async (e) => {
        setIsLoading(true);
        try {
            e.preventDefault();
            await mercadopagoPayment(cheapestShipping.shippingCost);
            if (!selectedAddress) {
                addAddressToDB(shippingData, user)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setPaymentOptions(true);
        }
    };

    useEffect(() => {
        const isValid = Object.values(shippingData).every(field => field?.trim() !== "");
        setIsShippingFormValid(isValid);
    }, [shippingData]);


    return {
        handleFormSubmit,
        inputOnChange,
        shippingData,
        selectedDepartment,
        handleDepartmentChange,
        selectedCity,
        cities,
        handleCityChange,
        isLoading,
        isShippingFormValid,
        citiesMiPaquete,
        paymentOptions,
        cheapestShipping,
        setShippingData,
        isLoadingShipping,
    };
};
