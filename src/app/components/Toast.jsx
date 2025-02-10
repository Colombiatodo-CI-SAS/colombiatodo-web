import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type, duration = 5000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);



    const icon = type === 'success' ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />;
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        isVisible && (
            <div className={`${bgColor} fixed w-11/12 z-10 md:w-max bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 p-4 rounded-md text-white shadow-lg transition-all`}>
                <span>{icon}</span>
                <p>{message}</p>
                <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-auto text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                </button>
            </div>
        )
    );
};