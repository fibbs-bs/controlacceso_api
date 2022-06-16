queryset = {
    "sala": {
        "getNombre": "select nombre from sala where codigo = X",
        "getAll": "select * from sala"
    },
    "planificacion":{
        "insert":"insert into planificacion (bloque_horario,codigo_sala) values ('X',Y)"
    }
}