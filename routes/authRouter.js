const express = require ("express");
const validateBody = require ('../helpers/validateBody.js');
const registrSchema = require('../schemas/authSchema.js');
const ctr = require('../controllers/authControllers.js');
const authRouter = express.Router();
const authdentificate = require('../middlewares/authdentificate.js');
const upload = require ('../middlewares/upload.js')


authRouter.post("/register", validateBody(registrSchema), ctr.register);

authRouter.post("/login", validateBody(registrSchema), ctr.login);

authRouter.get("/current", authdentificate, ctr.getCurrent);

authRouter.post("/logout", authdentificate, ctr.logout);

authRouter.patch("/avatars", authdentificate,upload.single("avatar"), ctr.upDateAvatar)


module.exports = authRouter;