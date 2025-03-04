import { useMiPaquete } from "@/hooks/useMiPaquete";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";

export default function AddressCard({
    id,
    name,
    address,
    department,
    city,
    phoneNumber,
    deleteAddress,
    isSelectable = false,
    onSelect,
    isSelected,
    isDeletable = false,
}) {
    const [location, setLocation] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Changed to true initially
    const { getSpecificLocation } = useMiPaquete();
    const textStyle = "text-sm";

    const shippingData = {
        id,
        name,
        address,
        department,
        city,
        phoneNumber,
    };

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setIsLoading(true);
                const locationData = await getSpecificLocation(city);
                console.log(locationData);

                setLocation(locationData);
            } catch (error) {
                console.error('Error fetching location:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, [department, city]);

    useEffect(() => {
        console.log('Location:', location);
    }, [location])

    return (
        <>


            <label
                className={`flex flex-col gap-6 w-full bg-white border ${isSelectable && isSelected ? "border-blue-500" : "border-gray-200"
                    } rounded-lg overflow-hidden px-5 py-3 hover:border-gray-400 transition-colors ${isSelectable ? "peer" : ""
                    } ${isLoading ? "justify-center items-center" : ""}`}
            >
                {
                    isLoading && location ? (
                        <Loader simple />
                    ) : (
                        <>

                            <section className="flex flex-col gap-2">
                                <p className={`${textStyle} font-semibold`}>{name}</p>
                                <p className={textStyle}>{address}</p>
                                <p className={textStyle}>
                                    {location[0]?.locationName}, {location[0]?.departmentCode}
                                </p>
                                <p className={textStyle}>{location[0]?.countryName}</p>
                                <p className={textStyle}>Número de teléfono: {phoneNumber}</p>
                            </section>

                            {isDeletable && (
                                <section className="flex flex-row divide-x-2">
                                    <button
                                        className="text-sm text-blue-500 hover:text-blue-700 px-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteAddress(id);
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </section>
                            )}

                            {isSelectable && (
                                <input
                                    type="radio"
                                    name="address"
                                    className="hidden peer"
                                    onChange={() => onSelect?.(shippingData)}
                                    checked={isSelected}
                                />
                            )}
                        </>
                    )}

            </label>
        </>
    );
}
