const express = require ("express");
const ctrl = require ("../controllers/contactsControllers.js");
const validateBody = require ('../helpers/validateBody.js');
const schema = require ('../schemas/contactsSchemas.js');
const isValidId = require ('../middlewares/isValidId.js');


const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", isValidId, ctrl.getContactById);

contactsRouter.delete("/:id", isValidId, ctrl.deleteContact);

contactsRouter.post("/",validateBody(schema.createContactSchema), ctrl.createContact);

contactsRouter.put("/:id", validateBody(schema.updateContactSchema),isValidId, ctrl.updateContact);

contactsRouter.patch("/:id/favorite", validateBody(schema.favoriteSchema),isValidId, ctrl.updateFavorite);

module.exports = contactsRouter;
