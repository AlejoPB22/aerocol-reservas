import TarjetaVuelo from './TarjetaVuelo.jsx'

function ListaVuelos({ vuelos, nombreOrigen, nombreDestino }) {
  return (
    <section className="lista">
      <h2>
        🛫 {vuelos.length} vuelo{vuelos.length !== 1 ? 's' : ''} · {nombreOrigen} →{' '}
        {nombreDestino}
      </h2>
      <ul>
        {vuelos.map((v) => (
          <TarjetaVuelo key={v.id} vuelo={v} />
        ))}
      </ul>
    </section>
  )
}

export default ListaVuelos
