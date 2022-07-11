import React, { useState, useEffect } from 'react'
import { Grid, Container, Paper, Avatar, Typography, Button, TextField} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {  LockOutlined as LockOutlinedIcon} from '@material-ui/icons'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, } from 'react-bootstrap';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';


const useStyles = makeStyles(theme=>({
    root:{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100v'

        
    },
    container:{
        opacity: '0.8',
        height: '80%', //largo del contenedor
        marginTop: theme.spacing(10), //altura del contenedor
        [theme.breakpoints.down(400 + theme.spacing(4)+4)]:{ //responsive
            marginTop: 0,
            width: '100%',
            height: '100%'
        }
    },
    div:{
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'

    },
    avatar:{
        margin: theme.spacing(4),
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
       
    },
    form:{
        width: '100%',
        marginTop: theme.spacing(1)
    },
    button:{
        margin: theme.spacing(3, 0, 2),
        marginLeft: 20
    },
    button1:{
        margin: theme.spacing(3, 0, 2), //mrgen general
        backgroundColor: 'green'
    },
    button2:{
        margin: theme.spacing(3, 0, 2), //mrgen general
        backgroundColor: 'red'
    },
    text:{
        marginLeft: 155,
        marginTop: 30
    },
    text2:{
        marginLeft: 128,
        marginTop: 30
    }

}))


export default function ControlAcceso(){
    const classes = useStyles();
    const [salas, setSalas] = useState([])
    const [bloques, setBloques] = useState([])
    const [ruts, setRuts] = useState([])
    const [salaSeleccionada, setSalaSeleccionada] = useState(null)
    const [rutSeleccionado, setRutSeleccionado] = useState(null)
    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null)

    const getSalas = async () =>{
        await axios.get('http://localhost:4000/api/getSalas')
        .then(response =>{
            //console.log(response)
            setSalas(response.data)
        })
        .catch((e) => console.log(e))
    }

    const getBloques = async () =>{
        await axios.get('http://localhost:4000/api/getBloques')
        .then(response =>{
            setBloques(response.data)
        })
        .catch((e) => console.log(e))
    }

    const getRuts = async () =>{
        await axios.get('http://localhost:4000/api/getRuts')
        .then(response =>{
            setRuts(response.data)
        })
        .catch((e) => console.log(e))
    }
    
    const darAcceso = async () =>{
        await axios.post ('http://localhost:4000/api/darAcceso', {sala: salaSeleccionada, bloque: bloqueSeleccionado, rut: rutSeleccionado})
        .then(response =>{
            if(response.status === 200){
                console.log('Acceso generado')
            }
            else if (response.status === 404){
                console.log('Usuario ya posee acceso previo a la sala y bloque seleccionados')
            }else{
                console.log("Error del servidor")
            }
        })
        .catch((e) => console.log(e))
    }


    const rechazarAcceso = async () =>{
        await axios.post ('http://localhost:4000/api/delAcceso', {sala: salaSeleccionada, bloque: bloqueSeleccionado, rut: rutSeleccionado})
        .then(response =>{
            if(response.status === 200){
                console.log('Acceso eliminado')
            }
            else if (response.status === 404){
                console.log('No existe dicho acceso de usuario')
            }else{
                console.log("Error del servidor")
            }
        })
        .catch((e) => console.log(e))
    }

    const changeSalaSeleccionada= (e) =>{
        const value = e.target.value;
        setSalaSeleccionada(value)
    }
    const changeBloqueSeleccionado = (e) =>{
        const value = e.target.value;
        setBloqueSeleccionado(value)
    }
    const changeRutSeleccionado = (e) => {
        const value = e.target.value;
        setRutSeleccionado(value)
    }

    useEffect (() => {

        getSalas()
        getBloques()
        getRuts()
    },[])

    return(
        <div>
            
            <Link style={{ textDecoration: 'none' }}  color='inherit' to ='/historialAccesos'>
                <Button
                    className= {classes.button}
                    type = "button"
                    variant = 'contained'
                    endIcon = {<KeyboardReturnIcon/>}
                    
                >
                    Atras
                </Button>
            </Link>
        
            <Grid container component ='main' className={classes.root}>
                <Container component={Paper} elevation={5} maxWidth = 'xs' className = {classes.container}>
                    <div className = {classes.div} align = 'center'> 

                         <Avatar className = {classes.avatar} sx={{ width: 56, height: 56 }} > 
                            <LockOutlinedIcon / /*ICONO DE CANDADO*/> 
                        </Avatar>
                        <br></br><br></br>
                        <Typography component = 'h1' variant = 'h4'> Administrar Accesos </Typography>
                        <br></br>
                        <form className = {classes.form} >
                            <Form.Control column sm = {15} as = 'select' onClick = {getSalas} onChange = {changeSalaSeleccionada}>
                                <option value ="" hidden > Salas </option>
                                {salas.data?.map(sala => (
                                    <option key = {sala.sala} value = {sala.sala}>{sala.nombre_sala}</option>
                                    
                                ))}
                            </Form.Control>
                            <br></br><br></br>
                            <Form.Control column sm = {15} as = 'select' onClick = {getBloques} size = "lg" onChange = {changeBloqueSeleccionado}>
                                <option value ="" hidden> Bloques </option>      
                                {bloques.data?.map(bloque =>(
                                    <option key = {bloque.bloque} value = {bloque.bloque}> {bloque.bloque} </option>
                                ))}        
                            </Form.Control>
                            <br></br><br></br>
                            <Form.Control column sm = {15} as = 'select' onClick = {getRuts} onChange = {changeRutSeleccionado}>
                                <option value ="" hidden> Ruts </option>
                                {ruts.data?.map(rut => (
                                    <option key = {rut.rut} value = {rut.rut}> {rut.rut} </option>
                                ))}
                            </Form.Control>
                            <br></br><br></br><br></br><br></br>
                            
                        </form>
                        <Grid container>
                            <Grid item xs = {6}>
                                <Button align = 'center' className={classes.button1} size ='large' onClick = {() => darAcceso()}>Aprobar acceso</Button>
                            </Grid>
                            <Grid item xs = {6}> 
                                <Button align = 'center' className={classes.button2} size ='large' onClick = {() => rechazarAcceso()}>Denegar acceso</Button>
                            </Grid>
                        </Grid>    
                    </div>
                </Container>
                <br></br><br></br>
                
                
            </Grid>
          
            
        </div>
    )
}