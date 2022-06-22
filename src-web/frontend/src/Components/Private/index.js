import React from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';


export default function PrivateRoute() {
    const { currentUser } = useAuth(); //usuario actual, se obtiene desde useAuth
    return (
        currentUser?<Outlet/>:<Navigate to='/loginAdmin'/>
    )
}
