"use client"
import { Loader } from "@/components/Loader"
import Address from "@/components/Profile/Address"
import Info from "@/components/Profile/Info"
import Orders from "@/components/Profile/Orders"
import Privacy from "@/components/Profile/Privacy"
import { PROFILE_OPTIONS } from "@/constants/profileOptions"
import { useAuth } from "@/hooks/useAuth"
import { BookUser, LockKeyhole, ShoppingBag, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Profile() {
    const { user, deleteAccount, reAuthUser, isLoading } = useAuth()
    const [optionValue, setOptionValue] = useState("orders")
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) return router.push("/login")
    }, [user, router, isLoading])

    if (isLoading) {
        return <Loader />
    }


    const handleOptionChange = (e) => {
        setOptionValue(e.target.value)
    }


    const handleSection = () => {
        switch (optionValue) {
            case "orders":
                return <Orders />

            case "info":
                return <Info user={user} />

            case "privacy":
                return <Privacy reAuthUser={reAuthUser} deleteAccount={deleteAccount} />

            case "addresses":
                return <Address />
        }
    }

    const handleIcon = (icon) => {
        switch (icon) {
            case "shopping-bag":
                return <ShoppingBag />
            case "user":
                return <User />

            case "lock":
                return <LockKeyhole />

            case "address":
                return <BookUser />
        }
    }

    const styleUl = "flex overflow-x-auto snap-x snap-mandatory scroll-smooth justify-between mt-3 space-x-4"

    return (
        <>
            <h2 className="font-bold text-lg">Hola, {user ? user.displayName : 'usuario'}</h2>
            <ul className="flex flex-col sm:flex-row gap-2 my-4 overflow-x-auto">
                {
                    PROFILE_OPTIONS.map(({ id, label, value, icon }) => (
                        <li key={id} className="w-full">
                            <input
                                type="radio"
                                id={id}
                                name="profile-option"
                                value={value}
                                className="hidden peer"
                                checked={optionValue === value}
                                onChange={handleOptionChange}
                            />
                            <label
                                htmlFor={id}
                                className="flex flex-row items-center gap-2 justify-center w-full md:w-full px-5 py-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                            >
                                {handleIcon(icon)}
                                <div className="block">
                                    <p className="w-full">{label}</p>
                                </div>
                            </label>
                        </li>
                    ))
                }
            </ul>

            {
                handleSection()
            }

        </>
    )
}






