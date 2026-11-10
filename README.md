# ✈️ AeroCol — Sistema de Reservas de Vuelos

Aplicación interactiva de búsqueda y reserva de vuelos desarrollada con **React** y **Vite**.

---

## ✍️ Respuestas a las Preguntas Guía — F1 (Formulario de Reserva)

### 1. ¿Dónde debe vivir el estado del formulario (`nombre`, `pasajeros`, `clase`): dentro del componente nuevo o en `App`? ¿Quién más necesita esos datos?

> **Respuesta:**  
> Debe vivir **dentro del componente nuevo (`<FormularioReserva />`) como estado local**.  
>  
> **Justificación:**  
> Ningún otro componente externo (ni el encabezado, ni el selector de ruta, ni la lista de vuelos) necesita conocer los valores temporales que el usuario va escribiendo o seleccionando mientras diligencia el formulario.  
> `App` únicamente necesita la información consolidada en el momento exacto en que el usuario presiona el botón de **"Reservar"**, para lo cual basta con emitir los datos a través de una función callback (`onConfirmar`). Mantener el estado local evita renders innecesarios en el resto del árbol de componentes.

---

### 2. Si el total fuera un estado, ¿qué tendrías que hacer cada vez que cambian los pasajeros?

> **Respuesta:**  
> Si el `total` se almacenara en un `useState`:
> 1. Se tendría que sincronizar manualmente llamando a `setTotal(...)` cada vez que el usuario presione los botones `+` o `−`, y también cada vez que cambie de clase de vuelo o se seleccione un nuevo vuelo.
> 2. Alternativamente, se requeriría un `useEffect` que escuche los cambios de `[pasajeros, clase, vuelo.precio]`, lo que provocaría un ciclo adicional de re-render y aumentaría el riesgo de desincronización o bugs.
> 
> **Enfoque correcto:**  
> El total es un **valor derivado**. Se calcula al vuelo durante la fase de render:
> ```javascript
> const factorClase = FACTORES_CLASE[clase] ?? 1.0
> const total = Math.round(vuelo.precio * pasajeros * factorClase)
> ```
> De esta forma, el total siempre está 100% actualizado sin necesidad de estado redundante (*"Menos estado = menos bugs"*).

---

### 3. ¿Qué le pasa al formulario si no hay vuelo seleccionado? (pista: renderizado condicional)

> **Respuesta:**  
> Mediante el **renderizado condicional** en `App.jsx`:
> ```jsx
> {vueloSeleccionado && (
>   <FormularioReserva
>     vuelo={vueloSeleccionado}
>     onCancelar={() => setVueloSeleccionado(null)}
>     onConfirmar={agregarReserva}
>   />
> )}
> ```
> Si `vueloSeleccionado` es `null`, la condición evalúa a falsy y React **no monta ni renderiza el componente `<FormularioReserva />` en el DOM**. El formulario solo aparece cuando el usuario hace clic sobre una tarjeta de vuelo válida. Además, si el usuario cambia el origen o destino o pulsa *"🔄 Intercambiar"*, el estado se restablece a `null`, ocultando el formulario de inmediato.

---

## ✍️ Respuestas a las Preguntas Guía — F2 (Mis Reservas y `localStorage`)

### 1. ¿Por qué no mutar el array directamente con `push()`? ¿Qué pasa si lo usas y por qué React no se entera que cambió el array?

> **Respuesta:**  
> React compara las referencias en memoria (`Object.is`) para decidir si un estado cambió y si debe volver a renderizar el componente.  
> Cuando haces `reservas.push(nueva)`, modificas el mismo arreglo en memoria, pero **la referencia del array sigue siendo exactamente la misma**. Para React, nada cambió y la interfaz no se actualiza.  
> Al crear un array nuevo con el operador spread (`[...reservas, nueva]`) o con `reservas.filter(...)`, entregas una **nueva referencia** y React dispara el re-render de inmediato.

---

### 2. ¿Qué le pasa a tus reservas si recargas la página sin `localStorage`? ¿Por qué hay que convertir el array a texto antes de guardarlo en `localStorage`?

> **Respuesta:**  
> - **Sin `localStorage`:** El estado de React (`useState`) vive únicamente en la memoria RAM temporal de la pestaña del navegador; al recargar (`F5`), la aplicación se reinicia desde cero y todas las reservas se pierden.
> - **Conversión a texto (JSON):** `localStorage` es un almacenamiento clave-valor que **solo guarda cadenas de texto (`string`)**. Si intentaras guardar un arreglo de objetos directamente, JavaScript lo convertiría a `"[object Object]"` y perderías los datos. Por eso usamos `JSON.stringify(reservas)` al guardar y `JSON.parse(guardadas)` al leer.

---

### 3. ¿Dónde pones la lógica de guardar y en qué momento exacto deberías escribir en `localStorage`: al reservar, al eliminar, o en cada render?

> **Respuesta:**  
> La lógica de lectura y guardado vive en **`App.jsx`** (junto al estado `reservas`, usando `useState(cargarReservas)` para leer una sola vez al montar).  
> Se debe escribir en `localStorage` **únicamente cuando las reservas cambian: al agregar una reserva y al eliminar una reserva** (y **no** en cada render), porque escribir en el almacenamiento del navegador en cada render es innecesario, ineficiente y podría ejecutarse incluso cuando cambian otros estados no relacionados (como el origen, el destino o el nombre que escribe el usuario).

---

## 🛠️ Tecnologías y Conceptos Aplicados
- **React 19** + **Vite**
- **Lifting State Up**: Elevación de estados compartidos a `App.jsx`.
- **Formularios controlados**: `value` + `onChange` para inputs de texto, y `checked` para botones de tipo radio.
- **Valores derivados**: Cálculo reactivo en el cuerpo del componente sin estados redundantes.
- **Renderizado condicional**: Manejo dinámico de vistas según el estado de la aplicación.
- **Inmutabilidad y Persistencia**: Manejo inmutable de listas (`...`, `.filter()`) y persistencia con `localStorage` (`JSON.stringify` / `JSON.parse`) e inicialización perezosa (`useState(cargarReservas)`).
