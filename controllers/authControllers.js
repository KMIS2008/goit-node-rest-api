const User = require("../model/users");
const bcrypt= require('bcryptjs');
const jwt =require('jsonwebtoken');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const dotenv = require('dotenv');
dotenv.config();
const  {SECRET_KEY} = process.env;

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

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, {token});

    res.status(200).json({token})
}

   const getCurrent = (req, res)=>{
    const {email} = req.user;
    res.status(200).json({email})
   }

   const logout = async (req, res)=>{
    const {_id}= req.user;
    await User.findByIdAndUpdate(_id, {token: null});

    res.json({messege:'Logout success'})
   }

module.exports = {
    register: ctrlWrapper(register),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
  
}