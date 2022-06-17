queryset = {
    "sala": {
        'create': '',
        "getNombre": "select nombre from sala where codigo = X",
        "getAll": "select * from sala",
        "insert": "insert into sala values (x,y)"
    },
    "horario": {
        "insert": "insert into horario values (x,y,z)"
    }
    ,
    "planificacion":{
        'create':'create table planificacion(id text primary key,bloque_horario varchar(4) not null,codigo_sala int not null,foreign key (bloque_horario) references horario(bloque),foreign key (codigo_sala) references sala(codigo));',
        "insert":"insert into planificacion (bloque_horario,codigo_sala) values ('X',Y)",
        "delete":'delete from planificacion where bloque_horario = "X"'
    },
    "acceso":{
        'create':'create table acceso(id serial primary key,id_planificacion text not null,rut_persona text not null,foreign key (id_planificacion) references planificacion(id));'
    }
}