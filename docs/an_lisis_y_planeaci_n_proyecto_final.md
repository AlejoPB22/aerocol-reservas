# Fase 1 — Análisis y Planeación AeroCol

## 1. Respuestas de Análisis

**1. ¿Dónde viven hoy los estados origen y destino? ¿Por qué ahí y no en SelectCiudad?**
Actualmente, los estados `origen` y `destino` viven en el componente principal `App`. Esto se justifica mediante el patrón de diseño de React conocido como *Lifting State Up* (elevar el estado). Como la información de las ciudades seleccionadas es requerida por el componente `ListaVuelos` para poder filtrar el catálogo, el estado debe alojarse en el ancestro común más cercano (`App`). Si el estado estuviera encapsulado dentro de cada `SelectCiudad`, el resto de la aplicación quedaría aislada y no podría acceder a esa información.

**2. ListaVuelos recibe vuelos, nombreOrigen, nombreDestino… ¿qué más necesitará recibir para que una tarjeta sea seleccionable?**
Necesitará recibir una nueva *prop* en forma de función, por ejemplo `onSeleccionarVuelo`. El componente `ListaVuelos` recibirá esta función desde `App` y se la pasará hacia abajo a cada instancia de `TarjetaVuelo`. Así, cuando el usuario haga clic en una tarjeta, esta simplemente ejecutará la función para notificarle a `App` cuál fue el vuelo elegido.

**3. ¿Qué datos necesita guardar una reserva? (Estructura de datos)**
Una reserva debe almacenarse como un objeto independiente que contenga toda la información vital para la persistencia, evitando depender de estados temporales. La estructura propuesta es la siguiente:
```javascript
{
  id: "uuid-unico-generado", // Identificador único de la reserva
  nombre: "Alejandro Paternina", // Nombre del pasajero
  vueloId: "v4", // Referencia al ID del vuelo seleccionado
  pasajeros: 2, // Cantidad de personas
  clase: "Ejecutiva", // Categoría elegida
  total: 832000, // Costo total ya calculado
  fecha: "26/11/2026" // Fecha en la que se realizó la reserva
}
```

**4. ¿Dónde crees que debe vivir el estado de las reservas y por qué?**
El estado global de las reservas (el arreglo con todas las reservas confirmadas) debe vivir en el componente `App`. Esto se debe a que múltiples componentes necesitan interactuar con esta información: `<FormularioReserva>` necesita agregar nuevas reservas al estado, y `<MisReservas>` necesita leer el arreglo para pintarlas en pantalla y tener la capacidad de eliminarlas. Al colocarlo en `App`, garantizamos una única fuente de la verdad (*single source of truth*) que además podremos sincronizar fácilmente con el `localStorage`.

---

## 2. Árbol de Componentes Proyectado

A continuación, se presenta la estructura arquitectónica proyectada para la aplicación, integrando las nuevas funcionalidades requeridas:

```text
                                        App
           (Estados: origen, destino, orden, vueloSeleccionado, reservas)
                                         │
       ┌─────────────────┬───────────────┼───────────────┬─────────────────┐
       │                 │               │               │                 │
    <Header>      <SelectorRuta>   <ListaVuelos>   <MisReservas>        <Footer>
  (aerolinea,    (origen, destino, (vuelos,        (reservas,          (anio)
   eslogan)       ciudades,         nombreOrigen,   onEliminarReserva)
                  ciudadesDestino,  nombreDestino,
                  onOrigen,         orden, onOrdenar,
                  onDestino)        vueloSeleccionado,
                         │          onSeleccionarVuelo)
                  <SelectCiudad>         │
                  (label, value,   <TarjetaVuelo>
                   ciudades,       (vuelo, seleccionada,
                   onCambio)        onSeleccionar)
                                         │
                                (render condicional en App)
                                <FormularioReserva>
                                (Props: vuelo, onConfirmar, onCancelar)
                                (Estados locales: nombre, pasajeros, clase)
```

---

# Fase 2 — Implementación de Funcionalidades (F1, F2 y F3)

## 🟢 F1 — Formulario de reserva

- **Objetivo:** Al seleccionar una tarjeta de vuelo, se despliega `<FormularioReserva />` mediante renderizado condicional (`{vueloSeleccionado && <FormularioReserva ... />}`) en `src/App.jsx`.
- **Componentes y archivos:** `src/components/FormularioReserva.jsx`, `src/components/TarjetaVuelo.jsx`, `src/components/ListaVuelos.jsx`, `src/App.jsx`.
- **Lógica implementada:**
  - Estados locales controlados dentro de `<FormularioReserva />`: `nombre` (`value` + `onChange`), `pasajeros` (botones `−` / `+` con `disabled={pasajeros <= 1}`) y `clase` (radios controladas con `checked` para `economica` ×1.0, `ejecutiva` ×1.6 y `primera` ×2.4).
  - El `total` es un **estado derivado** calculado al vuelo en el render: `Math.round(vuelo.precio * pasajeros * factorClase)` (sin usar `useState`).
  - El botón **Reservar** permanece deshabilitado mientras `nombre.trim() === ''`.
  - `TarjetaVuelo` recibe `onSeleccionar` para notificar a `App` qué vuelo eligió el usuario.

---

## 🟡 F2 — Mis reservas (persistencia con `localStorage`)

- **Objetivo:** Permitir guardar reservas confirmadas, visualizarlas en `<MisReservas />`, eliminarlas individualmente y conservarlas tras recargar la página.
- **Componentes y archivos:** `src/components/MisReservas.jsx`, `src/App.jsx`, `src/data/vuelos.js`, `src/App.css`.
- **Lógica implementada:**
  - **Carga inicial:** `App.jsx` utiliza la función inicializadora `cargarReservas()` pasada a `useState(cargarReservas)`, la cual lee la clave `'aerocol-reservas'` desde `localStorage` usando `JSON.parse` dentro de un bloque `try/catch` (retornando `[]` si no hay datos o si ocurre algún error).
  - **Inmutabilidad al agregar (`agregarReserva`):** cada nueva reserva recibe un `id` único generado con `crypto.randomUUID()` y la fecha actual con `new Date().toLocaleDateString('es-CO')`. Se crea un arreglo nuevo con `[...reservas, nuevaReserva]` (nunca `push`) y se guarda inmediatamente en `localStorage` con `JSON.stringify`.
  - **Inmutabilidad al eliminar (`eliminarReserva`):** se filtra la lista con `reservas.filter((r) => r.id !== id)` y se actualiza tanto el estado como `localStorage`.
  - **Estado vacío:** cuando `reservas.length === 0`, `<MisReservas />` renderiza el mensaje `"Aún no tienes reservas 👀"`. Cuando hay reservas, muestra nombre, `vueloId` (y detalle de avión/hora), ruta, pasajeros, clase, total pagado, fecha y el botón `🗑️ Eliminar`.

---

## 🔴 F3 — Catálogo inteligente (ordenar + detalle)

- **Objetivo:** Reordenar dinámicamente la lista de vuelos según el criterio elegido y resaltar visualmente la tarjeta seleccionada alimentando el detalle en el formulario.
- **Componentes y archivos:** `src/App.jsx`, `src/components/ListaVuelos.jsx`, `src/components/TarjetaVuelo.jsx`, `src/components/FormularioReserva.jsx`, `src/App.css`.
- **Lógica implementada:**
  - **Estado `orden` en `App.jsx`:** se define `const [orden, setOrden] = useState('precio-asc')` junto a `origen` y `destino`. Al cambiar de ruta o intercambiar ciudades, `orden` se mantiene intacto mientras `vueloSeleccionado` se limpia (`null`) para no arrastrar un vuelo de otra ruta.
  - **Ordenamiento derivado sobre copia:** `vuelosOrdenados` se calcula en cada render sobre una copia usando spread (`[...vuelosEncontrados].sort(...)`) para evitar mutar el arreglo original:
    - `precio-asc`: `a.precio - b.precio`
    - `precio-desc`: `b.precio - a.precio`
    - `hora`: `a.hora.localeCompare(b.hora)`
    - `avion`: `a.avion.localeCompare(b.avion)`
  - **Control `<select>` "Ordenar por":** integrado en `ListaVuelos.jsx` mediante las props `orden` y `onOrdenar`.
  - **Detalle y resaltado visual:** `TarjetaVuelo.jsx` aplica la clase condicional `seleccionada` (`className={seleccionada ? 'tarjeta seleccionada' : 'tarjeta'}`), resaltando la tarjeta elegida, y `FormularioReserva.jsx` muestra el detalle del vuelo seleccionado (`vuelo.id`, `vuelo.avion`, `vuelo.hora` y `vuelo.precio`).

---

# Fase 3 — Verificación y Calidad

## Checklist de pruebas funcionales

- [x] Búsqueda por ruta operativa (ej. `Medellín → Bogotá` muestra 1 vuelo `v4` por `$ 260.000`; intercambiar a `Bogotá → Medellín` muestra `v5` por `$ 340.000`).
- [x] El selector de destino excluye automáticamente la ciudad elegida en origen.
- [x] **F1:** cambiar pasajeros (`−`/`+`) o clase (`Económica`, `Ejecutiva`, `Primera`) actualiza el total al instante (ej. `260.000 × 2 × 1.6 = $ 832.000`).
- [x] **F1:** sin nombre de pasajero, el botón **Reservar** permanece deshabilitado.
- [x] **F2:** al confirmar, la reserva aparece en **Mis reservas** con su `vueloId`, datos y fecha.
- [x] **F2:** al recargar el navegador, las reservas persisten gracias a `localStorage`.
- [x] **F2:** el botón `🗑️ Eliminar` borra únicamente la reserva seleccionada; sin reservas se muestra `"Aún no tienes reservas 👀"`.
- [x] **F3:** las 4 opciones de **Ordenar por** reordenan la lista al instante (comprobable en rutas con múltiples vuelos como `Cartagena → Bogotá`).
- [x] Cambiar de ruta conserva el criterio de orden y limpia la selección de vuelo anterior.

## Verificación técnica de terminal

- `npm run lint`: ejecutado sin errores ni advertencias.
- `npm run build`: compilación de producción con Vite completada sin errores.