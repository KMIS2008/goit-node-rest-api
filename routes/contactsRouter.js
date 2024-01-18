const express = require ("express");
const contactsControllers = require ("../controllers/contactsControllers.js");

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getContactById);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/", contactsControllers.createContact);

contactsRouter.put("/:id", contactsControllers.updateContact);

module.exports = contactsRouter;
