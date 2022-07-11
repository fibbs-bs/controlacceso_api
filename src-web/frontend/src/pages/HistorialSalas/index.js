import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { makeStyles, Button, TextField, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, } from '@material-ui/core';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BackdropFilter from "react-backdrop-filter";
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const useStyles = makeStyles ((theme) => ({
    icons: {
        cursor: 'pointer'
    },
    inputMaterial:{
        width: '100%'
    },
    text:{
        fontFamily: 'oswald',
    },
    text2:{
        textAlign : 'left',
        marginLeft: '20px'
    },
    button:{
        width: '10%',
        //margin: theme.spacing(10,65,10),
        marginTop: theme.spacing(2) ,
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        marginBottom: theme.spacing(2),
        
        [theme.breakpoints.down(400 + theme.spacing(2)+2)]:{
            margin: theme.spacing(0),
            width: '100%',
            height: '100%'
        }
    },
  
}))


export default function HistorialSalas(){
    const classes = useStyles ()
    const [data, setData] = useState ([])
    const [error, setError] = useState ('');
    const { logout } = useAuth(); //esta funcion viene de /context/AuthContext

    const getHistorial = async() =>{
        await axios.get('http://localhost:4000/api/getHistorial')
        .then(response =>{
            setData(response.data)
        })
    }
    useEffect(() => {
        getHistorial()
    },[])

    const handleLogout = async () => {
        try{
            await logout();
        } catch (error){ 
            setError('Server Error')
        }
    }


    return(
      
        <div align = 'center'>
            <div align = 'right'>
                <Link style={{ textDecoration: 'none' }}  color='inherit' to ='/controlAcceso'>
                    <Button
                        className= {classes.button}
                        type = "button"
                        variant = 'contained'
                        size = 'large'
                    >
                        Control acceso
                    </Button>
                </Link>
                <Button
                    className= {classes.button}
                    type = "button"
                    variant = 'contained'
                    onClick = {handleLogout}
                    endIcon = {<LogoutIcon/>}
                >
                    Logout
                </Button>
            </div>
            <Box
                sx = {{
                    width:{
                        xs: 300,
                        sm: 400,
                        md: 600,
                        lg: 800,
                        xl: 1200,
                    }
                    }}
                color = 'contrastText'
                
                mx = {25} //margen a todos los lados
                border = {1}
                borderColor = '#adc178'
                marginTop = {'30px'}
            >
                <BackdropFilter
                    className="bluredForm"
                    filter={"blur(5px)"}
                    html2canvasOpts={{
                        allowTaint: true
                    }}
                    onDraw={() => {
                        console.log("Rendered !");
                    }}
                >
                    <h2 style={{color:'white'}}>Historial de Accesos</h2>
                    <TableContainer>
                        <Table  id = 'tables'>
                            <TableHead>
                                <TableRow>
                                    <TableCell align = 'center' style={{color:'white'}}>Sala</TableCell>
                                    <TableCell align = 'center' style={{color:'white'}}>Rut Usuario</TableCell>
                                    <TableCell align = 'center' style={{color:'white'}}>Bloque</TableCell>
                                    <TableCell align = 'center' style={{color:'white'}}>Hora Inicio</TableCell>
                                    <TableCell align = 'center' style={{color:'white'}}>Hora Termino</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {data.map(historial => (
                                    <TableRow sx={{ '&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell align = 'center' style={{color:'white'}}>{historial.sala}</TableCell>
                                        <TableCell align = 'center' style={{color:'white'}}>{historial.rut_usuario}</TableCell>
                                        <TableCell align = 'center' style={{color:'white'}}>{historial.bloque}</TableCell>
                                        <TableCell align = 'center' style={{color:'white'}}>{historial.inicio}</TableCell>
                                        <TableCell align = 'center' style={{color:'white'}}>{historial.fin}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </BackdropFilter>
            </Box>

        </div>
    );
}

