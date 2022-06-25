queryset = {
    "sala": {
        'select': 'select * from sala',
        "getNombre": "select nombre from sala where codigo = X",
        "insert": "insert into sala values (x,y)"
    },
    "horario": {
        "insert": "insert into horario values (x,y,z)",
        "select": "select * from horario"
    }
    ,
    "planificacion":{
        'create':'create table planificacion(id text primary key,bloque varchar(4) not null,sala int not null,foreign key (bloque) references horario(bloque));',
        "select":"select * from planificacion",
        "insert":"insert into planificacion (id,bloque,sala) values ('{}','{}',{}){}",
        "delete":"delete from planificacion where id = '{}'{}{}{}"
    },
    "persona":{
        "create":"create table persona(rut text primary key,uid text);",
        "select":"select * from persona",
        "insert":"insert into persona (rut,uid) values ('{}','{}'){}{}"
    },
    "acceso":{
        'create':'create table acceso(id text primary key,id_planificacion text not null,rut text not null,foreign key (id_planificacion) references planificacion(id) on delete cascade,foreign key (rut) references persona(rut));',
        'insert':"insert into acceso values ('{}','{}','{}'){}",
        'delete':"delete from acceso where id = '{}'{}{}{}",
        'checkAccess':"select rut from acceso inner join persona on acceso.rut_persona = persona.rut inner join planificacion on planificacion.id = acceso.id_planificacion where persona.uid = '{}' and planificacion.bloque_horario = '{}' and planificacion.codigo_sala = {};",
        'select':"select * from acceso"
    }
}