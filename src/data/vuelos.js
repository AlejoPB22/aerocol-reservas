export const CIUDADES = [
  { codigo: 'CTG', nombre: 'Cartagena' },
  { codigo: 'BOG', nombre: 'Bogotá' },
  { codigo: 'MDE', nombre: 'Medellín' },
  { codigo: 'BAQ', nombre: 'Barranquilla' },
  { codigo: 'SMR', nombre: 'Santa Marta' },
  { codigo: 'CLO', nombre: 'Cali' },
]

export const VUELOS = [
  { id: 'v1', origen: 'CTG', destino: 'BOG', avion: 'Airbus A320', hora: '08:30', precio: 380000 },
  { id: 'v2', origen: 'BOG', destino: 'CTG', avion: 'Boeing 737-800', hora: '10:40', precio: 380000 },
  { id: 'v3', origen: 'CTG', destino: 'MDE', avion: 'Airbus A320', hora: '07:15', precio: 320000 },
  { id: 'v4', origen: 'MDE', destino: 'BOG', avion: 'ATR 72', hora: '09:05', precio: 260000 },
  { id: 'v5', origen: 'BOG', destino: 'MDE', avion: 'Boeing 737-800', hora: '13:10', precio: 340000 },
  { id: 'v6', origen: 'MDE', destino: 'CTG', avion: 'Airbus A320', hora: '12:30', precio: 320000 },
  { id: 'v7', origen: 'SMR', destino: 'CLO', avion: 'Boeing 737-700', hora: '14:40', precio: 370000 },

  // Vuelos adicionales para comprobar ordenamiento por precio, hora y avión
  { id: 'v8', origen: 'CTG', destino: 'BOG', avion: 'Boeing 737-800', hora: '06:15', precio: 420000 },
  { id: 'v9', origen: 'CTG', destino: 'BOG', avion: 'Embraer E190', hora: '15:45', precio: 295000 },
  { id: 'v10', origen: 'CTG', destino: 'BOG', avion: 'ATR 72', hora: '19:20', precio: 350000 },

  { id: 'v11', origen: 'BOG', destino: 'CTG', avion: 'Airbus A320', hora: '17:50', precio: 310000 },
  { id: 'v12', origen: 'BOG', destino: 'CTG', avion: 'Embraer E190', hora: '07:20', precio: 450000 },

  { id: 'v13', origen: 'CTG', destino: 'MDE', avion: 'ATR 72', hora: '16:10', precio: 275000 },
  { id: 'v14', origen: 'CTG', destino: 'MDE', avion: 'Boeing 737-700', hora: '11:30', precio: 360000 },

  { id: 'v15', origen: 'MDE', destino: 'CTG', avion: 'Embraer E190', hora: '08:00', precio: 345000 },
  { id: 'v16', origen: 'MDE', destino: 'CTG', avion: 'ATR 72', hora: '18:40', precio: 280000 },

  { id: 'v17', origen: 'CLO', destino: 'BOG', avion: 'Airbus A320', hora: '14:00', precio: 290000 },
  { id: 'v18', origen: 'CLO', destino: 'BOG', avion: 'Boeing 737-800', hora: '06:45', precio: 365000 },
  { id: 'v19', origen: 'CLO', destino: 'BOG', avion: 'ATR 72', hora: '20:15', precio: 245000 },

  { id: 'v20', origen: 'BAQ', destino: 'BOG', avion: 'Embraer E190', hora: '11:10', precio: 330000 },
  { id: 'v21', origen: 'BAQ', destino: 'BOG', avion: 'Airbus A320', hora: '05:50', precio: 395000 },
  { id: 'v22', origen: 'BAQ', destino: 'BOG', avion: 'ATR 72', hora: '18:05', precio: 285000 },
]
