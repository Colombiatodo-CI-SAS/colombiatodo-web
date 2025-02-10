export function FloatingButton({icon}) {
    return (
        <a
            className="fixed bottom-16 right-10 w-16 h-16 rounded-full flex justify-center items-center text-white text-2xl hover:scale-105 transition-transform"
            href="https://wa.me/573053440115"
            target="_blank"
            >
            <img src={icon} />
        </a>
    )
}