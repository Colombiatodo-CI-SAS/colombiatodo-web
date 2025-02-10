"use client"
import { useEffect, useState } from "react";
import { AuthContext } from "@/context/Auth/AuthContext";
import { auth, db } from "@/services/Firebase";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/useToast";

export function AuthContextProvider({ children }) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phone: ""
    })

    const { toast, showToast, hideToast } = useToast()

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        const listener = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setIsLoading(false)
        })
        return () => listener()
    }, [])


    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        const { email, password, name, phone } = formData;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userRegistered = userCredential.user;

            await updateProfile(userRegistered, {
                displayName: name,
                phoneNumber: phone,
            });

            const userData = {
                id: userRegistered.uid,
                name: userRegistered.displayName,
                email: userRegistered.email,
                phoneNumber: userRegistered.phoneNumber,
            };

            setUser(userRegistered);
            await setDoc(doc(db, "customers", userRegistered.uid), userData);
            await sendEmailVerification(userRegistered)
            router.push("/register/verify-email")
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            showToast("Hubo un problema, intenta de nuevo", "failure")
            console.error(errorCode, errorMessage);
            setError(errorCode);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        setIsLoading(true)
        setError(null)
        e.preventDefault()
        const { email, password } = formData
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            if (!user.emailVerified) {
                return setError("email not verified")
            }
            setUser(user)
        } catch (error) {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
            setError(errorCode)
        } finally {
            setIsLoading(false)
        }
    }


    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signOut(auth);
            console.log("User sign out");
            router.push("/");
        } catch (error) {
            console.log(error);
            setError(error.code);
        } finally {
            setIsLoading(false);
            router.push("/login");
        }
    };

    const resetPassword = async (email) => {
        setIsLoading(true)
        setError(null)
        try {
            await sendPasswordResetEmail(auth, email)
            router.push("/login")
        } catch (error) {
            console.error(error);
            setError(error.code)
        }
        finally {
            setIsLoading(false)
        }
    }

    const emailVerification = async (user) => {
        setIsLoading(true)
        setError(null)
        try {
            await sendEmailVerification(user)
        } catch (error) {
            console.error(error);
            setError(error.code)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteAccount = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await deleteUser(user)
            await deleteDoc(doc(db, "customers", user.uid))
            router.push("/register")
        } catch (error) {
            console.error(error);
            setError(error.code)
        } finally {
            setIsLoading(false)
        }
    }

    const reAuthUser = async (password) => {
        setIsLoading(true)
        setError(null)
        try {
            const credential = EmailAuthProvider.credential(user.email, password)
            await reauthenticateWithCredential(user, credential)
        } catch (error) {
            console.error(error);
            setError(error.code)
        } finally {
            setIsLoading(false)
        }
    }

    const handleError = () => {
        if (error) {
            switch (error) {
                case "auth/invalid-email":
                    return "El formato del correo electrónico es inválido.";
                case "auth/user-disabled":
                    return "La cuenta del usuario ha sido deshabilitada.";
                case "auth/user-not-found":
                    return "El usuario no existe. Verifica tu correo electrónico.";
                case "auth/wrong-password":
                    return "La contraseña es incorrecta.";
                case "auth/too-many-requests":
                    return "Se han realizado demasiados intentos fallidos. Por favor, intenta más tarde.";
                case "auth/network-request-failed":
                    return "Error de red. Verifica tu conexión a Internet.";
                case "auth/account-exists-with-different-credential":
                    return "La cuenta ya existe con otro método de autenticación.";
                case "auth/popup-closed-by-user":
                    return "El inicio de sesión fue cancelado.";
                case "auth/operation-not-allowed":
                    return "El proveedor de autenticación no está habilitado.";
                case "auth/invalid-credential":
                    return "Las credenciales proporcionadas son inválidas.";
                case "auth/invalid-verification-code":
                    return "El código de verificación es inválido.";
                case "auth/invalid-verification-id":
                    return "El ID de verificación es inválido.";
                case "auth/requires-recent-login":
                    return "Por seguridad, inicia sesión nuevamente para realizar esta acción.";
                case "auth/email-already-in-use":
                    return "El correo electrónico ya está en uso con otra cuenta.";
                case "auth/captcha-check-failed":
                    return "La verificación de captcha falló. Intenta de nuevo.";
                case "auth/missing-email":
                    return "Por favor, ingresa un correo electrónico.";
                case "auth/weak-password":
                    return "La contraseña es demasiado débil. Usa al menos 6 caracteres.";
                case "auth/invalid-email-verified":
                    return "Verifica tu correo para continuar.";
                default:
                    return "Hubo un error inesperado. Intenta nuevamente más tarde.";
            }
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{
            formData,
            handleFormChange,
            handleRegister,
            handleLogin,
            resetPassword,
            emailVerification,
            deleteAccount,
            reAuthUser,
            user,
            logout,
            isLoading,
            error,
            handleError
        }}>
            {children}
        </AuthContext.Provider>
    )
}