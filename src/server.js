// função que chama o express e guarda na variável express
const express = require("express")
const server = express()

const db = require("./database/db")

//pasta public
server.use(express.static("public"))

//habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))

// utilizando templete engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/pages", {
    express: server,
    noCache: true
})

// página inicial
// req: requisição/pergunta; res: resposta
server.get( "/", (req, res) => {
    return res.render("index.html")
})

server.get( "/create-point", (req, res) => {
    // req.query: Query Strings da url ex..?..=
    // console.log(req.query)

    return res.render("create-point.html")
})

server.post( "/savepoint", (req, res) => {
    // req.body: o corpo do formulário
    // console.log(req.body)

    // inserindo
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})

server.get( "/search", (req, res) => {
    const search = req.query.search
    // pesquisa vazia
    if(search == "") {
        return res.render("search-results.html", { total: 0 })
    }

    //pegar do bd
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar no html com os dados do db
        return res.render("search-results.html", { places: rows, total: total })
    })
})

//ligar o servidor
server.listen(3000)