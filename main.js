// imports

require('dotenv').config();
const express = require('express');
const mongosse = require('mongoose');
const session = require('express-session');


const app = express();
const PORT = process.env.PORT || 4000;

mongosse.set('strictQuery', false);

// databse connection
mongosse.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongosse.connection;
//console.log(db);


db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');
}
);

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(express.static('public'));

app.use(session({
    //secret: process.env.SESSION_SECRET,
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
}
);

// upload image
app.use(express.static('uploads'));
//


// set template engine
app.set('view engine', 'ejs');

// route prefix
app.use('', require('./routes/routes'));


/*app.get('/', (req, res) => {
    res.send('Hello World');
}
);*/

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);

});

