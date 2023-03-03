const express = require('express');
const router = express.Router();
const User = require('../models/users');

// upload image
const multer = require('multer');

// remove image
const fs = require('fs');

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        //cb(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file));
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    },
});
var upload = multer({ storage: storage }).single('image');

//Insert user into database
router.post('/add', upload, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        image: req.file.filename,
    });
    user.save((err, user) => {
        if (err) {
            res.json({
                error: err.message,
                type: 'danger'
            });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User bien ajoutée ',
            };
            res.redirect('/');
        }
    });
});

// get All users
router.get('/', (req, res) => {

    User.find({}, (err, users) => {
        if (err) {
            res.json(
                {
                    message: err.message,
                }
            );
        } else {
            res.render('index', {
                title: 'Home Page',
                users: users,
            });
        }
    });

});


router.get('/add', (req, res) => {
    res.render('add_users', {
        title: "Add users"
    });

});

// edit user
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;

    User.findById(id, (err, user) => {
        if (err) {
            res.redirect('/');
        } else {
            if (user == null) {
                redirect('/');
            } else {
                res.render('edit_users', {
                    title: "Edit users",
                    user: user,
                });
            }
        }
    });
});

// update user
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';
    if (req.file) {
        new_image = req.file.filename;
        // remove image
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        image: new_image,
    }, (err, user) => {
        if(err) {
            res.json({
                message: err.message,
                type: 'danger'
            });
        }else {
            req.session.message = {
                type: 'success',
                message: 'User bien modifié ',
            }
            res.redirect('/');
        }
    });
});

// Delete user
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result) => {
        // remove imgage
        if(result.image != '') {
            try {
            fs.unlinkSync('./uploads/' + result.image);
            }catch(err) {
                console.log(err);
            }
        }

        if(err) {
            res.json({
                message: err.message,
                type: 'danger'
            });
        }else {
            req.session.message = {
                message: 'User bien supprimé',
                type: 'info',
            }
            res.redirect('/');
        }
    });
});

/*
router.get('/', (req, res) => {
    res.render('index', {
        title: "Home page"
    });
}
);
*/

module.exports = router;