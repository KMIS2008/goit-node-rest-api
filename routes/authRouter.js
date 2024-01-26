const express = require ("express");
const validateBody = require ('../helpers/validateBody.js');
const {schema} = require('../schemas/authSchema.js')
const authRouter = express.Router();


authRouter.post("/register", validateBody(schema.registrSchema))


module.exports = authRouter;