import { ArrowLeft, Plus } from "lucide-react"
import Input from "@/components/Input"
import { Button } from "@/components/Button"
import { useAddressForm } from "@/hooks/useAddressForm"
import AddressCard from "@/components/AddressCard"
import { Loader } from "@/components/Loader"

export default function Address() {

    const {
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
    } = useAddressForm()


    return (
        <>
            {
                showForm ? (
                    <>
                        <h3 className="flex flex-col gap-4 text-lg font-black">
                            <span
                                className="flex text-gray-400 font-light items-center gap-2 hover:text-gray-600 transition-colors cursor-pointer"
                                onClick={toggleForm}
                            >
                                <ArrowLeft /> Volver
                            </span>
                            Agregar una nueva dirección
                        </h3>
                        <form
                            className="flex flex-col gap-3 my-4"
                            onSubmit={addNewAddress}
                        >
                            <Input
                                type={"text"}
                                placeholder={"Juan Perez"}
                                required
                                label={"Nombre completo"}
                                id={"name"}
                                name={"name"}
                                onChange={inputOnChange}
                                value={addressData.name}
                            />
                            <Input
                                type={"text"}
                                placeholder={"Calle 18 A #14 - 55"}
                                required
                                label={"Dirección de envío"}
                                id={"address"}
                                name={"address"}
                                onChange={inputOnChange}
                                value={addressData.address}

                            />
                            <Input
                                label="Número de contacto"
                                type={"tel"}
                                id={"phoneNumber"}
                                required
                                name={"phoneNumber"}
                                placeholder={"Ingresa un número de contacto"}
                                onChange={inputOnChange}
                                value={addressData.phoneNumber}
                            />
                            <fieldset className="flex justify-between gap-3">
                                <Input
                                    label={"Departamento"}
                                    type={"text"}
                                    id={"department"}
                                    required={true}
                                    inputType={"select"}
                                    options={departments}
                                    placeholder={"Selecciona un departamento"}
                                    value={selectedDepartment}
                                    name={"department"}
                                    onChange={handleDepartmentChange}
                                />
                                <Input
                                    label={"Ciudad"}
                                    type={"text"}
                                    required={true}
                                    inputType={"select"}
                                    id={"city"}
                                    options={cities}
                                    placeholder={"Selecciona una ciudad"}
                                    value={selectedCity}
                                    name={"city"}
                                    onChange={handleCityChange}
                                />
                            </fieldset>
                            <Button
                                type={"submit"}
                                loading={isLoading}
                            >
                                Guardar nueva dirección
                            </Button>
                        </form>
                    </>
                ) :
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        <label
                            htmlFor="add-address"
                            className="bg-white border border-dotted grid place-items-center w-full border-gray-300 rounded-lg px-5 py-3 hover:border-gray-500 transition-colors cursor-pointer"
                        >
                            <div className="flex flex-col items-center text-center gap-2">
                                <Plus size={36} color="#9ca3af" />
                                Agregar dirección de envío
                            </div>
                            <input type="button" id="add-address" className="hidden peer" onClick={toggleForm} />
                        </label>
                        {
                            userAddresses?.length === 0
                                ? null :
                                (isLoading
                                    ? <Loader /> :
                                    userAddresses?.map((el) => {
                                        const { id, name, address, city, department, phoneNumber } = el
                                        return (
                                            <AddressCard
                                                key={id}
                                                id={id}
                                                name={name}
                                                address={address}
                                                city={city}
                                                department={department}
                                                phoneNumber={phoneNumber}
                                                deleteAddress={() => deleteAddress(id)}
                                                isSelectable={false}
                                                isDeletable
                                            />
                                        )
                                    }))
                        }

                    </section>
            }

        </>
    )
}

