const express = require('express');
const bodyParser = require('body-parser');
const app = express();


//const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://robot:eparao20@crud-nodejs-lv9tf.azure.mongodb.net/test?retryWrites=true&w=majority";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://1700631:Y71lw8JmlaiBeW5AX9DYk7yeYyc5Lig1bdO3ggXhayyHVEz1D6alfl6HhLsVAxJRqoJx3vvCCHnNdf3yV3tMyQ==@1700631.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";


const client = new MongoClient(uri, { useNewUrlParser: true });

var ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.urlencoded({ extended: true }));

//CONECÇÃO COM A BASE DE DADOS
client.connect(err => {
    db = client.db("mongodb").collection("clientes");
    ut = client.db("mongodb").collection("Utilizadores");

    app.listen(8000,function(){
        console.log('Servidor em execução no porto 8000');
    });
});


app.set('view engine', 'ejs');


//GET method
app.route('/')
.get((req, res) => {
    res.render('login.ejs');
})
.get((req, res) => {
    const cursor = ut.find();
});

//layout
app.route('/layout')
.get((req, res) => {
    res.render('layout.ejs');
})

//Login
app.route('/login')
.get((req, res) => {
    ut.find().toArray((err, results) => {
    	if (err) return console.log("Error: " + err);
	res.render('login.ejs', { Utilizadores: results });
    });
})
.post((req, res) => {
    var Username = req.body.Username;
    var Password = req.body.Password;

    ut.findOne(Username,Password, (err, result) => {
        if (err) return console.log("Error: " + err);
        console.log("Login feito");
        res.redirect('/create'); 
    });
});

//Register
app.route('/register')
.get((req, res) => {
    ut.find().toArray((err, results) => {
    	if (err) return console.log("Error: " + err);
	res.render('register.ejs', { Utilizadores: results });
    });
})
.post((req, res) => {
    ut.insertOne(req.body, (err, result) => {
        if (err) return console.log("Erro: " + err);
    
        console.log("Registo guardado com sucesso na BD!");
        res.redirect('/login');
    });
});

//CREATE
app.route('/create')
.get((req, res) => {
    db.find().toArray((err, results) => {
    	if (err) return console.log("Error: " + err);
	res.render('create.ejs', { clientes: results });
    });
})
.post((req, res) => {
    db.insertOne(req.body, (err, result) => {
        if (err) return console.log("Erro: " + err);
    
        console.log("Registo guardado com sucesso na BD!");
        res.redirect('/create');
    });
});


//EDIT
app.route('/edit/:id')
.get((req,res) => {
    var id = req.params.id;

    db.find(ObjectId(id)).toArray((err, result) => {
        if (err) return console.log("Error: " + err);
    	res.render('update.ejs', { clientes: result });
    });
})
.post((req,res) => {
    var id = req.params.id;
    var nome = req.body.nome;
    var marca = req.body.marca;
    var matricula = req.body.matricula;

    db.updateOne({_id: ObjectId(id)}, {
        $set: {
	    Nome: nome,
	    MarcaCarro: marca,
	    Matricula: matricula   	
	}
    }, (err, result) => {
    	if (err) return res.send(err);
        res.redirect('/create');
	    console.log("Registo atualizado com sucesso!");
    })
});

//DELETE
app.route('/delete/:id')
.get((req,res) => {
    var id = req.params.id;

    db.deleteOne({_id: ObjectId(id)}, (err, result) => {
    	if (err) return res.send(500, err);
	console.log("Registo eliminado com sucesso!");
	res.redirect('/create');
    });
});

