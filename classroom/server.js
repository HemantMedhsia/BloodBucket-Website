const express = require("express");
const app = express();
const users = require("./routes/user");
const posts = require("./routes/post");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.use(session({secret:"mysupersecretstring", resave:false, saveUninitialized: true}));

// app.get("/request", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });



const sessionOption = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized : true,
};
app.use(session(sessionOption));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.messages = req.flash("success");
    res.locals.errmsg   = req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let {name ="anonymous"} = req.query;
    req.session.name = name;
    if(name==="anonymous"){
        req.flash("error","user not registered");
    } else{
        req.flash("success","user register successfuly");
    }
    //console.log(req.session.name);
   
    res.redirect("/hello");
});


app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
});


// app.get("/test",(req,res)=>{
//     res.send("test successful");
// })


// app.use(cookieParser("secret"));


// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed: true});
//     res.send("signed cookie sent");
// });

// app.get("/verify" , (req,res)=>{
//     res.send(req.signedCookies);
//     //res.send("Verify");
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("origin","India");
//     res.send("we sent you a cookie !");
// });


// app.get("/greet",(req,res)=>{
//     let {name="anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// })


// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("I am home route");
// });


// app.use("/users",users);
// app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});