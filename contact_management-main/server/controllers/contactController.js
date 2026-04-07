const User = require('../models/User');
const Contact = require('../models/Contact')



// ------ create --------------

exports.createContact = async(req ,res )=>{
    try{
const {name,phoneNo,email,designation}= req.body;
const userId = req.user.userId;
const contact = await Contact.create({name,phoneNo,email,designation,createdBy:userId});

// update User's contact arrray

await User.findByIdAndUpdate(userId,{$push:{contacts:contact._id}});

res.status(200).json({success:true,message:"Contact Created successfully",contact})

    }catch(error){
res.status(500).json({success:false, message:"Error while creating contact by Server"})
    }
}

// ----------- Delete --------------

exports.deleteContact = async (req , res)=>{
    try{
        const { contactId } = req.params;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if(!user.permissions?.delete){
            return res.status(403).json({
                success:false,
                message:"permission denied"
            })
        }
const contact = await Contact.findById(contactId);

if(!contact){
    return res.status(404).json({success:false,message:"COntact not found for deletion"})
}
if (!req.user.permissions || !req.user.permissions.delete) {
    return res.status(403).json({ success: false, message: "You do not have permission to delete this contact" });
}

await Contact.findByIdAndDelete(contactId);

await User.findByIdAndUpdate(userId,{$pull:{contacts:contactId}})

res.status(200).json({success:true, message:"Contact deleted Successfully"})

    }catch(error){

        res.status(500).json({success:false, message:"Error while deleting contact by server"

        })

    }
}
// ----------- Update --------------

exports.updateContact = async(req,res)=>{
    try{
        const {contactId} = req.params;
        const {name,phoneNo,email,designation} = req.body;
        const userId = req.user.userId;
        const user = await User.findById(userId);

        
if(!user.permissions?.edit){
    return res.status(403).json({
        success:false, message:"Permission Denied"
    })
}

      //check if contactId exist
        const contact = await Contact.findOne({_id:contactId, createdBy:userId});


        if(!contact){
            return res.status(404).json({success:false, message:"Contact not found"})
        }
        const existingContact = await Contact.findOne({ phoneNo, _id: { $ne: contactId } });
        console.log(existingContact)
        if (existingContact) {
            return res.status(400).json({ success: false, message: "Phone number already exists" });
        }
const updatedContact = await Contact.findByIdAndUpdate(contactId,{name,phoneNo,email,designation},{new:true,runValidators:true});

res.status(200).json({success:true,message:"Contact uodated Successfully", contact:updatedContact})

    }catch(error){
        res.status(500).json({ success: false, message: "Error while updating contact by server", error: error.message });
    }
}

// ----------- Read all the contacts --------------

exports.getAllContacts = async(req , res)=>{
    try{
        const userId = req.user.userId;

        // find list of all contacts created by that user

        const contacts = await Contact.find({createdBy:userId});

        if(contacts.length === 0){
            return res.status(404).json({success:false, message:"No contacts created by this user"})
        }
        res.status(200).json({success:true, message:"Contacts fetched ",contacts})

    }catch(error){
        res.status(500).json({success:false, message:"Error while fetching contacts by server", error: error.message

        })

    }
}


//----------- grant permission


exports.grantPermission = async(req,res)=>{
    try{
        const {userId} = req.params;
        const {edit,delete : canDelete } = req.body;

        const user = await User.findByIdAndUpdate(userId,
            {permissions:{edit, delete:canDelete}},{new:true}
        );
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'Permissions updated successfully', user });
    }catch(error){
        res.status(500).json({ success: false, message: 'Error while granting permissions', error: error.message });
    }
}