"use client"
import ShippingForm from "@/components/Payment/ShippingForm";
import OrderSummary from "@/components/Payment/OrderSummary";
import { useAuth } from "@/hooks/useAuth";
import { useMpPayment } from "@/hooks/useMpPayment";
import { useShippingForm } from "@/hooks/Payment/useShippingForm";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useBillingForm from "@/hooks/Payment/useBillingForm";
import { ArrowLeft, Plus } from "lucide-react";
import { useAddressForm } from "@/hooks/useAddressForm";
import { Loader } from "@/components/Loader";
import AddressCard from "@/components/AddressCard";
import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { idTypes } from "@/constants/idTypes";
import BillingForm from "@/components/Payment/BillingForm";

const mpPublicKey = process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? process.env.NEXT_PUBLIC_MERCADO_PAGO_PRODUCTION_PUBLIC_KEY : process.env.NEXT_PUBLIC_MERCADO_PAGO_DEV;

initMercadoPago(mpPublicKey);

export default function Payment() {
    const {
        shoppingCart,
        cartTotal,
        handleProductQuantity,
        handleQuantityChange,
        handleDeleteItem,
        totalCalculation
    } = useShoppingCart();

    const {
        mercadopagoPayment,
        preferenceId
    } = useMpPayment(shoppingCart, totalCalculation);

    const [selectedAddress, setSelectedAddress] = useState(null)

    const {
        paymentOptions,
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
        cheapestShipping,
        setShippingData,
        isLoadingShipping // Add this new state from useShippingForm
    } = useShippingForm(mercadopagoPayment, shoppingCart, selectedAddress);

    const { userAddresses, isLoading: addressLoading } = useAddressForm()

    const [paymentStep, setPaymentStep] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [showForm, setShowForm] = useState(false)

    const toggleForm = () => {
        setShowForm(prevState => !prevState)
        setSelectedAddress(null)
        setShippingData({
            name: user?.displayName || "",
            email: user?.email || "",
            phoneNumber: "",
            address: "",
            department: "",
            city: "",
            identification: "",
            idType: ""
        })
    }

    const selectAddress = (data) => {
        const { id, name, address, city, department, phoneNumber } = data
        setSelectedAddress(id)
        setShippingData({
            name: name || "",
            email: user?.email || "",
            phoneNumber: phoneNumber,
            address: address,
            department: department,
            city: city,
            identification: "",
            idType: ""
        })
    }


    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setPaymentStep(0);
    }, []);

    useEffect(() => {
        if (preferenceId) {
            handlePaymentStep();
        }
    }, [preferenceId]);

    useEffect(() => {
        if (!user?.emailVerified || !user) {
            router.push("/login");
        }
    }, [user, router]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handlePaymentStep = () => {
        setPaymentStep((prevState) => prevState + 1);
    };

    const { isBillingFormValid, billingInput } = useBillingForm()

    // Modify the form validation to include shipping loading state
    const isFormValid = isShippingFormValid && 
        cheapestShipping && 
        cheapestShipping.shippingCost > 0 && 
        !isLoadingShipping && 
        (billingInput || isBillingFormValid);

    return (
        <section className="md:flex md:justify-between md:gap-12">
            <div className={isMobile ? (paymentStep === 0 ? "block" : "hidden") : "md:w-7/12 space-y-4"}>
                <section className={!showForm ? "block" : "hidden"}>
                    <h3 className="text-lg font-black">Direcciones guardadas</h3>
                    <div className="flex flex-wrap gap-4">
                        <section className="grid grid-cols-3 gap-4 mt-6">
                            <label
                                htmlFor="add-address"
                                className="bg-white border border-dotted grid place-items-center w-full border-gray-300 rounded-lg px-5 py-3 hover:border-gray-500 transition-colors cursor-pointer"
                            >
                                <div className="flex flex-col items-center text-center gap-2">
                                    <Plus size={36} color="#9ca3af" />
                                    Nueva dirección de envío
                                </div>
                                <input type="button" id="add-address" className="hidden peer" onClick={toggleForm} />
                            </label>
                            {
                                userAddresses?.length === 0
                                    ? null :
                                    (addressLoading
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
                                                    isLoading={isLoading}
                                                    isSelectable
                                                    isSelected={selectedAddress === id}
                                                    onSelect={selectAddress}
                                                />
                                            )
                                        }))
                            }
                        </section>
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

                    </div>
                </section>
                <section className={showForm ? "block" : "hidden"}>
                    <div
                        className="flex text-gray-400 font-light items-center gap-2 my-4 hover:text-gray-600 transition-colors cursor-pointer"
                        onClick={toggleForm}
                    >
                        <ArrowLeft /> Volver
                    </div>
                    <ShippingForm
                        handleFormSubmit={handleFormSubmit}
                        inputOnChange={inputOnChange}
                        shippingData={shippingData}
                        selectedDepartment={selectedDepartment}
                        handleDepartmentChange={handleDepartmentChange}
                        selectedCity={selectedCity}
                        cities={cities}
                        handleCityChange={handleCityChange}
                        citiesMiPaquete={citiesMiPaquete}
                    />
                </section>
                <BillingForm />

                <Button
                    loading={isLoading || isLoadingShipping}
                    disabled={!isFormValid}
                    action={handleFormSubmit}
                >
                    {isLoadingShipping ? 'Calculando envío...' : 'Pagar ahora'}
                </Button>


            </div>
            <section className={isMobile ? (paymentStep === 0 ? "hidden" : "block") : "block w-full md:w-5/12"}>
                <OrderSummary
                    shoppingCart={shoppingCart}
                    cartTotal={cartTotal}
                    cheapestShipping={cheapestShipping}
                    handleQuantityChange={handleQuantityChange}
                    handleDeleteItem={handleDeleteItem}
                    handleProductQuantity={handleProductQuantity}
                    paymentOptions={paymentOptions}
                    preferenceId={preferenceId}
                />
            </section>
        </section>
    );
}
