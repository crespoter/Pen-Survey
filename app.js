var express = require('express');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
var session = require('express-session');
var transpoter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "pensurvey.crespoter@gmail.com",
        pass : "blanserver"
    }
})
var app = express();
MongoClient.connect("mongodb://crespoter:blantest@ds115573.mlab.com:15573/voting-app", (err, database) => {
    if (err)
        console.log(err);
    db = database;
    app.listen(process.env.PORT, () => {
        console.log("listening to port " + process.env.PORT | 3000);
    });
});
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
    if (ssn.userloggedin)
    {
        res.redirect('/');
    }
    res.sendFile("webpages/register.html", { root: 'public' });
});
app.get('/validateUser', (req, res) => {
    if (req.query.function == "username-free")
    {
        db.collection("users").find({ name: req.query.username }).toArray((err, results) => {
            if (results[0] != undefined)
            {
                res.json({
                    success: false
                });
            }
            else
            {
                res.json({
                    success: true
                });
            }
        });
    }
    if (req.query.function == "check-email")
    {
        db.collection("users").find({ email: req.query.email }).toArray((err, results) => {
            if (results[0] != undefined) {
                res.json({
                    success: false
                });
            }
            else
            {
                res.json({
                    success: true
                });
            }

        });
    }
    if (req.query.function == "register")
    {
        pendingVisitor = {
            name: req.query.username,
            password: req.query.password,
            email: req.query.email
        };
       
        db.collection("pendingUser").save(pendingVisitor);  
        retJson = {
            success: true
        }
        db.collection("pendingUser").find({ name: req.query.username }).toArray((err, results) => {
            if (err)
            {
                retJson.success = false;
                res.json(retJson);
            }
            var mailOptions = {
                from: "pensurvey.crespoter@gmail.com",
                to: pendingVisitor.email,
                subject: "Confirm your account at Pen Survey",
                html: "<h1>Confirm your account at Pen survey by clicking on the link</h1><a href='localhost:3000/verify/" + results[0]._id+"'>Click Here</a>"//CHANGE AFTER HOSTING
            }
            transpoter.sendMail(mailOptions, (error, info) => {
                if (error)
                {
                    retJson.success = false;
                    res.json(retJson);
                }
            });
        });
        
        res.json(retJson);
    }
});
app.get('/verify/:userid', (req, res) => {
    ssn = req.session;
    if (ssn.userloggedin) {
        res.send("Already validated");
    }
    else {
        db.collection("pendingUser").find({ _id: ObjectID(req.params.userid) }).toArray((err, results) => {
            if (results.length == 0) {
                res.send(404, "Invalid request");
            }
            else {
                db.collection("users").save(results[0]);
                ssn.userloggedin = true;
                ssn.username = results[0].name;
                ssn.email = results[0].email;
            }
        });
        db.collection("pendingUser").remove({ _id: ObjectID(req.params.userid) }, (err, results) => {
            if (err || results.length <= 0) {
                res.send(404, "Something unexpected happened. Please try at a later time ");
            }
            res.send("<h1>Successfully Registered</h1><br /><a href='/'>Click here to go to home page</a>");
        });
    }
});
app.get('/checkLogin',(req, res)=>{
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
        res.json({ status: false, name:ssn.username });
    else
        res.json({ status: true });
});
app.post('/login', (req, res) => {
    ssn = req.session;
    db.collection("users").find({ email: req.body.email, password: req.body.password }).toArray((err, results) => {
        if (results[0] == undefined)
        {
            var retJson = {
                status: false
            }
            res.json(retJson);
        }
        else {
            var retJson = {
                status: true,
                id: results[0]._id,
                user: results[0].name
            };
            ssn.userLoggedin = true;
            ssn.username = results[0].name;
            res.json(retJson);
        }
    });
});
app.post('/createSurveyAPI', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false)
    {
        res.send("INVALID REQUEST  UNEXPECTED ERROR");
    }
    var survey = {
        question: req.body.question,
        options: req.body.options,
        user:ssn.username
    };
    var votes = [];
    for (var i = 0; i < req.body.options.length; i++) {
        votes.push(0);
    }
    survey.votes = votes;
    retObj = {
        success: true,
    };
    db.collection("survey").save(survey);
    retObj.question_id = survey._id;
    res.json(retObj);
});
app.get('/surveysAPI/:pagenumber', (req, res) => {
    db.collection("survey").aggregate([{ $project: { _id: "$_id", totalVotes: { $sum: "$votes" }, question: "$question" } }, { $sort: { totalVotes: -1 } }], function (err, data) {
        res.json(data);
    });
      
});
app.get('/logout', (req, res) => {
    ssn = req.session;
    ssn.userLoggedin = false;
    res.redirect('/');
});
app.get('/mySurveys', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false) {
        res.redirect('/');
    }
    else
    {
        res.sendFile("webpages/mySurveys.html", { root: 'public' });
    }
});
app.get('/mySurveysAPI', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false) {
        res.redirect('/');
    }
    else
    {

        db.collection("survey").aggregate([{ $project: { _id: "$_id", totalVotes: { $sum: "$votes" }, question: "$question", user: "$user" } }, { $sort: { totalVotes: -1 } },{$match: { user: ssn.username } }], function (err, data) {
            res.json(data);
        });
    }
});
app.get('/survey', (req, res) => {
    ssn.surveyid = req.param.surveyid;
    res.sendFile("webpages/survey.html", { root: 'public' });
});
app.get('/surveyAPI/:id', (req, res) => {
    id = req.params.id;
    db.collection('survey').find({ _id: ObjectID(id) }).toArray((err, results) => {
        if (results[0] == undefined)
        {
            res.send("UNEXPECTED ERROR OCCURED >> PLEASE CONTACT SYSTEM ADMINISTRATOR - Crespoter");
        }
        else
        {
            res.json(results[0]);
        }
    });
});
app.post('/question-submit', (req, res) => {
    ssn = req.session;
    if (ssn.userLoggedin == undefined || ssn.userLoggedin == false) {
        res.send("SECURITY ALERT > > PLEASE CONTACT ADMINISTRATOR __ CRESPOTER");
    }
    userSurvey = {
        user: ssn.username,
        question: req.body.question
    };
    db.collection("userSurvey").find(userSurvey).toArray((err,data) => {
        if (data[0] == undefined)
        {
            db.collection('userSurvey').save(userSurvey);
            db.collection('survey').find({ _id: ObjectID(req.body.question) }).toArray((err, results) => {
                results[0].votes[parseInt(req.body.option) - 1] += 1;
                console.log(results[0]);
                db.collection("survey").save(results[0]);
                res.redirect("/survey/?id=" + req.body.question);
            });
        }
        else
        {
            res.send("You have already voted for this survey .");
        }
    });
    
});