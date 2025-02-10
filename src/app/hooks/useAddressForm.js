import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useMiPaquete } from "./useMiPaquete";
import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/services/Firebase";

export const useAddressForm = () => {

    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [citiesMiPaquete, setCitiesMiPaquete] = useState([]);
    const [cities, setCities] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [addressData, setAddressData] = useState({
        id: "",
        name: "",
        address: "",
        department: "",
        city: "",
        phoneNumber: ""
    })
    const [userAddresses, setUserAddresses] = useState([])
    const { user } = useAuth()
    const { getLocations } = useMiPaquete()

    useEffect(() => {
        getLocations()
            .then(data => setCitiesMiPaquete(data))
            .catch(error => console.error(error));
    }, []);

    const handleDepartmentChange = (e) => {
        const departmentValue = e.target.value;
        setSelectedDepartment(departmentValue);
        setCities(getDepartmentCities(departmentValue));
        setSelectedCity("");
        inputOnChange(e);
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

    const toggleForm = () => {
        setShowForm(prevState => !prevState)
    }

    const inputOnChange = (e) => {
        const { name, value } = e.target;
        setAddressData(prevState => {
            const updatedState = { ...prevState, [name]: value };
            return updatedState;
        });
    }

    const addNewAddress = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const userRef = doc(db, "customers", user.uid)
            const addressDataFormatted = {
                id: crypto.randomUUID(),
                name: addressData.name,
                address: addressData.address,
                department: addressData.department,
                city: addressData.city,
                phoneNumber: addressData.phoneNumber
            }
            await updateDoc(userRef, {
                addresses: arrayUnion(addressDataFormatted)
            })
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
            setAddressData({
                name: "",
                address: "",
                department: "",
                city: "",
                phoneNumber: ""
            })
            setShowForm(false)
        }
    }

    const departmentSet = new Set();

    const departments = citiesMiPaquete.reduce((acc, city) => {
        const { departmentOrStateCode, departmentOrStateName } = city;

        if (!departmentSet.has(departmentOrStateCode)) {
            departmentSet.add(departmentOrStateCode);
            acc.push({
                id: departmentOrStateCode,
                value: departmentOrStateCode,
                label: departmentOrStateName
            });
        }

        return acc;
    }, []).sort((a, b) => a.label.localeCompare(b.label));

    const listenToUserAddresses = () => {
        if (!user.uid) {
            console.error("Usuario no autenticado");
            return;
        }
        const docRef = doc(db, "customers", user.uid);

        setIsLoading(true);

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const { addresses } = docSnap.data();
                    setUserAddresses(addresses || []);
                } else {
                    console.log("El documento no existe.");
                    setUserAddresses([]);
                }
                setIsLoading(false);
            },
            (error) => {
                console.error("Error escuchando los cambios en las direcciones:", error);
                setIsLoading(false);
            }
        );

        return unsubscribe;
    };

    useEffect(() => {
        if (user && user.uid) {
            const unsubscribe = listenToUserAddresses();

            return () => unsubscribe();
        }
    }, [user]);

    const deleteAddress = async (addressId) => {
        setIsLoading(true)
        try {
            const userRef = doc(db, "customers", user.uid)
            const docSnap = await getDoc(userRef)

            if (docSnap.exists()) {
                const { addresses } = docSnap.data()
                const addressToDelete = addresses.filter(({ id }) => id === addressId)[0]
                await updateDoc(userRef, {
                    addresses: arrayRemove(addressToDelete)
                })

            } else {
                console.log("Error deleting address")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        toggleForm,
        addNewAddress,
        inputOnChange,
        addressData,
        departments,
        selectedDepartment,
        handleDepartmentChange,
        cities,
        selectedCity,
        handleCityChange,
        isLoading,
        showForm,
        userAddresses,
        deleteAddress
    }
}