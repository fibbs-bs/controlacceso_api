import React, { createContext, useState, useEffect, useContext } from 'react'
import { auth } from '../Initializers/firebase';

/**
 * AuthContext.provider tiene un prop llamado value, donde encierra todas aquellas variables
 * y funciones que pueden ser accedidas desde otro componente
 * 
 *  const signup => para registrar usuarios, pide correo y contrasenia, retorna auth.createUserWithEmailAndPassword(email,password), funcion que creo usuario con correo y contrasenia
 *  const login => para iniciar sesion pide correoo y contrasenia, retorna auth.signInWithEmailAndPassword(email, password)
 *  const logout 
 *  para que estas opciones esten disponibles en el provider deben estar incluidas en el objeto value
 */

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider(props) {
    
    const [currentUser, setCurrentUser] = useState({});
    

    useEffect(() =>{
        auth.onAuthStateChanged((user)=>{ //observa cambios en el usuario (inicio o termino de sesion), si esque existe un usuario cambia la variable current user
            setCurrentUser(user); 
        })
    },[])

    const signup = (email, password) =>{
        return auth.createUserWithEmailAndPassword(email,password)
    };
    const login = (email,password) =>{
        return auth.signInWithEmailAndPassword(email, password)
    };
    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email)
    };
    const logout = () => auth.signOut();
    const value = { signup, login, logout, currentUser, resetPassword };
    return (
        <div>
            <AuthContext.Provider value={value}>
                { props.children }
            </AuthContext.Provider>
        </div>
    )
}