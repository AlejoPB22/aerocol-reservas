import { VUELOS, CIUDADES } from '../data/vuelos.js'

function nombreCiudad(codigo) {
  return CIUDADES.find((c) => c.codigo === codigo)?.nombre ?? codigo
}

function formatoPrecio(precio) {
  return `$ ${precio.toLocaleString('es-CO')}`
}

function MisReservas({ reservas, onEliminarReserva }) {
  return (
    <section className="seccion-reservas">
      <h2>🎫 Mis Reservas ({reservas.length})</h2>

      {reservas.length === 0 ? (
        <div className="reservas-vacias">
          <p>No tienes reservas activas todavía ✈️</p>
          <small>Elige una ruta y completa el formulario para reservar tu vuelo.</small>
        </div>
      ) : (
        <div className="lista-reservas">
          {reservas.map((reserva) => {
            const vuelo = VUELOS.find((v) => v.id === reserva.vueloId)
            const origen = vuelo ? nombreCiudad(vuelo.origen) : '—'
            const destino = vuelo ? nombreCiudad(vuelo.destino) : '—'
            const claseFormateada =
              reserva.clase.charAt(0).toUpperCase() + reserva.clase.slice(1)

            return (
              <article key={reserva.id} className="tarjeta-reserva">
                <div className="reserva-header">
                  <span className="reserva-ruta">
                    🛫 {origen} → {destino}
                  </span>
                  <span className="reserva-fecha">📅 {reserva.fecha}</span>
                </div>

                <div className="reserva-detalles">
                  <p>
                    <strong>👤 Pasajero:</strong> {reserva.nombre}
                  </p>
                  {vuelo && (
                    <p>
                      <strong>🛩️ Vuelo:</strong> {vuelo.avion} ({vuelo.hora})
                    </p>
                  )}
                  <p>
                    <strong>👥 Pasajeros:</strong> {reserva.pasajeros} ·{' '}
                    <strong>Clase:</strong> {claseFormateada}
                  </p>
                  <p className="reserva-total">
                    <span>Total pagado:</span>
                    <strong>{formatoPrecio(reserva.total)}</strong>
                  </p>
                </div>

                <div className="reserva-acciones">
                  <button
                    type="button"
                    className="btn-eliminar-reserva"
                    onClick={() => onEliminarReserva(reserva.id)}
                  >
                    🗑️ Cancelar Reserva
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default MisReservas

