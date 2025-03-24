// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const addAddressToDB = async (addressData, user) => {
    const userRef = doc(db, "customers", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
        const userData = userDoc.data();
        const addresses = userData.addresses || [];
        
        const addressExists = addresses.some(addr => 
            addr.address === addressData.address &&
            addr.city === addressData.city &&
            addr.department === addressData.department
        );

        if (!addressExists) {
            const addressDataFormatted = {
                id: crypto.randomUUID(),
                name: addressData.name,
                address: addressData.address,
                department: addressData.department,
                city: addressData.city,
                phoneNumber: addressData.phoneNumber
            };
            
            await updateDoc(userRef, {
                addresses: arrayUnion(addressDataFormatted)
            });
        }
    }
};
