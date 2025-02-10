import { db } from "@/services/Firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Loader } from "../Loader";
import { useAuth } from "@/hooks/useAuth";
import { useMiPaquete } from "@/hooks/useMiPaquete";
import { MapPin, Package, Truck } from "lucide-react";
import { priceFormatter } from "@/utils/priceFormatter";

export default function Orders() {
    const { user, isLoading: isUserLoading } = useAuth(); // Asume que useAuth expone el estado de carga
    const { getSendingTracking } = useMiPaquete();
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [ordersCode, setOrdersCode] = useState([]);
    const [ordersTracking, setOrdersTracking] = useState({});

    // Función para obtener las órdenes del usuario desde Firebase
    const getUserOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const userRef = doc(db, "customers", user.uid);
            const ordersCollectionRef = collection(userRef, "orders");
            const querySnapshot = await getDocs(ordersCollectionRef);
            const userOrders = querySnapshot.docs.map((doc) => doc.data());
            setOrdersCode(userOrders);
        } catch (error) {
            console.error("Error al obtener las órdenes del usuario:", error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    // Cargar las órdenes del usuario al montar el componente
    useEffect(() => {
        if (user) {
            getUserOrders();
        }
    }, [user]);

    // Cargar el seguimiento de las órdenes cuando se actualice `ordersCode`
    useEffect(() => {
        ordersCode.forEach(({ mpCode }) => {
            fetchOrderTracking(mpCode);
        });
    }, [ordersCode]);

    // Función para obtener el seguimiento de una orden específica
    const fetchOrderTracking = async (mpCode) => {
        try {
            const trackingData = await getSendingTracking(mpCode);
            setOrdersTracking((prev) => ({
                ...prev,
                [mpCode]: trackingData,
            }));
        } catch (error) {
            console.error(`Error fetching tracking for ${mpCode}:`, error);
        }
    };

    // Mostrar loader si el usuario o las órdenes están cargando
    if (isUserLoading || isLoadingOrders) {
        return <Loader />;
    }

    const areOrdersEmpty = ordersCode.length === 0;

    const sortOrdersByDate = ordersCode.sort((a, b) => {
        const dateA = new Date(a.createdAt.seconds * 1000);
        const dateB = new Date(b.createdAt.seconds * 1000);
        return dateB - dateA;
    });

    return (
        <section className="flex flex-wrap gap-8 mt-6">
            {areOrdersEmpty ? (
                <h2>Aún no tienes órdenes</h2>
            ) : (
                sortOrdersByDate.map((order) => {
                    const { mpCode, mercadoPagoOrder } = order;
                    const orderTracking = ordersTracking[mpCode] || {};
                    const {
                        deliveryCompanyName,
                        destiny,
                        guideNumber,
                        origin,
                        tracking = [],
                    } = orderTracking;
                    const lastUpdate = tracking.length > 0 ? tracking[tracking.length - 1] : {};
                    const { updateState = "Sin actualizar", date } = lastUpdate;
                    const { items = [], transactionAmount } = mercadoPagoOrder || {};

                    return (
                        <article
                            key={mpCode}
                            className="flex flex-col gap-6 w-full mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden px-5 py-3"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between gap-8 md:items-center">
                                <section className="flex gap-4 items-center">
                                    <MapPin />
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-gray-400">Origen</h4>
                                        <p>{origin || "No disponible"}</p>
                                    </div>
                                </section>
                                <section className="flex gap-4 items-center">
                                    <Truck />
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-gray-400">Destino</h4>
                                        <p>{destiny || "No disponible"}</p>
                                    </div>
                                </section>
                                <section className="flex gap-4 items-center">
                                    <Package />
                                    <div className="flex flex-col justify-between">
                                        <h4 className="text-gray-400">
                                            Número de Guía ({deliveryCompanyName || "N/A"})
                                        </h4>
                                        <p>{guideNumber || "No disponible"}</p>
                                    </div>
                                </section>
                            </div>

                            <section className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-lg">Estado</h4>
                                    <div>
                                        <p className="py-1 px-2 bg-gray-200 text-center font-light rounded-xl">
                                            {updateState}
                                        </p>
                                        <p className="text-right font-light">
                                            {date ? new Date(date).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <hr />
                                <div className="flex flex-col gap-2">
                                    {items.map((item) => {
                                        const { title, quantity, unit_price, picture_url } = item;
                                        return (
                                            <article
                                                key={title}
                                                className="flex gap-6 items-center"
                                            >
                                                <img
                                                    src={picture_url}
                                                    alt={`Imagen de ${title}`}
                                                    className={
                                                        !picture_url
                                                            ? "hidden"
                                                            : "w-32 h-32 object-cover shadow-sm border border-gray-300 rounded-lg"
                                                    }
                                                />
                                                <div className="flex flex-col">
                                                    <h2 className={"font-semibold text-lg"}>{title}</h2>
                                                    <p
                                                        className={
                                                            title === "Envío" ? "hidden" : "text-gray-400"
                                                        }
                                                    >
                                                        Cantidad:{" "}
                                                        <span className="text-black">{quantity}</span>
                                                    </p>
                                                    <p className="text-gray-400">
                                                        Precio:{" "}
                                                        <span className="text-black">
                                                            {priceFormatter(unit_price, 0, 0)[0]}
                                                        </span>
                                                    </p>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                                <hr />
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-lg">Total</h4>
                                    <p className="">
                                        {priceFormatter(transactionAmount, 0, 0)[0]}
                                    </p>
                                </div>
                            </section>
                        </article>
                    );
                })
            )}
        </section>
    );
}
