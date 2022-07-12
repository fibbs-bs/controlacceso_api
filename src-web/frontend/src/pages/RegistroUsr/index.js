import React, { useState } from 'react'
import { Grid, Container, Paper, Avatar, Typography, Button, TextField} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {  LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { useAuth } from '../../Context/AuthContext'
import { Link, } from 'react-router-dom'
import { ListItemText } from '@mui/material'
import swal from 'sweetalert'
import axios from 'axios';


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
        margin: theme.spacing(6),
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
       
    },
    form:{
        width: '100%',
        marginTop: theme.spacing(1)
    },
    button:{
        margin: theme.spacing(3, 0, 2) //mrgen general
        
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


export default function Login() {
    const classes = useStyles ()
    const [data, setData] = useState ([])
    const [regUsr, setRegUsr] = useState({
        nombre:'',
        rut:'',
        correo:''
    })

    const handleChange = e => {
        const {name,value} = e.target;
        if (name !== ''){
            setRegUsr(prevState => ({
                ...prevState,
                [name]:value
            }))
        }
    }
    

    const registroUsuario = async () =>{
        console.log(regUsr)
        await axios.post('http://localhost:4000/api/registrarUsuario',regUsr)
        .then(response =>{
            console.log(response.status)
            if (response.status === 200){
                mostrarAlertaRegistroCorrecto()
                setTimeout(() =>  {window.location.reload(false)}, 2000);
            }
           

        })
        .catch(error => {
            console.log(error.request.status)
            
            if (error.request.status === 406){
                console.log("Usuario ya registrado")
                mostrarAlertaUsuarioRegistrado();
                setTimeout(() =>  {window.location.reload(false)}, 2000);
                //mostrarAlertaUsuarioRegistrado()
            }
            else{
                mostrarServerError()
            }
        })
    }
    
    
    const mostrarAlertaRegistroCorrecto = () =>{
        swal({
            title:'Registrado correctamente!',
            icon:'success'
        })
    }

    const mostrarAlertaUsuarioRegistrado = () =>{
        swal({
            title:'Usuario ya registrado',
            text:'Rut del usuario ya estaba en nuestra base de datos',
            icon:'warning'
        })
    }

    const mostrarServerError = () => {
        swal({
            title: 'SERVER ERROR',
            icon: 'error'
        })
    }
    return (
        <div>
            
            <Grid container component ='main' className={classes.root}>
                <Container component={Paper} elevation={5} maxWidth = 'xs' className = {classes.container}> 
                    <div className = {classes.div}>
                       
                        
                        <Avatar className = {classes.avatar} > 
                            <LockOutlinedIcon / /*ICONO DE CANDADO*/> 
                        </Avatar>
                        <Typography component = 'h1' variant = 'h4'> Control de Acceso </Typography>
                        
                        <form className = {classes.form} >  
                            <br/>
                            <TextField //input de usuario
                                name = 'nombre'
                                variant = 'outlined'
                                color = 'secondary'
                                fullWidth
                                required
                                autoFocus //enfocado en input de usuario
                                label = 'Nombre'
                                onChange={handleChange}
                            />
                            <br/>
                            <br/>
                            <TextField
                                name = 'rut'
                                variant = 'outlined'
                                color = 'secondary'
                                fullWidth
                                required
                                autoFocus //enfocado en input de usuario
                                label = 'Rut'  
                                onChange={handleChange}     
                            />
                            <br/>
                            <br/>
                            <TextField
                                name = 'correo'
                                variant = 'outlined'
                                color = 'secondary'
                                fullWidth
                                required
                                autoFocus //enfocado en input de usuario
                                label = 'Correo'    
                                type = 'email'
                                onChange={handleChange}   
                            />
                            <br  /><br />   
                            <Button 
                                className = {classes.button}
                                //type = 'submit'
                                variant = 'contained'
                                fullWidth
                                onClick={() => registroUsuario()}
                            >
                                Registrarse
                            </Button>  
                            <Link style={{ textDecoration: 'none' }}  color='inherit' to ='/loginAdmin'>
                                <Button
                                    className= {classes.button}
                                    variant = 'contained'
                                    fullWidth
                                    
                                >
                                    Soy un administrador
                                </Button>
                            </Link>
                            <br  /><br />  
                        </form>
                    </div>
                </Container>
 
            </Grid>
            <br></br>
        </div>
    )
}