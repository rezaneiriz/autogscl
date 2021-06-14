const express = require('express');
const ejs = require('ejs');
const app = express();
const server = require('http').createServer(app);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public/'));


app.get('/', (req, res)=>{
    res.render('pages/home');
});

app.use((req, res, next) => {
    res.render("pages/notFound");
});

server.listen (8080, ()=>{
    console.log('Listening to port 3000');
});