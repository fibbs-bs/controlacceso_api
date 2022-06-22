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
        "insert":"insert into planificacion (id,bloque_horario,codigo_sala) values ('XY','X',Y)",
        "delete":"delete from planificacion where bloque_horario = 'X'"
    },
    "persona":{
        "create":"create table persona(rut text primary key,uid text);"
    },
    "acceso":{
        'create':'create table acceso(id serial primary key,id_planificacion text not null,rut_persona text not null,foreign key (id_planificacion) references planificacion(id) on delete cascade);',
        'insertP':"insert into acceso (id_planificacion,rut_persona) values ('X','Y')",
        'insertQ':"insert into acceso (id_planificacion,rut_persona)) values ('X',(select rut from persona where uid = 'Y'))",
        'select':"select uid "
    }
}