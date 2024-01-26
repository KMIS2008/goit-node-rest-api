const User = require("../model/users");
const bcrypt= require('bcryptjs');
const jwt =('jsonwebtoken');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const {SECRET_KEY}=process.env;

const HttpError = require('../helpers/HttpError.js');

const register = async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user){
        throw HttpError(409, "Email in use")
    }

    const hashPasword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPasword});
    res.status(201).json(
       { email: newUser.email,
        password: newUser.password
    });
}

const login = async (req, res)=>{
    const { email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password is wrong")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw HttpError(401, "Email or password is wrong")
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(playload, SECRET_KEY, {expiresIn: "23h"})

    res.status(200).json()
}

module.exports = {
    register: ctrlWrapper(register),
    login:ctrlWrapper(login)
  
}