"use client"
import Input from "@/components/Input";
import { idTypes } from "@/constants/idTypes";

export default function ShippingForm({
    inputOnChange,
    shippingData,
    selectedDepartment,
    handleDepartmentChange,
    selectedCity,
    cities,
    handleCityChange,
    citiesMiPaquete,
}) {

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

    return (
        <form
            className="flex flex-col gap-3 mb-3"
        >
            <h3 className="text-lg font-black">
                Datos de envío
            </h3>
            <Input
                label={"Nombre completo"}
                type={"text"}
                required={true}
                name={"name"}
                id={"name"}
                placeholder={"Ingresa tu nombre completo"}
                onChange={inputOnChange}
                value={shippingData.name}
            />
            <fieldset className="grid grid-cols-2 gap-2">
                <Input
                    label={"Tipo de documento"}
                    inputType={"select"}
                    type={"text"}
                    id={"idType"}
                    required={true}
                    name={"idType"}
                    value={shippingData.idType}
                    placeholder={"Selecciona el tipo de documento"}
                    options={idTypes}
                    onChange={inputOnChange}
                />
                <Input
                    label={"Número de documento"}
                    type={"text"}
                    id={"identification"}
                    required={true}
                    value={shippingData.identification}
                    placeholder={"Ingresa tu número de documento"}
                    name={"identification"}
                    onChange={inputOnChange}
                />
            </fieldset>
            <Input
                label={"Correo electrónico"}
                type={"email"}
                id={"email"}
                required={true}
                name={"email"}
                placeholder={"Ingresa tu correo electrónico"}
                onChange={inputOnChange}
                value={shippingData.email}
            />
            <Input
                label="Número de contacto"
                type={"tel"}
                id={"phoneNumber"}
                required={true}
                name={"phoneNumber"}
                placeholder={"Ingresa tu número de contacto"}
                onChange={inputOnChange}
                value={shippingData.phoneNumber}
            />
            <Input
                label="Dirección de envío"
                type="text"
                id={"address"}
                required={true}
                placeholder={"Ingresa la dirección de envío"}
                name={"address"}
                value={shippingData.address}
                onChange={inputOnChange}
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
        </form>
    );
}
