function SelectCiudad({ label, value, ciudades, onCambio }) {
    return (
        <label className="campo">
            {label}
            <select value={value} onChange={(e) => onCambio(e.target.value)}>
                <option value="">— Elige {label.toLowerCase()} —</option>
                {ciudades.map((c) => (
                    <option key={c.codigo} value={c.codigo}>
                        {c.nombre} ({c.codigo})
                    </option>
                ))}
            </select>
        </label>
    )
}

export default SelectCiudad
