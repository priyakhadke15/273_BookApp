//import express module 
var express = require('express');
//create  an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

//Only user allowed is admin
var Users = [{
    "username": "admin",
    "password": "admin"
}];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('/home');
    } else
        res.render('login', { loginError: false });

});

app.post('/login', function (req, res) {
    if (req.session.user) {
        res.render('/home');
    } else {
        console.log("Inside Login Post Request");
        console.log("Req Body : ", req.body);
        Users.filter(function (user) {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/home');
            }
            else {
                // var loginError = true;
                res.render('login', { loginError: true });

            }

        })
    }

});

app.post('/create', function (req, res) {
    var bookID = req.body.BookID;
    var found = false;
    if (req.session.user) {

        for (var i = 0; i < books.length; i++) {
            if (books[i].BookID == bookID) {
                found = true;
                break;
            }
        }
        if (found == true) {
            res.render('create', { message: "Book ID already exist" });
            console.log("Book ID already exist ");
        }
        else { //add the book
            var newBook = {
                "BookID": req.body.BookID,
                "Title": req.body.BName,
                "Author": req.body.BAuth
            };
            books.push(newBook);
            res.render('create', { message: "New Book Created" });
        }
    }
    else {
        res.render('login', { loginError: false });
    }
});

app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books
        });
    }

});

app.get('/delete', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete');
    }
});
app.get('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create', { message: "" });
    }

});

app.delete('/delete', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        var id = req.query.DelID;

        var found = false;
        for (var i = 0; i < books.length; i++) {
            if (books[i].BookID == id) {
                found = true;
                break;
            }
        }
        if (found) {
            console.log("book found at index ", i);
            books.splice(i, 1);
            res.json({ message: "book deleted!" });
        } else {
            res.json({ message: "Book doesnt exsist" });
        }

    }
})

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");

});