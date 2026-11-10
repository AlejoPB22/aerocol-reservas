import { useState } from 'react'
import './App.css'
import { CIUDADES, VUELOS } from './data/vuelos.js'
import Header from './components/Header.jsx'
import SelectorRuta from './components/SelectorRuta.jsx'
import ListaVuelos from './components/ListaVuelos.jsx'
import FormularioReserva from './components/FormularioReserva.jsx'
import MisReservas from './components/MisReservas.jsx'
import Footer from './components/Footer.jsx'

const STORAGE_KEY = 'aerocol-reservas'

function cargarReservas() {
  try {
    const guardadas = localStorage.getItem(STORAGE_KEY)
    return guardadas ? JSON.parse(guardadas) : []
  } catch {
    return []
  }
}

function guardarReservas(lista) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  } catch {
    // Evita fallos si localStorage está bloqueado o sin espacio
  }
}

function nombreCiudad(codigo) {
  return CIUDADES.find((c) => c.codigo === codigo)?.nombre ?? codigo
}

function App() {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null)
  const [reservas, setReservas] = useState(cargarReservas)

  const ciudadesDestino = CIUDADES.filter((c) => c.codigo !== origen)
  const vuelosEncontrados =
    origen !== '' && destino !== ''
      ? VUELOS.filter((v) => v.origen === origen && v.destino === destino)
      : []

  const manejarOrigen = (codigo) => {
    setOrigen(codigo)
    if (codigo === destino) setDestino('')
    setVueloSeleccionado(null)
  }

  const manejarDestino = (codigo) => {
    setDestino(codigo)
    setVueloSeleccionado(null)
  }

  const intercambiar = () => {
    setOrigen(destino)
    setDestino(origen)
    setVueloSeleccionado(null)
  }

  const agregarReserva = (datosReserva) => {
    const nuevaReserva = {
      id: crypto.randomUUID(),
      ...datosReserva,
      fecha: new Date().toLocaleDateString('es-CO'),
    }
    const nuevasReservas = [...reservas, nuevaReserva]
    setReservas(nuevasReservas)
    guardarReservas(nuevasReservas)
    setVueloSeleccionado(null)
  }

  const eliminarReserva = (id) => {
    const nuevasReservas = reservas.filter((r) => r.id !== id)
    setReservas(nuevasReservas)
    guardarReservas(nuevasReservas)
  }

  return (
    <main>
      <Header aerolinea="AeroCol" eslogan="Tu vuelo en un clic" />

      <section className="selector">
        <h2>✈️ Busca tu vuelo</h2>

        <SelectorRuta
          origen={origen}
          destino={destino}
          ciudades={CIUDADES}
          ciudadesDestino={ciudadesDestino}
          onOrigen={manejarOrigen}
          onDestino={manejarDestino}
        />

        <button type="button" onClick={intercambiar} disabled={!origen || !destino}>
          🔄 Intercambiar
        </button>
      </section>

      {!origen || !destino ? (
        <p className="mensaje">Elige origen y destino para buscar vuelos 🛫</p>
      ) : vuelosEncontrados.length === 0 ? (
        <p className="mensaje">No hay vuelos para esa ruta 🙃</p>
      ) : (
        <>
          <ListaVuelos
            vuelos={vuelosEncontrados}
            nombreOrigen={nombreCiudad(origen)}
            nombreDestino={nombreCiudad(destino)}
            vueloSeleccionado={vueloSeleccionado}
            onSeleccionarVuelo={setVueloSeleccionado}
          />

          {vueloSeleccionado && (
            <FormularioReserva
              vuelo={vueloSeleccionado}
              onConfirmar={agregarReserva}
              onCancelar={() => setVueloSeleccionado(null)}
            />
          )}
        </>
      )}

      <MisReservas reservas={reservas} onEliminarReserva={eliminarReserva} />

      <Footer anio={2026} />
    </main>
  )
}

export default App
