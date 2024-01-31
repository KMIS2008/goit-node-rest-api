const express = require ("express");
const ctrl = require ("../controllers/contactsControllers.js");
const validateBody = require ('../helpers/validateBody.js');
const schema = require ('../schemas/contactsSchemas.js');
const isValidId = require ('../middlewares/isValidId.js');
const authdentificate = require('../middlewares/authdentificate.js');

const contactsRouter = express.Router();

contactsRouter.get("/", authdentificate, ctrl.getAllContacts);

contactsRouter.get("/:id", authdentificate, isValidId, ctrl.getContactById);

contactsRouter.delete("/:id", authdentificate, isValidId, ctrl.deleteContact);

contactsRouter.post("/",authdentificate, validateBody(schema.createContactSchema), ctrl.createContact);

contactsRouter.put("/:id",authdentificate, validateBody(schema.updateContactSchema),isValidId, ctrl.updateContact);

contactsRouter.patch("/:id/favorite",authdentificate, validateBody(schema.favoriteSchema),isValidId, ctrl.updateFavorite);

module.exports = contactsRouter;
