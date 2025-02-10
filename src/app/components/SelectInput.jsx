import { COUNTRIES } from "@/constants/countries";

export function SelectInput() {
    return (
        <label htmlFor="pais" id="pais" className="flex flex-col gap-1 text-sm">
            País
            <select
                name="pais"
                id="pais"
                className="text-xs md:text-sm w-full h-max p-3 border border-gray-300 rounded-xl focus:outline-gray-400 hover:border-black transition-colors"
                required={true}
            >
                <option value="" disabled defaultValue={true}>Selecciona un país</option>
                {
                    COUNTRIES.map(({id, value, label}) => {
                        return (
                            <option key={id} value={value} >{label}</option>
                        )
                    })
                }
            </select>
        </label>
    )

}