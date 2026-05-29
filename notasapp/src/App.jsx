import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [notas, setNotas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')


  //modal para advertencia al eliminar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idParaEliminar, setIdParaEliminar] = useState(null);

  //para editar notas
  const[editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    fetchNotas()
  }, [])

  const fetchNotas =async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notas')
      const data = await response.json();
      setNotas(data)
    } catch(error) {
      console.error("Error al obtener notas")
    }
  }

  const crearNota = async () => {
    if (!titulo || !descripcion) return alert("Completa todos los campos")

      try{
        if (editandoId) {
          await fetch(`http://localhost:8080/api/notas/${editandoId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            }, 
            body: JSON.stringify({titulo, descripcion}),
          })
        setEditandoId(null)
        } else {
          await fetch("http://localhost:8080/api/notas", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({titulo, descripcion})
          }
        ) 
        } setTitulo('')
          setDescripcion('')
          fetchNotas()

      } catch(error) {
        console.error("Error al guardar o editar nota")
      }
  }


  const eliminarNota = async (id) => {
      try{
        await fetch(`http://localhost:8080/api/notas/${id}`, {
          method: 'DELETE',
            });
            fetchNotas()
          } catch (error) {
            console.log("Erro al eliminar nota", error)
          }
      }


  const editarNota = (nota) => {
    setTitulo(nota.titulo)
    setDescripcion(nota.descripcion)
    setEditandoId(nota.id)
  }


  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>App de notas</h1>
          <p>
            Una aplicación simple para ver, crear, editar y eliminar notas usando React y una API con Spring Boot
          </p>
        </div>
      </section>

      <div className='form'>
        <input
          type= 'text'
          placeholder='Título'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type= 'text'
          placeholder='Descripción'
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button className='form button'
          onClick={crearNota}
        >{editandoId ? "Actualizar nota" : "Crear nota"}
        </button>
      </div>


        <div className='notas'>
          {notas.map((nota) =>(
            <div className='nota' key={nota.id}>
            <h3>{nota.titulo}</h3>
            <p>{nota.descripcion}</p>
              <button
                onClick={() => editarNota(nota)}
                >Editar
              </button>
              <button onClick={() => {
                setModalAbierto(true); setIdParaEliminar(nota.id); }}>
                  Eliminar</button>

              {/* <button
                onClick={() => eliminarNota(nota.id)}
                >Eliminar
                </button> */}
          </div>
          ))}
        </div>


        {modalAbierto && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>¿Deseas eliminar esta nota?</h3>
      <div className="modal-botones">
        <button className='eliminar' 
        onClick={() => { eliminarNota(idParaEliminar); setModalAbierto(false); }}>Sí, eliminar</button>
        <button className='NOeliminar'
        onClick={() => setModalAbierto(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}


    </>

  )
}

export default App
