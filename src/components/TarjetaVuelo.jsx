function formatoPrecio(precio) {
  return `$ ${precio.toLocaleString('es-CO')}`
}

function TarjetaVuelo({ vuelo, seleccionada, onSeleccionar }) {
  return (
    <li
      className={`tarjeta ${seleccionada ? 'tarjeta-seleccionada' : ''}`}
      onClick={() => onSeleccionar && onSeleccionar(vuelo)}
      style={{ cursor: onSeleccionar ? 'pointer' : 'default' }}
    >
      <strong>🛩️ {vuelo.avion}</strong>
      <span>🕐 {vuelo.hora}</span>
      <b>{formatoPrecio(vuelo.precio)}</b>
      {onSeleccionar && (
        <button
          type="button"
          className={`btn-seleccionar ${seleccionada ? 'seleccionado' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onSeleccionar(vuelo)
          }}
        >
          {seleccionada ? '✓ Elegido' : 'Elegir'}
        </button>
      )}
    </li>
  )
}

export default TarjetaVuelo
