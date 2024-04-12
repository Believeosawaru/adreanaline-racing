// if (process.env !== 'production') {
//     require('dotemv').config()
// }

const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const passport = require('passport');
const initializePassport = require('./passport-config.js');
const flash = require('express-flash');
const session = require('express-session');

initializePassport(
    passport, 
    email => users.find(user => user.email === email)
)

const users = []

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


// confuguring the register post functionality
app.post('/register', async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login')
        console.log(users)
    } catch (e) {
        console.log(e)
    }

});

// routes

app.get('/', (req, res) => {
    res.render('register.ejs')
});

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.listen(3000)