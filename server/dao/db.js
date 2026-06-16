import sqlite from 'sqlite3'

const db = new sqlite.Database('./database/lastRace.sqlite', (err) => {
    if (err){
        console.log(`Connection Error: ${err.message}`)
    }
    else{
        console.log('Database successfully connected')
    }
})

export default db;