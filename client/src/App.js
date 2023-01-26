import './App.css';
import io from "socket.io-client";
import { useState, useEffect } from "react";


//(con socket escuchamos eventos y mandamos eventos) puente de conexion entre front y back
// const socket = io('http://localhost:4000');   usado en fase de desarrollo
const socket = io();


function App() {

  // estado del message en el input
  const [message, setMessage] = useState('');   //comentario random
  const [messages, setMessages] = useState([]);


  const handleSubmit = (e) => {
    e.preventDefault();  //cancela el refresh de la pagina
    socket.emit('messageFrontend', message) //todo Emitiendo el evento al backend

    //estructurando el mensaje typeado(emisor) en el input para mostrarlo en las demas conexiones 
    const newMessage = {
      body: message,
      from: "Me"
    };


    //array con los mensajes
    setMessages([newMessage, ...messages])
    setMessage("");  //limpiar el input del form
  }

  //ejecurta codigo cuando carga la aplicacion
  useEffect(() => {

    //fun que recibe el mensaje
    const receiveMessage = message => {
      setMessages([message, ...messages])
    };

    socket.on('messageBackend', receiveMessage)  //


    //Desuscribiendo el componente
    return () => {
      socket.off('messageBackend', receiveMessage)
    }

  }, [messages]);


  return (
    <div className="h-screen bg-violet-700 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-5 rounded-md">
      <h1 className='text-2xl font-bold my-2 flex items-center justify-center'> Another Thing App </h1>
        <input
          type="text"
          onChange={e => setMessage(e.target.value)}
          value={message}
          className="border-2 border-zinc-500 p-2 text-black w-full rounded-md"
          placeholder='Mensaje'
        />
        <button className='bg-blue-500 p-1 m-2 float-right rounded-md'>Send</button>



          <div className='py-12'>
          <ul className='h-80 overflow-y-auto bg-teal-500 rounded-md p-2' >
            {/*recoriendo el array de los mensajes */}
            {messages.map((message, index) => (
              <li key={index} className={`my-2 p-2 table text-sm rounded-md 
            ${message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-green-600"}`}>
                <p>{message.from}: {message.body}</p>

              </li>
            ))}
          </ul>
     
          </div>
          <h3 className='text-4 font-bold flex items-center justify-center'>Marco Lorenzana</h3>
      </form>
    </div>
  );
}

export default App;
