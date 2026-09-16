import { useState } from 'react'
import { UserContext } from './GlobalContext'

export function UserProvider({ children }) {
  const [users, setUsers] = useState([])
 
   const validarUsuario = (name, email, pass) => {
     if (!name.trim()) {
       alert('El nombre no puede estar vacío')
       return false
     }
     if (!email.trim()) {
       alert('El correo no puede estar vacío')
       return false
     }
     if (!pass.trim()) {
       alert('La contraseña no puede estar vacía')
       return false
     }
     return true
   }
 
   const getUsers = async () => {
     let res = await fetch('http://localhost:5000/api/users', {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
         'authorization': sessionStorage.getItem('conote_token_session')
       }
     });
     res = await res.json();
 
      console.log(res)
      let fecthusers = []
      console.log(Array.isArray(res))
      if(Array.isArray(res)) {
        fecthusers = res
      }
      console.log(fecthusers)
      setUsers(fecthusers);
   }
 
   const addUser = async (usuario) => {
     if (!validarUsuario(usuario.name, usuario.email, usuario.password)) return;
 
     await fetch('http://localhost:5000/api/users', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'authorization': sessionStorage.getItem('conote_token_session')
       },
       body: JSON.stringify(usuario)
     }); 
     getUsers();
   }
 
   const updateNote = async (id, updatedData) => {
     await fetch(`http://localhost:5000/api/users/${id}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'authorization': sessionStorage.getItem('conote_token_session')
       },
       body: JSON.stringify(updatedData)
     });
     getUsers();
   }
 
   const value = {
     users,
     getUsers,
     addUser,
     updateNote
   }
 
   return (
     <UserContext.Provider value={value}>
       {children}
     </UserContext.Provider>
   )
 }