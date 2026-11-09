function formatoPrecio(precio) {
  return `$ ${precio.toLocaleString('es-CO')}`
}

function TarjetaVuelo({ vuelo }) {
  return (
    <li className="tarjeta">
      <strong>🛩️ {vuelo.avion}</strong>
      <span>🕐 {vuelo.hora}</span>
      <b>{formatoPrecio(vuelo.precio)}</b>
    </li>
  )
}

export default TarjetaVuelo
