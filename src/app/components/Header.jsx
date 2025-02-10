/* eslint-disable @next/next/no-img-element */
"use client"
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { LOW_OPTIONS } from "@/constants/lowOptions";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Input from "@/components/Input";
import { CartContainer } from "@/components/CartContainer";
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/Modal";
import { QuoteForm } from "@/components/QuoteForm";

export function Header() {
    const [query, setQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [showHamburger, setShowHamburger] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    const {
        shoppingCart,
        handleDeleteItem,
        handleShoppingCart,
        showCart,
        cartTotal
    } = useShoppingCart()

    const { user, logout } = useAuth()

    useEffect(() => {
        setShowProfile(false);
    }, [user]);

    const handleSearchInput = (e) => {
        setQuery(e.target.value)
    }

    const toggleModal = () => {
        setShowModal(modal => !modal)
    }

    const handleToggleSearch = () => {
        setShowSearch(prevState => !prevState)
    }

    const handleToggleHamburger = () => {
        setShowHamburger(prevState => !prevState)
    }

    const handleToggleProfile = () => {
        setShowProfile(prevState => !prevState)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        router.push(`/productos?query=${query}`)
        setQuery("")
        setShowSearch(false)
    }

    const cartLength = shoppingCart.length

    const iconStyle = "w-8 md:w-6 cursor-pointer transition-all duration-150 ease-in hover:text-green-500"

    return (
        <>
            {
                showModal && (
                    <Modal showModal={showModal}>
                        <QuoteForm toggleModal={toggleModal} />
                    </Modal>
                )
            }
            <header className="fixed top-0 w-full bg-white z-10 bg-opacity-90 p-1 backdrop-blur-md lg:p-2 border-b border-b-slate-200" >
                <nav className="flex justify-between px-4 md:px-9 py-4 items-center">
                    {
                        showHamburger ?
                            <X onClick={handleToggleHamburger} className="md:hidden" />
                            : <Menu
                                className="md:hidden"
                                onClick={handleToggleHamburger} />
                    }

                    <Link href='/' className="flex justify-center transition-scale duration-150 ease-in hover:scale-105 cursor-pointer">
                        <img
                            src="/images/logo_colombiatodo.webp"
                            alt="Logo Colombiatodo"
                            width={144}
                            height={144}
                            className="w-28 md:w-36" />
                    </Link>
                    <form
                        className={
                            showSearch ?
                                "absolute top-16 left-0 px-4 w-screen h-screen bg-white"
                                : "hidden md:block md:w-1/3 lg:w-2/3"
                        }
                        onSubmit={handleSearchSubmit}
                    >
                        <div className={"grid grid-flow-col gap-2 items-center pt-4 md:pt-0"}>
                            <Input
                                type="text"
                                placeholder="Neveras, colchones, productos naturales..."
                                onChange={handleSearchInput}
                                value={query} />
                            {
                                showSearch ?
                                    <Button type={"submit"}>
                                        Buscar
                                    </Button>
                                    :
                                    <></>
                            }
                        </div>
                    </form>
                    <span className=".cart-container md:gap-3 flex">
                        <span className="flex gap-1 relative">
                            <Search
                                className={`${iconStyle} md:hidden`}
                                onClick={handleToggleSearch} />
                            <ShoppingCart
                                className={iconStyle}
                                onClick={handleShoppingCart} />
                            {
                                cartLength > 0 && (
                                    <span
                                        className="cursor-pointer absolute -right-1 -top-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                        onClick={handleShoppingCart}>
                                        {cartLength}
                                    </span>
                                )}
                        </span>
                        <CartContainer
                            showCart={showCart}
                            style={iconStyle}
                            closeCart={handleShoppingCart}
                            items={shoppingCart}
                            deleteItem={handleDeleteItem}
                            total={cartTotal}
                        />
                        <section className={showProfile ? "relative" : ""}>
                            <div className="flex gap-1 cursor-pointer transition-all duration-150 ease-in hover:text-green-500"
                                onMouseEnter={handleToggleProfile}
                                onMouseLeave={handleToggleProfile}
                            >
                                <User
                                    className={`w-8 md:w-6 hidden md:block`}
                                />
                                {
                                    user?.emailVerified ? <p className="hidden lg:block font-light max-w-32 truncate">{user?.displayName ? user?.displayName : "usuario"}</p> : null
                                }

                            </div>

                            <div
                                className={showProfile ? "hidden absolute bg-white shadow-lg rounded-xl right-0 top-6 w-max py-8 px-6 md:flex flex-col gap-3" : "hidden"}
                                onMouseEnter={handleToggleProfile}
                                onMouseLeave={handleToggleProfile}
                            >
                                {
                                    user?.emailVerified ?
                                        <>
                                            <Link href={"/profile"} className="hover:text-green-500 transition-colors">Perfil</Link>
                                            <p onClick={logout} className="hover:text-green-500 cursor-pointer transition-all">Cerrar sesión</p>
                                        </>
                                        :
                                        <>
                                            <Link href={"/login"} className="hover:text-green-500">Iniciar sesión</Link>
                                            <Link href={"/register"} className="hover:text-green-500">Regístrate</Link>
                                        </>

                                }
                            </div>
                        </section>
                    </span>

                </nav>
                <LowOptions
                    state={showHamburger}
                    action={handleToggleHamburger}
                    user={user}
                    logout={logout}
                    toggleModal={toggleModal}
                />
            </header>
        </>
    )
}

function LowOptions({ state, action, user, logout, toggleModal }) {
    const pathname = usePathname()
    const handleQuote = () => {
        if (state) {
            action()
        }
        toggleModal()
    }
    return (
        <nav className={
            state ?
                "absolute w-screen h-screen top-20 left-0 bg-white bg-opacity-95 backdrop-blur-lg flex flex-col gap-6 px-6 py-2"
                : "hidden md:flex justify-center gap-6 py-2"
        }>
            {
                !user ?
                    <div className="flex justify-around w-full md:hidden">
                        <Link href={'/login'} onClick={state ? action : null}>
                            <Button>Iniciar sesión</Button>
                        </Link>
                        <Link href={'/register'} onClick={state ? action : null}>
                            <Button>Regístrate</Button>
                        </Link>
                    </div>
                    :
                    <>
                        <Link href={""} className="font-light cursor-default md:hidden">Hola {user?.displayName ? user.displayName : "usuario"}</Link>
                        <Link href={"/profile"} onClick={state ? action : null} className="hover:text-green-500 md:hidden">Perfil</Link>
                        <p onClick={logout} className="hover:text-green-500 cursor-pointer md:hidden">Cerrar sesión</p>
                    </>
            }
            <hr className="border-gray-400" />
            {
                LOW_OPTIONS.map(({ id, label, value }) => {
                    return (
                        <Link
                            key={id}
                            href={`/${value}`}
                            onClick={state ? action : null}
                            className={`text-balance ${pathname === (`/${value}`) ? "text-green-600" : "text-black"} transition-scale duration-150 ease-in hover:text-green-600 cursor-pointer`}>
                            {label}
                        </Link>
                    )
                })
            }
            <a
                onClick={handleQuote}
                className="text-balance text-blacktransition-scale duration-150 ease-in hover:text-green-600 cursor-pointer"
            >
                Cotizar
            </a>
        </nav>
    )
}

