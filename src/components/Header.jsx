function Header({ aerolinea, eslogan }) {
  return (
    <header className="header">
      <h1>✈️ {aerolinea}</h1>
      <p>{eslogan}</p>
    </header>
  )
}

export default Header
