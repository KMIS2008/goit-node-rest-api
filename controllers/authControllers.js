const User = require("../model/users");
const bcrypt= require('bcryptjs');
const jwt =require('jsonwebtoken');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const sendEmail = require('../helpers/sendEmails.js');
const dotenv = require('dotenv');
dotenv.config();
const Jimp = require('jimp');
const {nanoid} = require('nanoid');

const  {SECRET_KEY} = process.env;
const {BASE_URL} = process.env;
const gravatar = require('gravatar');
const path = require('path');
const fs=require('fs/promises');



const avatarsDir = path.join(__dirname, "../", "public", 'avatars');

const HttpError = require('../helpers/HttpError.js');


const register = async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user){
        throw HttpError(409, "Email in use")
    }

    const hashPasword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPasword,
        avatarURL,
        verificationToken
    });
     
    const verifyEmail = {
        to: email,
        subject: 'Verify your email',
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
      };

    await sendEmail(verifyEmail);

    res.status(201).json(
       { email: newUser.email,
         subscription: newUser.subscription
    });
}


const verifyEmail =async(req, res)=>{
    const { verificationToken}= req.params;
    const user = await User.findOne({verificationToken});
    if(!user){
        throw HttpError(404, 'User not found')
    }
     await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: " ",
  });

    res.status(200).json({message: 'Verification successful'})
    
}


const resentVerifyEmail = async(req,res)=>{
    const {email}= req.body;

    if(!req.body){
        res.status(400).json({"message": "missing required field email"})
    }

    const user = await User.findOne(email);

    if(!user){
        throw HttpError(401, "Email not faund")
    }

    if(user.verify){
        res.status(400).json({
            "message": "Verification has already been passed"})
    }

    const verifyEmail={
        to: email,
        subject:' Verification email sent',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
    }

    await sendEmail(verifyEmail);
    
    res. status(200).json({
        "message": "Verification email sent"
    })

}

const login = async (req, res)=>{
    const { email, password, subscription} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password is wrong")
    }

    if(!user.verify){
        throw HttpError(401, 'Email not verified')
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

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
          }})
}

   const getCurrent = (req, res)=>{
    const {email, subscription} = req.user;
    res.status(200).json({email, subscription})
   }

   const logout = async (req, res)=>{
    const {_id}= req.user;
    await User.findByIdAndUpdate(_id, {token: null});

    res.json({messege:'Logout success'})
   }

   const upDateAvatar = async(req, res)=>{
    const {_id} = req.user;
    if(!req.file){
        res.status|(400).json({mesege:"No file uploaded"})
    }

    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const img = await Jimp.read(tempUpload);
    await img
      .resize(250, 250)
      .writeAsync(tempUpload);
      
    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);
    const avatarURL= path.join('avatars', filename);

    await User.findByIdAndUpdate(_id, {avatarURL});
    
    res.status(200).json({
        avatarURL
    });
   }


module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resentVerifyEmail:ctrlWrapper(resentVerifyEmail),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    upDateAvatar:ctrlWrapper(upDateAvatar),
    
}