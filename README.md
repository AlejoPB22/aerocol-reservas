# ✈️ AeroCol — Sistema de Reservas de Vuelos

## 🚀 Proyecto Final

**AeroCol** es una aplicación web interactiva desarrollada con **React** y **Vite** para buscar vuelos nacionales por ruta, ordenar el catálogo dinámico según distintos criterios (precio, hora o avión), calcular cotizaciones en tiempo real según número de pasajeros y clase, y gestionar reservas persistentes en el navegador mediante `localStorage`.

### 🌳 Árbol de Componentes

```text
                                     App
       (Estados: origen, destino, orden, vueloSeleccionado, reservas)
                                      │
    ┌────────────────┬────────────────┼────────────────┬────────────────┐
    │                │                │                │                │
<Header>      <SelectorRuta>    <ListaVuelos>    <MisReservas>      <Footer>
                     │                │
              <SelectCiudad>   <TarjetaVuelo>
               (reutilizado)          │
                             (render condicional en App)
                             <FormularioReserva>
                             (Estados locales: nombre, pasajeros, clase)
```

### ▶️ Cómo correr la app en local

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Para validar calidad de código y compilación de producción:

```bash
npm run lint
npm run build
```

---

## 💡 Decisión de Diseño Más Importante

La decisión arquitectónica más importante fue **centralizar en `App` únicamente los estados compartidos (`origen`, `destino`, `orden`, `vueloSeleccionado`, `reservas`) y tratar el resto como valores derivados o estado local**.

- **Por qué se tomó:** tanto el total de una reserva (`precio * pasajeros * factorClase`) como la lista ordenada (`[...vuelosEncontrados].sort(...)`) dependen directamente de otros estados existentes. Guardarlos en un `useState` independiente o sincronizarlos con `useEffect` habría introducido renders extra y riesgo de desincronización. Asimismo, guardar en `localStorage` directamente dentro de las acciones `agregarReserva` y `eliminarReserva` (en lugar de un efecto que corra ante cualquier cambio) garantiza que solo se escriba en disco cuando el usuario realmente crea o elimina una reserva.
- **Alternativa descartada (trade-off):** se descartó usar `Context API` o guardar cada campo del formulario y la lista ordenada como estados en `App`, porque aumentaba la complejidad y provocaba re-renderizados globales innecesarios en cada pulsación de tecla del campo `nombre`. Mantener el formulario encapsulado en `<FormularioReserva>` y emitir la reserva consolidada vía callback (`onConfirmar`) logra componentes desacoplados, más fáciles de depurar y con menor superficie de errores.

---

## ✍️ Respuestas a las Preguntas Guía — F1 (Formulario de Reserva)

### 1. ¿Dónde debe vivir el estado del formulario (`nombre`, `pasajeros`, `clase`): dentro del componente nuevo o en `App`? ¿Quién más necesita esos datos?

> **Respuesta:**  
> Debe vivir **dentro del componente nuevo (`<FormularioReserva />`) como estado local**.  
>  
> **Justificación:**  
> Ningún otro componente externo (ni el encabezado, ni el selector de ruta, ni la lista de vuelos) necesita conocer los valores temporales que el usuario va escribiendo o seleccionando mientras diligencia el formulario.  
> `App` únicamente necesita la información consolidada en el momento exacto en que el usuario presiona el botón de **"Reservar"**, para lo cual basta con emitir los datos a través de una función callback (`onConfirmar`). Mantener el estado local evita renders innecesarios en el resto del árbol de componentes.

### 2. Si el total fuera un estado, ¿qué tendrías que hacer cada vez que cambian los pasajeros?

> **Respuesta:**  
> Si el `total` se almacenara en un `useState`:
> 1. Se tendría que sincronizar manualmente llamando a `setTotal(...)` cada vez que el usuario presione los botones `+` o `−`, cada vez que cambie la clase de vuelo o al seleccionar otro vuelo.
> 2. Alternativamente, se requeriría un `useEffect` escuchando `[pasajeros, clase, vuelo.precio]`, añadiendo un ciclo adicional de re-render y riesgo de desincronización.
> 
> **Enfoque correcto:** El total es un **valor derivado**, calculado al vuelo en el render (`Math.round(vuelo.precio * pasajeros * factorClase)`). Menos estado = menos bugs.

### 3. ¿Qué le pasa al formulario si no hay vuelo seleccionado? (pista: renderizado condicional)

> **Respuesta:**  
> Mediante el **renderizado condicional** en `App.jsx` (`{vueloSeleccionado && <FormularioReserva ... />}`), si `vueloSeleccionado` es `null`, la expresión evalúa a *falsy* y React **no monta ni renderiza el formulario en el DOM**. Solo aparece al seleccionar una tarjeta de vuelo válida y se oculta automáticamente al confirmar, cancelar o cambiar de ruta.

---

## ✍️ Respuestas a las Preguntas Guía — F2 (Mis Reservas y `localStorage`)

### 1. ¿Por qué no mutar el array directamente con `push()`? ¿Qué pasa si lo usas y por qué React no se entera que cambió el array?

> **Respuesta:**  
> React compara referencias en memoria (`Object.is`) para detectar cambios de estado. Cuando haces `reservas.push(nueva)`, modificas el mismo arreglo en memoria pero **su referencia no cambia**, por lo que React no vuelve a renderizar la interfaz.  
> Al crear un arreglo nuevo con el operador spread (`[...reservas, nuevaReserva]`) o con `.filter(...)`, entregas una **nueva referencia** y React actualiza la vista de inmediato.

### 2. ¿Qué le pasa a tus reservas si recargas la página sin `localStorage`? ¿Por qué hay que convertir el array a texto antes de guardarlo en `localStorage`?

> **Respuesta:**  
> - **Sin `localStorage`:** el estado de React vive únicamente en la memoria RAM temporal de la pestaña; al recargar (`F5`), la app se reinicia y todas las reservas desaparecen.
> - **Conversión a texto (JSON):** `localStorage` solo almacena cadenas de texto (`string`). Sin `JSON.stringify`, un arreglo de objetos se convertiría en `"[object Object]"` perdiendo su estructura. Por eso se usa `JSON.stringify` al guardar y `JSON.parse` al leer (protegido con `try/catch`).

### 3. ¿Dónde pones la lógica de guardar y en qué momento exacto deberías escribir en `localStorage`: al reservar, al eliminar, o en cada render?

> **Respuesta:**  
> La lógica vive en **`App.jsx`**: se lee una única vez al montar mediante una función inicializadora (`useState(cargarReservas)`) y se guarda en `localStorage` **únicamente al reservar (`agregarReserva`) y al eliminar (`eliminarReserva`)**, nunca en cada render. Así se evita trabajo redundante de escritura cuando cambian otros estados no relacionados como la ruta o el orden.

---

## ✍️ Respuestas a las Preguntas Guía — F3 (Catálogo Inteligente)

### 1. ¿Por qué hay que ordenar una copia del array (`[...]`) y no el original? ¿Qué le pasaría a tu catálogo si ordenaras sin copiar?

> **Respuesta:**  
> El método `.sort()` de JavaScript **muta el arreglo original *in-place***. Si se ordenara `vuelosEncontrados` o `VUELOS` directamente sin hacer copia, se alteraría de forma permanente el orden original de los datos del catálogo, el orden podría quedar "trabado" al cambiar de criterio y en escenarios con referencias compartidas React podría no detectar cambios correctamente. Copiar primero con el operador spread (`[...vuelosEncontrados].sort(...)`) garantiza inmutabilidad y mantiene los datos fuente intactos.

### 2. ¿Dónde vive el estado `orden` y qué pasó con el orden al cambiar de ruta? ¿Se mantiene?

> **Respuesta:**  
> El estado `orden` vive en **`App.jsx`** (junto a `origen` y `destino`), porque es `App` quien deriva `vuelosOrdenados` y lo entrega a `<ListaVuelos>`. Al cambiar el origen, el destino o pulsar *"Intercambiar"*, el criterio de ordenamiento **se mantiene intacto** porque los manejadores de ruta actualizan `origen`/`destino` y limpian `vueloSeleccionado`, pero no reinician `orden`.

### 3. ¿Cómo le avisa la tarjeta a `App` que fue seleccionada y cómo se limpia la selección anterior al cambiar de ruta?

> **Respuesta:**  
> Aplicando el patrón *"los datos suben, las funciones bajan"*: `App` pasa `setVueloSeleccionado` a `<ListaVuelos>` mediante la prop `onSeleccionarVuelo`, y este la pasa a cada `<TarjetaVuelo>` como `onSeleccionar`. Al hacer clic en la tarjeta, ejecuta `onSeleccionar?.(vuelo)`, actualizando el estado `vueloSeleccionado` en `App`.  
> Para evitar que quede seleccionado un vuelo de una ruta anterior, las funciones `manejarOrigen`, `manejarDestino` e `intercambiar` en `App.jsx` ejecutan explícitamente `setVueloSeleccionado(null)`.

---

## 🗣️ Guía Rápida de Pre-Defensa (5 Preguntas Clave)

1. **¿Dónde vive cada estado y por qué?**
   - `origen`, `destino`, `orden`, `vueloSeleccionado` y `reservas` viven en `App` porque son compartidos entre varios componentes hermanos (`SelectorRuta`, `ListaVuelos`, `FormularioReserva`, `MisReservas`).
   - `nombre`, `pasajeros` y `clase` viven localmente en `FormularioReserva` porque solo interesan mientras el usuario llena el formulario.
2. **¿Por qué ni el total ni la lista ordenada son estados?**
   - Ambos son **estados derivados**: `total` se calcula desde `vuelo.precio`, `pasajeros` y `clase`; `vuelosOrdenados` se calcula desde `vuelosEncontrados` y `orden`. Calcularlos en el render evita duplicación y bugs de desincronización.
3. **¿Qué pasaría con las reservas sin `localStorage` ni inmutabilidad?**
   - Sin `localStorage`, al recargar la página se perderían todas las reservas. Sin inmutabilidad (`.push()` en lugar de `[...]` / `.filter()`), la referencia del array no cambiaría y React no re-renderizaría la lista.
4. **¿Por qué ordenas `[...vuelos].sort()` y no `vuelos.sort()`?**
   - Porque `.sort()` muta el arreglo sobre el que se invoca; usar spread crea una copia nueva, protege los datos originales de `VUELOS` y mantiene el flujo funcional predecible.
5. **Decisión de diseño destacada (trade-off):**
   - Mantener el formulario en estado local y guardar en `localStorage` únicamente en las acciones de mutación (`agregarReserva` / `eliminarReserva`) en lugar de elevar todo a `App` o usar `useEffect` globales, evitando re-renders innecesarios y escrituras repetidas en disco.

---

## 🛠️ Tecnologías y Conceptos Aplicados
- **React 19** + **Vite**
- **Lifting State Up**: Elevación de estados compartidos a `App.jsx`.
- **Formularios controlados**: `value` + `onChange` para inputs/selects y `checked` para radios.
- **Valores derivados**: Total de reserva y catálogo ordenado calculados en render sin estados redundantes.
- **Inmutabilidad y Persistencia**: Manejo inmutable de arrays (`[...]`, `.filter()`, `.sort()` sobre copia) y persistencia en `localStorage` (`JSON.stringify` / `JSON.parse` + inicializador `useState(cargarReservas)`).
