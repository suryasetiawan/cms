const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
    
    checkToken: (req, res, next) => {
        var token = req.headers['x-access-token'];
        if(token) {
            jwt.verify(token, 'secret key', (err, decoded) => {
                if (err) {
                    return res.status(500).send({
                        valid: false,
                        message: 'Token invalid.'
                    })
                } else {
                    req.decoded = decoded;
                    next()
                }
            })
        } else {
            return res.status(403).send({
                valid: false,
                message: 'Token not set, please login'
            })
        }
    }
    // token: (email, password, secret, expires)=>{
    //     return jwt.sign({
    //       email: email,
    //       password: password
    //     }, secret, {
    //       expiresIn: expires
    //     })
    //   },

    //   decoded: (token, secret, cb) =>{
    //     jwt.verify(token, secret, (err, decoded)=>{
    //       if(err){
    //         cb(false);
    //       }else{
    //         User.findOne({
    //           email: decoded.email,
    //           password: decoded.password
    //         }).then(user=>{
    //           if(!user){
    //             cb(false);
    //           }else{
    //           }
    //             cb(true)
    //         })
    //       }
    //     })
    //   },

}