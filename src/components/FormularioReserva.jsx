import { useState } from 'react'

const FACTORES_CLASE = {
  Economica: 1.0,
  Ejecutiva: 1.6,
  Primera: 2.4,
}

function formatoPrecio(precio) {
  return `$ ${precio.toLocaleString('es-CO')}`
}

function FormularioReserva({ vuelo, onConfirmar, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [pasajeros, setPasajeros] = useState(1)
  const [clase, setClase] = useState('Economica')

  // Cálculo derivado dinámicamente sin guardarlo en el estado
  const cantidadPasajeros = Math.max(1, Number(pasajeros) || 1)
  const factor = FACTORES_CLASE[clase] ?? 1.0
  const total = Math.round(vuelo.precio * cantidadPasajeros * factor)

  const manejarEnvio = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return

    if (onConfirmar) {
      onConfirmar({
        nombre: nombre.trim(),
        vueloId: vuelo.id,
        pasajeros: cantidadPasajeros,
        clase,
        total,
      })
    }
  }

  return (
    <section className="formulario-reserva">
      <div className="formulario-reserva-header">
        <h3>📋 Reservar Vuelo</h3>
        {onCancelar && (
          <button type="button" className="btn-cancelar" onClick={onCancelar}>
            ✕ Cambiar vuelo
          </button>
        )}
      </div>

      <div className="resumen-vuelo">
        <p>
          <strong>Vuelo:</strong> {vuelo.avion} ({vuelo.hora})
        </p>
        <p>
          <strong>Precio base por persona:</strong> {formatoPrecio(vuelo.precio)}
        </p>
      </div>

      <form onSubmit={manejarEnvio}>
        <label className="campo">
          Nombre completo
          <input
            type="text"
            placeholder="Ej. Alejandro Paternina"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <div className="fila-campos">
          <label className="campo">
            Pasajeros
            <input
              type="number"
              min="1"
              max="10"
              value={pasajeros}
              onChange={(e) => setPasajeros(Number(e.target.value))}
              required
            />
          </label>

          <label className="campo">
            Clase
            <select value={clase} onChange={(e) => setClase(e.target.value)}>
              <option value="Economica">Económica (x1.0)</option>
              <option value="Ejecutiva">Ejecutiva (x1.6)</option>
              <option value="Primera">Primera Clase (x2.4)</option>
            </select>
          </label>
        </div>

        <div className="total-contenedor">
          <span>Total a pagar:</span>
          <strong className="total-precio">{formatoPrecio(total)}</strong>
        </div>

        <button type="submit" className="btn-confirmar" disabled={!nombre.trim()}>
          Confirmar Reserva
        </button>
      </form>
    </section>
  )
}

export default FormularioReserva

