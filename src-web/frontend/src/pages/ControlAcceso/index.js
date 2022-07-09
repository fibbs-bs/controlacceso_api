import React, { useState } from 'react'
import { Grid, Container, Paper, Avatar, Typography, Button, TextField} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {  LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import axios from 'axios';
import { Link, useHistory} from 'react-router-dom'
import { ListItemText } from '@mui/material'

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
        backgroundColor: theme.palette.primary.main
       
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


export default function ControlAcceso(){
    const classes = useStyles();
    return(
        <div>
            <Grid container component ='main' className={classes.root}>
                <Container component={Paper} elevation={5} maxWidth = 'xs' className = {classes.container}>
                    <div className = {classes.div} align = 'center'> 
                        <form className = {classes.form} >
                            <div className='form-group'>
                                <select className='form-control'>
                                    <option>Salas</option>
                                </select>
                                <br></br><br></br>
                                <select>
                                    <option>Bloque</option>
                                </select>
                            </div>
                            
                        </form>
                    </div>
                </Container>
            </Grid>
        </div>
    )
}