const { Pool } = require('pg');
const config = require('../config.json');
const conectionStr = config.dbUri;

const pool = new Pool({
    connectionString: conectionStr,
    ssl: {rejectUnauthorized: false}
})

pool.connect().then(()=>{
    console.log('DB connect')
})
.catch((
    err => console.log(err)
))

module.exports = pool
