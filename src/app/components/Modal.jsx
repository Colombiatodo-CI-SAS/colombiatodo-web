export function Modal({ children, showModal = false }) {

    if (!showModal) return null;

    return (
        <div className="w-11/12 mx-auto fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <section className="flex flex-col gap-4 px-6 py-10 border max-h-[90dvh] overflow-y-auto border-gray-300 rounded-xl shadow-sm bg-white z-10">
                {children}
            </section>
        </div>
    );
}