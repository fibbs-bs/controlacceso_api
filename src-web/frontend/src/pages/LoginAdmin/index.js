import React, { useState } from 'react'
import { Grid, Container, Paper, Avatar, Typography, Button, TextField} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {  LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { useAuth } from '../../Context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { ListItemText } from '@mui/material'
import swal from 'sweetalert'


const useStyles = makeStyles(theme=>({
    root:{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100v',
        

        
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
        marginTop: theme.spacing(1),
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
    const { login } = useAuth(); //esta funcion viene de /context/AuthContext
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const classes = useStyles();
    const navigate = useNavigate();

    const handleEmail = (event) => setEmail(event.target.value) //el email se setea deacuerdo al valor que ingrese en el input
    const handlePassword = (event) => setPassword(event.target.value) //la password se setea deacuerdo al valor que ingrese en el input

    
    const handleSubmit = async(event) => { //usaremos login, que es asincrona por eso colocamos asyn en esta funcion
        event.preventDefault();

        try{
            await login(email, password)
            // navigate nos envia a home luego de iniciar sesion validamente
            navigate('/historialAccesos') 
        }catch (error){
            //setError('Datos incorrectos');
            swal({
                title: 'Error',
                text: 'Datos incorrectos',
                icon: 'error'
            })
            setTimeout (()=> setError(''), 2500) //se setea el error a un string vacio dps de 1500ms
        }
    }
    

    return (
        <div>
            
            <Grid container component ='main' className={classes.root}>
                <Container component={Paper} elevation={5} maxWidth = 'xs' className = {classes.container}> 
                    <div className = {classes.div}>
                        {error && <p className= 'error'>{error}</p>}
                        
                        <Avatar className = {classes.avatar} > 
                            <LockOutlinedIcon / /*ICONO DE CANDADO*/> 
                        </Avatar>
                        <Typography component = 'h1' variant = 'h4'> Administradores </Typography>
                        
                        <form className = {classes.form} onSubmit = {handleSubmit}>  
                            <br/>
                            <TextField //input de usuario
                                variant = 'outlined'
                                color = 'secondary'
                                fullWidth
                                required
                                autoFocus //enfocado en input de usuario
                                label = 'Correo '
                                type = 'email'
                                onChange = {handleEmail}
                            />
                            <br/>
                            <br/>
                            <TextField
                                variant = 'outlined'
                                color = 'secondary'
                                fullWidth
                                required
                                autoFocus //enfocado en input de usuario
                                label = 'Contraseña'
                                type = 'password' //eso encripta la password por pantalla
                                onChange = {handlePassword}         
                            />
                            <Button
                                type = 'submit'
                                value = 'Login'
                                fullWidth
                                variant = 'contained'
                                className = {classes.button}
                            >
                                Ingresar
                            </Button>    
                            <Link style={{ textDecoration: 'none' }}  color='inherit' to = '/'>
                                <Button
                                    fullWidth
                                    variant = 'contained'
                                    className = {classes.button}
                                >
                                    Atras
                                </Button>   
                            </Link>
                            {/*
                            <Link to = '/signupclub'>
                                <ListItemText secondary = 'Crear cuenta' className= {classes.text}/>
                            </Link>   
                            <Link to = '/forgotpassword'>
                                <ListItemText secondary = 'Recuperar contraseña' className= {classes.text2}/>
                            </Link> */    }
                            <br  /><br />          
                        </form>
                    </div>
                </Container>
 
            </Grid>
        </div>
    )
}