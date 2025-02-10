export const getSellerCityCode = (locationsData, ciudad) => {
    // Función para normalizar la cadena, eliminando tildes, comillas y espacios en blanco.
    const normalizeString = (str) =>
        str
            .toLowerCase()
            .normalize('NFD') // Descompone caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Elimina los caracteres diacríticos
            .replace(/['"`]/g, ''); // Elimina comillas

    // Función para encontrar coincidencias exactas de palabras, evitando coincidencias parciales no deseadas.
    const findCityCode = (locationsData, searchCity) => {
        const normalizedSearchCity = normalizeString(searchCity);

        return locationsData.find((location) => {
            const normalizedLocationName = normalizeString(location.locationName);
            // Verifica si la ciudad buscada coincide exactamente con alguna palabra completa en el nombre de la ubicación.
            const regex = new RegExp(`\\b${normalizedSearchCity}\\b`, 'i');
            return regex.test(normalizedLocationName);
        });
    };

    return findCityCode(locationsData, ciudad);
};