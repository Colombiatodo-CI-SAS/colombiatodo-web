"use client"
import Input from "@/components/Input";
import { idTypes } from "@/constants/idTypes";
import useBillingForm from "@/hooks/Payment/useBillingForm";

export default function BillingForm() {
    const {
        billingInput,
        toggleBillingInput,
        inputOnChange,
        billingData,
        selectedDepartment,
        handleDepartmentChange,
        cities,
        handleCityChange,
        selectedCity,
        citiesMiPaquete
    } = useBillingForm();

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

    const isBillingActive = !billingInput ? true : false;

    return (
        <>
            <legend className="text-base font-black">
                Datos de facturación
            </legend>
            <label htmlFor="billing-address" className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="billing-address"
                    id="billing-address"
                    checked={billingInput}
                    onChange={toggleBillingInput} />
                <p>Usar mismos datos de envio</p>
            </label>
            <fieldset className={billingInput ? "hidden" : "flex flex-col gap-3"}>
                <Input
                    label={"Razón social"}
                    type={"text"}
                    required={isBillingActive}
                    name={"name"}
                    placeholder={"Ingresa tu razón social"}
                    id={"name"}
                    onChange={(e) => inputOnChange(e, true)} // Pass true for billing data
                    value={billingData.name}
                />
                <fieldset className="grid grid-cols-2 gap-2">
                <Input
                    label={"Tipo de documento"}
                    inputType={"select"}
                    type={"text"}
                    id={"idType"}
                    required={isBillingActive}
                    placeholder={"Selecciona un tipo de documento"}
                    name={"idType"}
                    options={idTypes}
                    onChange={(e) => inputOnChange(e, true)}
                    value={billingData.idType}
                />
                <Input
                    label={"Número de documento"}
                    type={"text"}
                    id={"identification"}
                    placeholder={"Ingresa tu número de documento"}
                    required={isBillingActive}
                    name={"identification"}
                    onChange={(e) => inputOnChange(e, true)}
                    value={billingData.identification}
                />
            </fieldset>
                <Input
                    label={"Correo electrónico"}
                    type={"email"}
                    id={"email"}
                    placeholder={"Ingresa tu correo electrónico"}
                    required={isBillingActive}
                    name={"email"}
                    onChange={(e) => inputOnChange(e, true)} // Pass true for billing data
                    value={billingData.email}
                />
                <Input
                    label="Número de contacto"
                    type={"tel"}
                    id={"phoneNumber"}
                    placeholder={"Ingresa tu número de contacto"}
                    required={isBillingActive}
                    name={"phoneNumber"}
                    onChange={(e) => inputOnChange(e, true)} // Pass true for billing data
                    value={billingData.phoneNumber}
                />
                <Input
                    label="Dirección de facturación"
                    type="text"
                    id={"address"}
                    placeholder={"Ingresa tu dirección de facturación"}
                    required={isBillingActive}
                    name={"address"} // Changed name to match billingData key
                    onChange={(e) => inputOnChange(e, true)} // Pass true for billing data
                    value={billingData.address}
                />
                <fieldset className="flex justify-between gap-3">
                    <Input
                        label={"Departamento"}
                        type={"text"}
                        id={"department"}
                        required={isBillingActive}
                        inputType={"select"}
                        options={departments}
                        placeholder={"Selecciona un departamento"}
                        value={selectedDepartment}
                        name={"department"}
                        onChange={(e) => handleDepartmentChange(e)} // Handle department change
                    />
                    <Input
                        label={"Ciudad"}
                        type={"text"}
                        required={isBillingActive}
                        inputType={"select"}
                        id={"city"}
                        options={cities}
                        placeholder={"Selecciona una ciudad"}
                        value={selectedCity}
                        name={"city"}
                        onChange={(e) => handleCityChange(e)} // Handle city change
                    />
                </fieldset>
            </fieldset>
        </>
    );
}
