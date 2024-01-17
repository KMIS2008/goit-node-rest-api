import contactsService from "../services/contactsServices.js";
import {createContactSchema, updateContactSchema} from '../schemas/contactsSchemas.js'
const HttpError = require('../helpers/HttpError.js');


export const getAllContacts = async (req, res) => {
    const allContacts = await listContacts();
    res.status(200).json(allContacts)
};

export const getContactById = async (req, res) => {
    const {id} = req.params;
    const contactsById =  await getContactById(id);
    if (!contactsById){
          throw HttpError(404, {"message": "Not found"})
    }
     res.status(200).json(contactsById);
};

export const deleteContact = async (req, res) => {
    const {id} = req.params;
    const delContact = await removeContact(id);
    if (!delContact){
        throw HttpError(404, {"message": "Not found"})
    } 
    res.status(200).json(delContact);
};

export const createContact = async (req, res) => {
    const {error} = createContactSchema.validate(req.body);
    if(error){
        throw HttpError(400, error.message)
    }
    const newContact = await addContact (req.body);
    res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
    const {error} = updateContactSchema.validate(req.body);
    if(error){
        throw HttpError(400, error.message)
    }
    const{id} =req.params;
    const changeContact = await updateContact(id, req.body);
    if (!changeContact){
          throw HttpError(404, {"message": "Not found"})
    }
    
    res.status(200).json(changeContact);

};
