const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'quickScan',
  password: 'password',
  port: 5432,
})

const getCollections = (request, response) => {
    pool.query('SELECT * FROM collection ORDER BY timestamp DESC', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}

const getCollectionsByAuthor = (request, response) => {
    pool.query('SELECT * FROM collection ORDER BY timestamp DESC', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}