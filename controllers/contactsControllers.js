
const contactsService = require('../services/contactsServices.js');

const Schema = require('../schemas/contactsSchemas.js');

const HttpError = require('../helpers/HttpError.js');


 const getAllContacts = async (req, res, next) => {
    try {
      const allContacts = await contactsService.listContacts();
    res.status(200).json(allContacts)  
    } catch (error) {
        next(error)
    }
};

 const getContactById = async (req, res, next) => {
try {
    const {id} = req.params;
    const contactsById =  await contactsService.getContactById(id);
    if (!contactsById){
          throw HttpError(404)
    }
     res.status(200).json(contactsById);
} catch (error) {
    next(error)
}
};

 const deleteContact = async (req, res, next) => {
    try {
    const {id} = req.params;
    const delContact = await contactsService.removeContact(id);
    if (!delContact){
        throw HttpError(404)
    } 
    res.status(200).json(delContact);
    } catch (error) {
        next(error)
    }
};

 const createContact = async (req, res, next) => {
try {
        const {error} = Schema.createContactSchema.validate(req.body);
    if(error){
        throw HttpError(400, error.message)
    }
    const newContact = await contactsService.addContact (req.body);
    res.status(201).json(newContact);
} catch (error) {
    next(error)
}
};

const updateContact = async (req, res, next) => {
try {
    const {error} = Schema.updateContactSchema.validate(req.body);
    if(error){
        throw HttpError(400, error.message)
    }
    const{id} =req.params;
    const changeContact = await contactsService.updateContact(id, req.body);
    if (!changeContact){
          throw HttpError(404)
    }
    res.status(200).json(changeContact);

} catch (error) {
    next(error)
}
};
