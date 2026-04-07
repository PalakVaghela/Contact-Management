const { request } = require('express');
const User = require('../models/User');
const Team= require('../models/Team');
const Contact = require('../models/Contact')



exports.getAllUsers = async(req , res )=>{
    try{
        const users = await User.find({role:{$ne:"admin"}}).select("-password");
        // console.log(users);

        // fetch all the standard users that are nonadmin (exclude the password feild)


        res.status(200).json({success:true,message:'User get successfully',users});

    }catch(error){
        res.status(500).json({success:false,message:"error while fetching all Users"})
    }
}


exports.deleteUser = async(req,res)=>{
    try{
        const {userId} = req.params;
        
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
//remove Users from Team table if that user present in team
        await Team.updateMany(

            {members:userId},
            {$pull:{members:userId}}


        )
//  delete all the contact created by that user also 
        await Contact.deleteMany({createdBy:userId})      

        await User.findByIdAndDelete(userId);

        
res.status(200).json({success:true,message:"User deleted Successfully from team ,Contact and User model"})

    }catch(error){
        res.status(500).json({success:false,message:"Error while deleting user in server"})
    }
}


exports.editUser = async (req, res) => {
    try {
        const { userId } = req.params;  
        const { role } = req.body;      
        // Ensure the role is valid
        if (!['admin', 'Intern', 'Jr. Developer', 'Sr. Developer'].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role provided" });
        }

       
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

      
        user.role = role;
        
        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ success: true, message: "User role updated successfully", user: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error while updating user" });
    }
};
