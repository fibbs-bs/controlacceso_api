import React from 'react'
import { makeStyles, Button, TextField, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, } from '@material-ui/core';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BackdropFilter from "react-backdrop-filter";

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

    return(
      
        <div align = 'center'>
            <div align = 'right'>
                <Button
                    className= {classes.button}
                    type = "button"
                    variant = 'contained'
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
                //backgroundColor = '#D8F3DC'
                mx = {25} //margen a todos los lados
                //p = {30} //padding
                //borderRadius = '8px'
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
                    <h2>Historial de Accesos</h2>
                    <TableContainer>
                        <Table  sx = {{ minWidth: 650 }} id = 'tables'>
                            <TableHead>
                                <TableRow>
                                    <TableCell align = 'center'>Sala</TableCell>
                                    <TableCell align = 'center'>Rut Usuario</TableCell>
                                    <TableCell align = 'center'>Bloque</TableCell>
                                    <TableCell align = 'center'>Fecha Inicio</TableCell>
                                    <TableCell align = 'center'>Fecha Termino</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </BackdropFilter>
            </Box>

        </div>
    );
}

