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
              (Estados: origen, destino, vueloSeleccionado, reservas)
                                         │
       ┌─────────────────┬───────────────┼───────────────┬─────────────────┐
       │                 │               │               │                 │
    <Header>      <SelectorRuta>   <ListaVuelos>   <MisReservas>        <Footer>
                         │               │               │                 
                  <SelectCiudad>   <TarjetaVuelo>    (Lista y btn        
                   (reutilizado)         │            eliminar)           
                                         │                                 
                                <FormularioReserva>                        
                                (Estados locales:                          
                             nombre, pasajeros, clase)                     
```