 express = require('express');
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
                        if (retJSON.questions[result[i].idquestion].response == undefined) {
                            retJSON.questions[result[i].idquestion].response = [];
                        }
                        retJSON.questions[result[i].idquestion].response.push(result[i].response);
                    }
                    res.render('pages/activesurveydetail.ejs', { data: retJSON });
                });             
            });
        });
    }
    else
        res.render('pages/login.ejs', { error: '' });
});


app.get('/expiredsurveydetails', (req, res) => {
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
                for (var i = 0; i < result.length; i++) {
                    if (!retJSON.questions[result[i].idquestion])
                        retJSON.questions[result[i].idquestion] = {};
                    retJSON.questions[result[i].idquestion]['question_text'] = result[i].question_text;
                    retJSON.questions[result[i].idquestion].type = result[i].type;
                    if (retJSON.questions[result[i].idquestion].choices == undefined) {
                        retJSON.questions[result[i].idquestion].choices = {};
                    }
                    retJSON.questions[result[i].idquestion].choices[result[i].idchoices] = result[i].choice;
                }
                var sql = "SELECT * FROM question,response WHERE question.idquestion = response.question_id AND question.questionnaire_id = " + retJSON.id;
                con.query(sql, function (err, result, fileds) {
                    for (var i = 0; i < result.length; i++) {
                        if (!retJSON.questions[result[i].idquestion])
                            retJSON.questions[result[i].idquestion] = {};
                        if (retJSON.questions[result[i].idquestion].response == undefined) {
                            retJSON.questions[result[i].idquestion].response = [];
                        }
                        retJSON.questions[result[i].idquestion].response.push(result[i].response);
                    }
                    res.render('pages/expiredsurveydetails.ejs', { data: retJSON });
                });
            });
        });
    }
    else
        res.render('pages/login.ejs', { error: '' });
});


app.post('/activesurveydetails', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.redirect('/');
    else {
        var sql = "UPDATE questionnaire SET running = 0 WHERE idquestionnaire = " + req.query.id;
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            res.redirect('/');
        });
    }

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
        var sql = "SELECT * FROM drafts WHERE creator_id = " + ssn.userid + " ORDER BY timestamp DESC";
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            res.render("pages/drafts.ejs", { drafts: result });
        });
    }
});

app.get('/createdrafts', (req, res) => {
    ssn = req.session;

    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.redirect('/');
    else {
        res.render('pages/createdraft.ejs', { error: '' });
    }
});

app.post('/createdrafts', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.redirect('/');
    else {
        var choiceLengths = req.body.choiceLength;
        var questions = req.body.questions;
        var choiceList = req.body.choices;
        var title = req.body.title;
        var note = req.body.note;

        var choices = [];
        var questionCounter = 0;
        for (var i = 0; i < choiceLengths.length; i++) {
            var choiceForQuestion = choiceList.splice(0, parseInt(choiceLengths[i]));
            choices.push(choiceForQuestion);
        }
        var sql = "INSERT INTO drafts(iddrafts,title,creator_id,timestamp,note) VALUES(0,'" + title + "'," + ssn.userid + ",now(),'note')";
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            var draftId = result.insertId;
            var sql = "INSERT into question(idquestion, type, question_text, questionnaire_id) VALUES ?";
            var values = [];
            for (var i = 0; i < questions.length; i++) {
                values.push([0, "CHOICE", questions[i], draftId]);
            }

            con.query(sql, [values], function (err, result, fields) {
                if (err) throw err;
                for (var i = 0; i < values.length; i++) {
                    for (var j = 0; j < choices[i].length; j++) {
                        var sql = "INSERT into choices(idchoices,choice,question_id) VALUES(0,'" + choices[i][j] + "'," + (parseInt(result.insertId) + i) + ")";
                        con.query(sql, function (err, result, fields) {
                            if (err) throw err;
                        });
                    }
                }

                res.redirect("/drafts");
            });
        });
    }
});

app.get('/draftdetails', (req, res) => {
    ssn = req.session;
    var retJSON = {};
    if (ssn.userLoggedin) {
        var sql = "SELECT * FROM drafts WHERE iddrafts = " + req.query.id + " AND creator_id=" + ssn.userid;
        con.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
            }
            retJSON.id = result[0].iddrafts;
            retJSON.title = result[0].title;
            retJSON.datetime = result[0].timestamp;
            retJSON.note = result[0].note;
            var sql = "SELECT * FROM question,choices WHERE question.idquestion = choices.question_id AND question.questionnaire_id =" + retJSON.id;
            con.query(sql, function (err, result, fields) {
                retJSON.questions = {};
                for (var i = 0; i < result.length; i++) {
                    if (!retJSON.questions[result[i].idquestion])
                        retJSON.questions[result[i].idquestion] = {};
                    retJSON.questions[result[i].idquestion]['question_text'] = result[i].question_text;
                    retJSON.questions[result[i].idquestion].type = result[i].type;
                    if (retJSON.questions[result[i].idquestion].choices == undefined) {
                        retJSON.questions[result[i].idquestion].choices = {};
                    }
                    retJSON.questions[result[i].idquestion].choices[result[i].idchoices] = result[i].choice;
                }
                var sql = "SELECT * FROM question,response WHERE question.idquestion = response.question_id AND question.questionnaire_id = " + retJSON.id;
                con.query(sql, function (err, result, fileds) {
                    for (var i = 0; i < result.length; i++) {
                        if (!retJSON.questions[result[i].idquestion])
                            retJSON.questions[result[i].idquestion] = {};
                        if (retJSON.questions[result[i].idquestion].response == undefined) {
                            retJSON.questions[result[i].idquestion].response = [];
                        }
                        retJSON.questions[result[i].idquestion].response.push(result[i].response);
                    }
                    res.render('pages/draftdetail.ejs', { data: retJSON });
                });
            });
        });
    }
    else
        res.render('pages/login.ejs', { error: '' });
});


app.post('/draftdetails', (req, res) => {
     ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.redirect('/');
    else {

        var choiceLengths = req.body.choiceLength;
        var questions = req.body.questions;
        var choiceList = req.body.choices;
        var title = req.body.title;
        var note = req.body.note;
        var id = req.query.id;
        var choices = [];
        var questionCounter = 0;
        //Do not try this at work
        //Make transaction to delete choices and questions related to this in mysql    TODO                        //TODO
        var sql = "DELETE FROM drafts WHERE iddrafts=" + id;
        con.query(sql, function (err, result, fields) {
            for (var i = 0; i < choiceLengths.length; i++) {
                var choiceForQuestion = choiceList.splice(0, parseInt(choiceLengths[i]));
                choices.push(choiceForQuestion);
            }
            var sql = "INSERT INTO drafts(iddrafts,title,creator_id,timestamp,note) VALUES(0,'" + title + "'," + ssn.userid + ",now(),'note')";
            con.query(sql, function (err, result, fields) {
                if (err) {
                    throw err;
                }
                var draftId = result.insertId;
                var sql = "INSERT into question(idquestion, type, question_text, questionnaire_id) VALUES ?";
                var values = [];
                for (var i = 0; i < questions.length; i++) {
                    values.push([0, "CHOICE", questions[i], draftId]);
                }

                con.query(sql, [values], function (err, result, fields) {
                    if (err) throw err;
                    for (var i = 0; i < values.length; i++) {
                        for (var j = 0; j < choices[i].length; j++) {
                            var sql = "INSERT into choices(idchoices,choice,question_id) VALUES(0,'" + choices[i][j] + "'," + (parseInt(result.insertId) + i) + ")";
                            con.query(sql, function (err, result, fields) {
                                if (err) throw err;
                            });
                        }
                    }
                    res.redirect("/drafts");
                });
            });
        });
        
    }
});
app.get('/logout', (req, res) => {
    ssn = req.session;
    ssn.userLoggedin = false;
    res.redirect('/');
});







//USER RELATED ##############################################################################################################
app.post('/api/login', (req, res) => {

    ssn = req.session;
    var username = req.body.username;
    var password = req.body.password;
    var sql = "SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'";
    var retObj = { usernameValid: false, passwordValid: false };
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        if (result.length <= 0) {
            sql = "SELECT * FROM user WHERE username='" + username + "'";
            con.query(sql, function (errUser, resultUser, fieldsUser) {
                if (errUser) throw err;
                if (resultUser.length > 0) {
                    retObj.usernameValid = true;
                    res.json(retObj);

                }
                else {

                    res.json(retObj);
                }
            });
        }
        else {
            ssn.userLoggedin = true;
            retObj.usernameValid = true;
            retObj.passwordValid = true;
            
            ssn.username = result[0].username;
            ssn.userid = result[0].idUser;
            retObj.id = result[0].idUser;

            res.json(retObj);
        }
    });
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


app.get("/api/getquestionnaire/foruser/:userid", (req, res) => { 

    var sql = "SELECT DISTINCT questionnaire.idquestionnaire,username,title,note,timestamppost FROM questionnaire_user,questionnaire,user,question WHERE question.idquestion NOT IN(SELECT response.question_id FROM response) AND questionnaire.idquestionnaire=question.questionnaire_id AND user.idUser=questionnaire.creator_id AND questionnaire.idquestionnaire = questionnaire_user.questionnaire_id AND questionnaire_user.user_id=" + req.params.userid+" ORDER BY timestamppost DESC";
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



app.get("/api/sendquestionnaire/:groupid", (req, res) => {
    var draftId = req.query.id;
    var groupId = req.params.groupid;
    var sql = "SELECT * FROM user_group WHERE group_id = " + groupId;
    console.log(sql);
    con.query(sql, (err, result, fields) => {
        if (err) throw err;
        
        result.forEach((element) => {
            var sql = "SELECT * FROM drafts WHERE iddrafts = " + draftId;
            console.log(sql);
            con.query(sql, (err, result, fields) => {
                var draft = result[0];
                var sql = "INSERT into questionnaire(idquestionnaire,title,creator_id,running,timestamppost,note) VALUES("+draft.iddrafts + ",'" + draft.title + "'," + draft.creator_id + ",1,now(),'" + draft.note + "')";
                console.log(sql);
                con.query(sql, (err, result, fields) => {
                    if (err) throw err;
                    var sql = "INSERT into questionnaire_user(questionnaire_id,user_id) VALUES(" + result.insertId + "," + element.user_id + ")";
                    con.query(sql, (err, result, fields) => {
                        if (err) throw err;
                    });
                });
            });
            
        });
    });
    res.json({ success: true });
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
    var sql = "SELECT * FROM drafts WHERE creator_id = " + req.params.userid + " ORDER BY timestamp DESC";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});
