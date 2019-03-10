var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.post('/register', passport.authenticate('local-register', {
  successRedirect: '/home', // redirect to the secure admin section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
 }))

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/home', // redirect to the secure admin section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
 }));

router.get('/home', function(req, res, next) {
  console.log(req.user)
  res.render('home', {
    data: req.user
    
  });
});

router.get('/data', function(req, res, next) {
  res.render('data');
});

router.get('/bar', function(req, res, next) {
  res.render('bar');
});

router.get('/pie', function(req, res, next) {
  res.render('pie');
});

module.exports = router;
