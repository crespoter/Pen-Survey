var express = require('express');
var bodyparser = require('body-parser');
var nodemailer = require('nodemailer');
var session = require('express-session');
var mysql = require('mysql');
var moment = require('moment');
var app = express();
const  pageSize = 10;

app.set('view engine', 'ejs');

app.use(session({
    secret: "pensurvey",
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
    app.listen(process.env.PORT | 80,'0.0.0.0', () => {
        console.log("listening to port " + (process.env.PORT | 80));
    });
});


app.get('/', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin)
    {
        var sql = "SELECT * FROM questionnaire WHERE running =1 AND creator_id = " + ssn.userid;
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            res.render("pages/activesurveys.ejs", {questionnaires:result});
        });
    }
    else
        res.render('pages/login.ejs', { error: '' });
});

app.post('/', (req, res) => {
    ssn = req.session;
    var username = req.body.username;
    var password = req.body.password;
    var sql = "SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'";
    var status = false;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0)  
        {
            ssn.userLoggedin = true;
            ssn.username = result[0].username;
            ssn.userid = result[0].idUser;
            res.redirect('/');
        }
        else
        {
            var sql = "SELECT * FROM user WHERE username = '" + username + "'";
            con.query(sql, function (err, result, fields) {
                var message = "ERROR";
                if (err) throw err;
                if (result.length > 0)
                    message = "Password is Incorrect";
                else
                    message = "Username doesnt exist";
                res.render('pages/login.ejs', { error: message });
            });
        }
    });
});


app.get('/activesurveydetails', (req, res) => {
    ssn = req.session;
    var retJSON = {};
    if (ssn.userLoggedin) {
        var sql = "SELECT * FROM questionnaire WHERE idquestionnaire=" + req.query.id + " AND creator_id=" + ssn.userid;
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            retJSON.id = result[0].idquestionnaire;
            retJSON.title = result[0].title;
            retJSON.datetime = result[0].timestamppost;
            retJSON.note = result[0].note;
            var sql = "SELECT * FROM question,choices WHERE question.idquestion = choices.question_id AND question.questionnaire_id =" + retJSON.id;
            con.query(sql, function (err, result, fields) {
                retJSON.questions = {};
                for (var i = 0; i < result.length; i++)
                {
                    if (!retJSON.questions[result[i].idquestion])
                        retJSON.questions[result[i].idquestion] = {};
                    retJSON.questions[result[i].idquestion]['question_text'] = result[i].question_text;
                    retJSON.questions[result[i].idquestion].type = result[i].type;
                    if (retJSON.questions[result[i].idquestion].choices == undefined)
                    {   
                        retJSON.questions[result[i].idquestion].choices = {};
                    }
                    retJSON.questions[result[i].idquestion].choices[result[i].idchoices] = result[i].choice;
                }
                var sql = "SELECT * FROM question,response WHERE question.idquestion = response.question_id AND question.questionnaire_id = " + retJSON.id;
                con.query(sql, function (err, result, fileds) {
                    for (var i = 0; i < result.length; i++) {
                        if (!retJSON.questions[result[i].idquestion])
                            retJSON.questions[result[i].idquestion] = {};
                        retJSON.questions[result[i].idquestion]['response'] = {};
                        if (retJSON.questions[result[i].idquestion].response == undefined) {
                            retJSON.questions[result[i].idquestion].response = {};
                        }
                        retJSON.questions[result[i].idquestion].response[result[i].idresponse] = result[i].response;
                    }
                    console.log(retJSON);
                    res.render('pages/activesurveydetail.ejs', { data: retJSON });
                });             
            });
        });
    }
    else
        res.render('pages/login.ejs', { error: '' });
});

app.get('/expiredsurveys', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin) {
        var sql = "SELECT * FROM questionnaire WHERE running =0 AND creator_id = " + ssn.userid;
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            res.render("pages/expiredsurveys.ejs", { questionnaires: result });
        });
    }
    else
        res.render('pages/login.ejs', { error: '' });
});


app.get('/drafts', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.redirect('/');
    else {
        var sql = "SELECT * FROM drafts WHERE creator_id = " + ssn.userid;
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            res.render("pages/drafts.ejs", { drafts: result });
        });
    }
});

app.get('/createdraft', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.redirect('/');
    else {
        res.render('pages/createdraft.ejs', { error: '' });
    }
});




app.get('/logout', (req, res) => {
    ssn = req.session;
    ssn.userLoggedin = false;
    res.redirect('/');
});







//USER RELATED ##############################################################################################################
app.post('/login', (req, res) => {
    ssn = req.session;
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
            ssn.userLoggedin = true;
            ssn.username = result[0].username;
            ssn.userid = result[0].idUser;
            res.json({ usernameValid: true, passwordValid: true,id:result[0].idUser});
        }
    });
});



app.get('/checkLogin', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.json({ status: false});
    else
        res.json({ status: true, name: ssn.username, id: ssn.userid });
});

//QUESTIONNAIRE RELATED ###################################################################################################

app.get("/api/getquestionnaire/createdByUser/running/:userid", (req, res) => {

    var sql = "SELECT * FROM questionnaire WHERE running = 1 AND creator_id = " + req.params.userid + " ORDER BY timestamppost DESC";
    con.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});




app.post("/api/addresponse/:questionid", (req, res) => {
    var question_id = req.body.questionid;
    var userid = req.body.userid;
    var response = req.body.response;
    var sql = "SELECT * FROM response WHERE user_id = " + userid + " AND question_id =" + question_id;

    con.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        if (result.length > 0)
            res.json({ error: "Response already submitted" });
        else {
            var sql = "INSERT INTO response(idresponse,response,question_id,user_id) VALUES(0,'" + response + "'," + question_id + "," + userid + ")";
            con.query(sql, function (err, result, fields) {
                if (err) {
                    throw err;
                }
                res.json({ error: "none" });
            });
        }
    });
});

app.get("/api/getgroups", (req, res) => {
    var sql = "SELECT * FROM groups";
    con.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});




app.get("/api/getquestionnaire/createdbyuser/expired/:userid", (req, res) => {

    var sql = "SELECT * FROM questionnaire WHERE running = 0 AND creator_id = " + req.params.userid;
    con.query(sql, function (err, result, fields) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});


app.get("/api/getquestionnaire/foruser/:userid", (req, res) => {    // BUGGY ____DONT USE

    var sql = "SELECT questionnaire.idquestionnaire,questionnaire.title,questionnaire.creator_id,questionnaire.running,questionnaire.note,questionnaire.timestamppost,user.username FROM questionnaire JOIN user WHERE questionnaire.idquestionnaire = question.questionnaire_id AND response.question_id = question.idquestion AND response.user_id = user.idUser AND  user.idUser = " + req.params.userid;

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


//DRAFTS####################################################################################################################

app.get("/api/getdrafts/:userid", (req, res) => {
    var sql = "SELECT * FROM drafts WHERE creator_id = " + req.params.userid;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
