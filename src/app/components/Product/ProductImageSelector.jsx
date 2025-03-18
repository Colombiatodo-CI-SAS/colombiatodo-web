export const ProductImageSelector = ({imagenes, selectedImg, handleImgClick, titulo}) => {
    return (
        <div className="flex flex-col-reverse xl:flex-row gap-3 w-full lg:w-full">
            {imagenes.data.length > 0 && (
                <div className="flex flex-row xl:flex-col xl:h-[450px] overflow-auto gap-2">
                    {imagenes.data.map(({ id, attributes }) => {
                        const { url } = attributes;
                        return (
                            <img
                                key={crypto.randomUUID()}
                                alt={`Imagen de ${titulo} producto`}
                                src={url}
                                loading="lazy"
                                width={200}
                                height={200}
                                decoding="async"
                                className={`w-[100px] h-[100px] object-cover aspect-square rounded-md shadow-sm border border-gray-300 hover:opacity-100 hover:border-gray-400 cursor-pointer transition-all ${selectedImg === id ? "opacity-100 border-gray-400 border-2" : "opacity-70"}`}
                                onClick={() => handleImgClick(id)}
                            />
                        );
                    })}
                </div>
            )}
            {imagenes.data.filter(({ id }) => id === selectedImg).map(({ attributes }) => {
                const { url } = attributes;
                return (
                    <img
                        key={crypto.randomUUID()}
                        alt={`Imagen de ${titulo} producto`}
                        src={url || imagenes.data[0].attributes.url}
                        loading="lazy"
                        width={450}
                        height={450}
                        decoding="async"
                        className="w-full h-[300px] object-contain md:object-cover md:w-[450px] md:h-[450px] aspect-square rounded-md shadow-sm border border-gray-300"
                    />
                );
            })}
        </div>
    )
}