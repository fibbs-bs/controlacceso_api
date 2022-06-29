const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")

const userRoutes = require("./routes/user.routes");


const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());


app.use("/api",userRoutes);















app.get('/',function(req,res){
    res.send('<h1>Hola mundo</h1>');
    res.end();
});

app.listen(4000,() => {
    console.log("Started on PORT 4000");
});

