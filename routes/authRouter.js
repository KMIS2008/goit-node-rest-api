const express = require ("express");
const validateBody = require ('../helpers/validateBody.js');
const registrSchema = require('../schemas/authSchema.js');
const ctr = require('../controllers/authControllers.js');
const authRouter = express.Router();


authRouter.post("/register", validateBody(registrSchema), ctr.register);

authRouter.post("/login", validateBody(registrSchema), ctr.login);


module.exports = authRouter;