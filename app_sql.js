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
    app.listen(process.env.PORT | 3000,'0.0.0.0', () => {
        console.log("listening to port " + (process.env.PORT | 3000));
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
app.get('/createSurvey', (req, res) => {
    ssn = req.session;
    res.sendFile("webpages/createSurvey.html", { root: 'public' });
});

app.get('/createDraft', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.redirect('/');
    else
    {
        res.sendFile("webpages/createSurvey.html", { root: 'public' });
    }
});





app.get('/register', (req, res) => {
    ssn = req.session;
    if (ssn.userloggedin) {
        res.redirect('/');
    }
    res.sendFile("webpages/register.html", { root: 'public' });
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





//TOBE DONE
app.get("/api/addquestionnaire", (req, res) => {
    /*var title = req.body.title;
    var creator_id = req.body.creator_id;
    var note = req.body.note;
    var questions = req.body.questions;*/

    var title = req.query.title;
    var creator_id = req.query.creator_id;
    var note = req.query.note;
    var questions = req.query.questions;
    var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    if (title == undefined || creator_id == undefined || note == undefined)
    {
        res.json({ message: "invalid parameters", status:false});
    }
    else
    {
        var sql = "INSERT INTO questionnaire(`idquestionnaire`, `title`, `creator_id`, `running`, `timestamppost`, `note`) VALUES ('0', '" + title + "', " + creator_id + ", '1', '" + timestamp + "', '" + note + "')";
        con.query(sql, function (err, result, fields)
        {
            if (err)
                throw err;
            var questionnaireId = result.insertId;
            if (questions != undefined)
            {
                questions.forEach(function (question)
                {
                    var question = JSON.parse(question);
                    if ((question.type==="text" || question.type==="choice") || !question.question_text == undefined)
                    {
                        var sql = "INSERT INTO question(idquestion,type,question_text,questionnaire_id) VALUES(0,'" + question.type + "','" + question.question_text + "','" + questionnaireId + "')";
                        console.log(sql);
                        con.query(sql, function (err, result, fields) {
                            if (err) throw err;
                            var questionId = result.insertId;
                            if (question.choices != undefined)
                            {
                                question.choices.forEach(function (choice) {
                                    var sql = "INSERT INTO choices(idchoices,choice,question_id) VALUES(0,'" + choice.choice + "'," + qid + ")";
                                    con.query(sql, function (err, result, fields) {
                                        if (err) throw err;
                                    });
                                }.bind({ qid: questionId}));
                            }
                        }.bind({ question: question }));
                        res.json({ success: true });
                    }
                    else
                    {
                        res.json({ success: false });
                    }
                });
            }
        });
        
    }
});




app.get("/api/addresponse/:questionid", (req, res) => {
    var question_id = req.params.questionid;
    var userid = req.query.userid;
    var response = req.query.response;
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

    var sql = "SELECT questionnaire.idquestionnaire,questionnaire.title,questionnaire.creator_id,questionnaire.running,questionnaire.note,questionnaire.timestamppost,user.username FROM questionnaire JOIN question JOIN response JOIN user WHERE questionnaire.idquestionnaire = question.questionnaire_id AND response.question_id = question.idquestion AND response.user_id = user.idUser AND  user.idUser = " + req.params.userid;

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
