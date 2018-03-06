var express = require('express');
var bodyparser = require('body-parser');
var nodemailer = require('nodemailer');
var session = require('express-session');
var mysql = require('mysql');

var app = express();
const  pageSize = 10;

app.set('view engine', 'pug');
app.use(session({
    secret: "crespotersLittleSecret",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyparser.json());


app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));

//SQL CONNECTION
var request;
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    port: 3306,
    database:"pensurvey"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("SQL DATABASE CONNECTED");
    app.listen(process.env.PORT | 3000,'0.0.0.0', () => {
        console.log("listening to port " + (process.env.PORT | 3000));
    });
});

//WEBSITE GETS
app.get('/', (req, res) => {
    ssn = req.session;
    res.sendFile("webpages/surveys.html", { root: 'public' });
});

app.get('/createSurvey', (req, res) => {
    ssn = req.session;
    res.sendFile("webpages/createSurvey.html", { root: 'public' });
})

app.get('/register', (req, res) => {
    ssn = req.session;
    if (ssn.userloggedin) {
        res.redirect('/');
    }
    res.sendFile("webpages/register.html", { root: 'public' });
});


//FOR TEST PURPOSES DELETE THESE
//TODO
//-------------------------------------SECURITY LEAK      FOR TEST-------------------------------------------
app.get('/allusers', (req, res) => {
    var sql = "SELECT * FROM user";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
//END SECURITY LEAK
//USER RELATED ##############################################################################################################
app.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var sql = "SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        if (result.length <= 0) {
            sql = "SELECT * FROM user WHERE username='" + username + "'";
            con.query(sql, function (errUser, resultUser, fieldsUser) {
                if (errUser) throw err;
                if (resultUser.length > 0) {
                    res.json({ usernameValid: false, passwordValid: false });
                }
                else {
                    res.json({ usernameValid: true, passwordValid: false });
                }
            });
        }
        else {
            res.json({ usernameValid: true, passwordValid: true });
        }
    });
});


//QUESTIONNAIRE RELATED ###################################################################################################

app.get("/api/getquestionnaire/createdByUser/running/:userid", (req, res) => {

    var sql = "SELECT * FROM questionnaire WHERE running = 0 AND creator_id = " + req.params.userid;
    con.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get("/api/getquestionnaire/createdbyuser/expired/:userid", (req, res) => {

    var sql = "SELECT * FROM questionnaire WHERE running = 1 AND creator_id = " + req.params.userid;
    con.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get("/api/getquestionnaire/foruser/:userid", (req, res) => {

    var sql = "SELECT idquestionnaire,questionnaire.title,questionnaire.creator_id,questionnaire.running AS idquestionnaire, title, creator_id, running FROM questionnaire JOIN question JOIN response WHERE questionnaire.idquestionnaire = question.questionnaire_id AND response.question_id = question.idquestion AND response.question_id = " + req.params.userid;
    con.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});


app.get("/api/getquestions/:id",(req, res)=>{
    var sql = "SELECT * FROM question WHERE questionnaire_id = " + req.params.id;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/api/getchoices/:id", (req, res) => {
    var sql = "SELECT * FROM choices WHERE question_id = " + req.params.id;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});


//PERMISSIONS #############################################################################################################
app.get("/api/getpermissions/:userid", (req, res) => {
    var sql = "SELECT * FROM permissions WHERE user_id = " + req.params.userid;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
