import SelectCiudad from './SelectCiudad.jsx'

function SelectorRuta({ origen, destino, ciudades, ciudadesDestino, onOrigen, onDestino }) {
  return (
    <div className="ruta">
      <SelectCiudad label="Origen" value={origen} ciudades={ciudades} onCambio={onOrigen} />
      <span className="flecha">→</span>
      <SelectCiudad
        label="Destino"
        value={destino}
        ciudades={ciudadesDestino}
        onCambio={onDestino}
      />
    </div>
  )
}

export default SelectorRuta
