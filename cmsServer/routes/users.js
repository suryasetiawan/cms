var express = require('express');
var router = express.Router();
const User = require('../models/user');
const config = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const response = {
  error: null,
  message: '',
  data: {}
}

/* GET users listing. */

router.post('/register', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, userData) => {
    if (err) {
      response.error = true
      response.message = 'There was problem finding the User!'
      return res.json(response)
    }
    if (userData) {
      response.error = true
      response.message = `User '${req.body.email}' already registered, enter the other email`
      return res.json(response)
    } else {
      if (req.body.password == req.body.retypepassword) {
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        console.log(hashedPassword);
        
        let token = jwt.sign({ email: req.body.email }, 'secret key', {
          expiresIn: 86400
        })
        User.create({
          email: req.body.email,
          password: hashedPassword,
          token: token
        }, (err, user) => {
          if (err) {
            response.error = true
            response.message = 'There was a problem registering the user!'
            return res.json(response)
          }
          response.error = false
          response.message = 'There was a problem registering the user!'
          response.data = {
            email: user.email,
            token: user.token
          }
          return res.json(response)
        })
      } else {
        response.error = true
        response.message = 'Password you entered not match!'
        return res.json(response)
      }
    }
  })
});

router.post('/login', (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        //check email
        res.json({
          error: true,
          message: "email is wrong"
        })
      } else if (user) {
        //check password
        let passwordValid = bcrypt.compareSync(req.body.password, user.password)
        console.log(passwordValid);
        if (!passwordValid) {
          res.json({
            error: true,
            message: "password is wrong!"
          })
        } else {
          const token = jwt.sign({
            email: user.email
          }, 'secretkey', {
            expiresIn: 86400 // expires in 24 hours
          })
          // console.log(token)
          user.token = token
          user.save(err => {
           res.status(200).json({
             error: false,
              data: {
                email: user.email
              },
              token
            })
          })
        }
      }
    })
    .catch(err => res.json(err))
})

/* GET users listing. */
// router.post('/api/users/register', function (req, res, next) {
//   if (req.body.password == req.body.retypepassword) {
//     let token = jwt.sign(req.body.email, config.secret)
//     // hash pake bcrypt

//     let user = new User({
//       email: req.body.email,
//       password: req.body.password,
//       token: token
//     })

//     user.save().then(users => {
//       res.json({
//         data: {
//           email: users.email
//         },
//         token: token
//       })
//     }).catch(err => {
//       res.json({
//         error: true,
//         message: err.message
//       })
//     })
//   } else {
//     res.json({
//       error: true,
//       message: 'password and retypepassword are not match'
//     })

//   }
// })

// router.post('/register', (req, res) =>{
//   User.find({
//       email: req.body.email
//     })
//     .then(user => {
//       if (user.length > 0) {
//         console.log(user);

//         return res.status(409).json({
//           message: 'email exists'
//         })
//       }
//       console.log(req.body.password , "paasword")
//       console.log(req.body.retypepassword, "rety")
//       if (req.body.password == req.body.retypepassword) {
//       jwt.sign({
//         email: req.body.email
//       }, config.secret, { expiresIn: 86400 },
//        (err, token) => {
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           if (err) {
//             return res.status(500).json({
//               error: err
//             })
//           } else {
//             const user = new User({
//               email: req.body.email,
//               password: hash,
//               token: token
//             })
//             user
//               .save()
//               .then(result => {
//                 console.log(result);
//                 res.json({
//                   data: {
//                     email: result.email
//                   },
//                   token
//                 })
//               })
//               .catch(err => res.send(err))
//           }
//         });
//       })
//     } else {
//       res.json({
//         error: true,
//         message: 'password and retypepassword are not match'
//       })
  
//     }
//     }).catch(err => res.send(err))
  
// });




// router.post('/login', (req, res) => {
//   User.findOne({
//     email: req.body.email,
//   })
//     .then(user => {
//       if (!user) {
//         res.json({ error: true, message: "Email Not Found" })
//       } else {
        
//       if (!bcrypt.compareSync(req.body.password, user.password)) {
//         res.json({
//           error: true,
//           message: 'Password Invalid'
//         });
//       } else {
//           let token = jwt.sign({email:user.email} , config.secret, { expiresIn: 86400 });
//           user.token = token
//           user.save(err =>{
//             res.json({
//               data: {
//                 email: user.email
//               },
//               token: token
//             })
//           })
//         }
//       }
      
//     })
//     .catch(err => 
//       res.send(err)
//     )
// })



router.post('/check', (req, res) => {
  var token = req.body.token || req.query.token || req.header['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) res.json({ valid: false })
      else {
        User.findOne({
          email: decoded.email,
          token: token
        }, (err, user) => {
          if (user) {
            res.json({ valid: true })
          } else {
            res.json({ valid: false })
          }

        })

      }

    })
  }
})

router.get('/destroy', (req, res) => {
  res.json({
    logout: true
  })
})


module.exports = router;
