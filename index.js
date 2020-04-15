const restify = require('restify')
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'db'
    }
})

const server = restify.createServer({
    name: "myapp",
    version: "1.0.0"
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/all', async (req, res, next) => {
    const tasks = await knex('task');
    res.send(tasks);
})

server.post('/save', async (req, res) => {
    if (req.body.id) {
        let task = {
            ...req.body
        };
        delete task.id;
        await knex('task')
            .where({ id: req.body.id })
            .update(task);
        res.send("OK");
    } else {
        await knex('task')
            .insert({
             ...req.body
        });
        res.send("OK");
    }
})

server.post("/delete", async (req, res) => {
    await knex('task')
        .where({ id: req.body })
        .del();
    res.send("OK")
})

server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    default: 'index.html',
}));


server.listen(8080, function () {
    console.log("%s Ouvindo a porta %s", server.name, server.url)
})