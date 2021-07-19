const express = require('express');
const ejs = require('ejs');
const app = express();
const server = require('http').createServer(app);
const request = require('request');
const csurf = require('csurf');
const cmudict = require('cmu-pronouncing-dictionary');
const ipa = require('./dict.js');
app.set('view engine', 'ejs');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res)=>{
    res.render('pages/index');
})
app.get('/record', (req, res) => {
    res.render('pages/home');
});
app.get('/upload', (req, res)=>{
    res.render('pages/fileUpload');
})

app.post('/sendthis', (req, res) => {
    var mywords = req.body.text.toLowerCase().split(/\s+/);
    var mytrascript = [];

    var interim = '';
    var phones = [];
    for (var i = 0; i < mywords.length; i++){
        
        interim = cmudict[mywords[i]].replace(/[^a-zA-z\s']/g, '');
        console.log(interim);
        phones = interim.split(' ');
        for (j = 0; j< phones.length; j++){
            phones[j] = ipa[phones[j]];
        }
        mytrascript.push(phones.join(' '));
    }

    // Set the headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    // Configure the request
    var options = {
        url: 'http://localhost:8080/mpd/get_mpd_result',
        method: 'POST',
        headers: headers,
        form: { 'wav': req.body.wave, 'text': req.body.text }
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(JSON.stringify(body));
            
            res.send({ feedback: body});
        }
        else{
            console.log(error);
        }
    })
})
app.use((req, res, next) => {
    res.render("pages/notFound");
});


server.listen(3000, () => {
    console.log('Listening to port 3000');
});

var mytrascript = [];
var mywords = 'Hello horse';
var mywords = mywords.toLowerCase().split(/\s+/);