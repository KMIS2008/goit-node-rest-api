
const Contact = require('../model/contact.js');

const Schema = require('../schemas/contactsSchemas.js');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');

const HttpError = require('../helpers/HttpError.js');


 const getAllContacts = async (req, res, next) => {
    const {_id: owner} =req.user;
    // Пагінація
    const { page=1, limit=20} = req.query;
    const skip = (page -1)*limit;
    const allContacts = await Contact.find({owner}, "-updatedAt", { skip, limit}).populate("owner", "email");
    

    res.status(200).json(allContacts)  
   
};

 const getContactById = async (req, res) => {
    const {_id} = req.user;
    const {id} = req.params;
    const contactsById =  await Contact.findOne({
        _id: id,
        owner: _id})

    if (!contactsById){
          throw HttpError(404)
    }
     res.status(200).json(contactsById);
};

 const deleteContact = async (req, res) => {
    const {_id} = req.user;
    const {id} = req.params;
    const delContact = await Contact.findOneAndDelete({
        _id: id,
        owner: _id});
   
    if (!delContact){
        throw HttpError(404)
    } 
    res.status(200).json(delContact);

};

 const createContact = async (req, res) => {
    const {_id: owner}=req.user;
    const newContact = await Contact.create({...req.body, owner});
   
    res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
    const {_id} = req.user;
    const{id} =req.params;

      const changeContact = await Contact.findOneAndUpdate(
        {
        _id: id,
        owner: _id
       },
        req.body,
        {new: true});
  
    if (!changeContact){
          throw HttpError(404)
    }
    res.status(200).json(changeContact);
};

const updateFavorite = async (req, res) => {

    const {_id} = req.user;
    const{id} =req.params;
  
      const updateStatusContact = await Contact.findOneAndUpdate(
        {
        _id: id,
        owner: _id
       },
        req.body,
        {new: true});
    if (!updateStatusContact){
          throw HttpError(404)
    }
    res.status(200).json(updateStatusContact);
};

module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite)
}