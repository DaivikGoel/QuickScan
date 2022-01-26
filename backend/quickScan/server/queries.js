const Pool = require('pg').Pool
const formidable = require("formidable");

const pool = new Pool({
  user: 'admin',
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

const getCollectionsById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM collection WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createCollection = (request, response) => {
    const form = new formidable.IncomingForm();

    // Parsing
    form.parse(req, async (err, fields, files) => {
        console.log(fields);
        console.log(files);
        if (err) {
        console.log("Error parsing the files");
        return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
        });
        }
    });
    response.status(200)
    // const { user_id, email } = request.body
  
    // pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    //   response.status(201).send(`User added with ID: ${result.insertId}`)
    // })
  }

module.exports = {
    getCollections,
    getCollectionsByAuthor,
    getCollectionsById,
    createCollection
}