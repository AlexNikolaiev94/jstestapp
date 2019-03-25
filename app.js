const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./db/db.json');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(
    '/static', 
    express.static(path.join(__dirname, 'public'))
);

app.get('/collections/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const collection = db.collections.find(item => item.id === id);
    res.render('index', {collection: collection});
});

app.delete('/collections/:id/items', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const collection = db.collections.find(item => item.id === id);
    collection.items.forEach(n => {
        if (req.body.items.includes(n.id)) {
            collection.items.splice(n, 1);
        }
    });
    res.json({status: 200, message: 'success'});
});

app.listen(1337, () => console.log('Listening on 1337'));
