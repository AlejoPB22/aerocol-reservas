import { useState } from 'react'

const FACTORES_CLASE = {
  economica: 1.0,
  ejecutiva: 1.6,
  primera: 2.4,
}

function formatoPrecio(precio) {
  return `$ ${precio.toLocaleString('es-CO')}`
}

function FormularioReserva({ vuelo, onConfirmar, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [pasajeros, setPasajeros] = useState(1)
  const [clase, setClase] = useState('economica')

  // Total derivado dinámicamente: NO es estado
  const factorClase = FACTORES_CLASE[clase] ?? 1.0
  const total = Math.round(vuelo.precio * pasajeros * factorClase)

  const manejarEnvio = (e) => {
    e.preventDefault()
    if (nombre.trim() === '') return

    if (onConfirmar) {
      onConfirmar({
        nombre: nombre.trim(),
        vueloId: vuelo.id,
        pasajeros,
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
          <strong>Detalle del vuelo ({vuelo.id}):</strong> 🛩️ {vuelo.avion} · 🕐 {vuelo.hora}
        </p>
        <p>
          <strong>Precio base por persona:</strong> {formatoPrecio(vuelo.precio)}
        </p>
      </div>

      <form onSubmit={manejarEnvio}>
        {/* 1. Input controlado con value + onChange */}
        <label className="campo">
          Nombre completo
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Ana García"
          />
        </label>

        {/* 4. Contador de pasajeros con botones - / + y disabled */}
        <div className="campo">
          <span>Pasajeros</span>
          <div className="contador-pasajeros">
            <button
              type="button"
              onClick={() => setPasajeros(pasajeros - 1)}
              disabled={pasajeros <= 1}
            >
              −
            </button>
            <strong>{pasajeros}</strong>
            <button
              type="button"
              onClick={() => setPasajeros(pasajeros + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* 3. Radios controladas con checked */}
        <div className="campo">
          <span>Clase de vuelo</span>
          <div className="radios-clase">
            <label className="radio-opcion">
              <input
                type="radio"
                name="clase"
                value="economica"
                checked={clase === 'economica'}
                onChange={() => setClase('economica')}
              />
              Económica (x1.0)
            </label>

            <label className="radio-opcion">
              <input
                type="radio"
                name="clase"
                value="ejecutiva"
                checked={clase === 'ejecutiva'}
                onChange={() => setClase('ejecutiva')}
              />
              Ejecutiva (x1.6)
            </label>

            <label className="radio-opcion">
              <input
                type="radio"
                name="clase"
                value="primera"
                checked={clase === 'primera'}
                onChange={() => setClase('primera')}
              />
              Primera (x2.0)
            </label>
          </div>
        </div>

        {/* 2. Total calculado / derivado */}
        <div className="total-contenedor">
          <span>Total a pagar:</span>
          <strong className="total-precio">{formatoPrecio(total)}</strong>
        </div>

        {/* Botón de envío con disabled={nombre.trim() === ''} */}
        <button
          type="submit"
          className="btn-confirmar"
          disabled={nombre.trim() === ''}
        >
          Reservar
        </button>
      </form>
    </section>
  )
}

export default FormularioReserva
