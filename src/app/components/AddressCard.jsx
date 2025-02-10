export default function AddressCard({
    id,
    name,
    address,
    department,
    city,
    phoneNumber,
    deleteAddress,
    isLoading,
    isSelectable = false,
    onSelect,
    isSelected,
    isDeletable = false,
}) {
    const textStyle = "text-sm";

    const shippingData = {
        id,
        name,
        address,
        department,
        city,
        phoneNumber,
    }

    return (
        <label
            className={`flex flex-col gap-6 w-full bg-white border ${isSelectable && isSelected ? "border-blue-500" : "border-gray-200"
                } rounded-lg overflow-hidden px-5 py-3 hover:border-gray-400 transition-colors ${isSelectable ? "peer" : ""
                }`}
        >
            <section className="flex flex-col gap-2">
                <p className={`${textStyle} font-semibold`}>{name}</p>
                <p className={textStyle}>{address}</p>
                <p className={textStyle}>{department}, {city}</p>
                <p className={textStyle}>Colombia</p>
                <p className={textStyle}>Número de teléfono: {phoneNumber}</p>
            </section>

            {
                isDeletable && (
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
                )
            }

            {isSelectable && (
                <input
                    type="radio"
                    name="address"
                    className="hidden peer"
                    onChange={() => onSelect?.(shippingData)}
                    checked={isSelected}
                />
            )}
        </label>
    );
}
