import TarjetaVuelo from './TarjetaVuelo.jsx'

function ListaVuelos({
  vuelos,
  nombreOrigen,
  nombreDestino,
  orden,
  onOrdenar,
  vueloSeleccionado,
  onSeleccionarVuelo,
}) {
  return (
    <section className="lista">
      <div className="lista-cabecera">
        <h2>
          🛫 {vuelos.length} vuelo{vuelos.length !== 1 ? 's' : ''} · {nombreOrigen} →{' '}
          {nombreDestino}
        </h2>

        <label className="ordenar-control">
          <span>Ordenar por</span>
          <select value={orden} onChange={(e) => onOrdenar(e.target.value)}>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="hora">Hora de salida</option>
            <option value="avion">Avión (A–Z)</option>
          </select>
        </label>
      </div>

      <ul>
        {vuelos.map((v) => (
          <TarjetaVuelo
            key={v.id}
            vuelo={v}
            seleccionada={vueloSeleccionado?.id === v.id}
            onSeleccionar={onSeleccionarVuelo}
          />
        ))}
      </ul>
    </section>
  )
}

export default ListaVuelos
