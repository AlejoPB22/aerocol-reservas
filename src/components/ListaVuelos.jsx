import TarjetaVuelo from './TarjetaVuelo.jsx'

function ListaVuelos({ vuelos, nombreOrigen, nombreDestino, vueloSeleccionado, onSeleccionarVuelo }) {
  return (
    <section className="lista">
      <h2>
        🛫 {vuelos.length} vuelo{vuelos.length !== 1 ? 's' : ''} · {nombreOrigen} →{' '}
        {nombreDestino}
      </h2>
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
