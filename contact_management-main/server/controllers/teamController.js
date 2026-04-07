const User = require('../models/User');

const Team = require('../models/Team');
const Contact = require('../models/Contact')
exports.createTeam =async(req , res)=>{
    try{
        const {name,memberEmails}=req.body;

        if(!name || !Array.isArray(memberEmails)|| memberEmails.length ===0){
            return res.status(400).json({success:false,message:"No users are selected for team formation"});
        }

        // find non-admin users

        const users = await User.find({email:{ $in: memberEmails},role:{$ne : "admin"}});



 // both length must be same DB find and memberSend
        if(users.length !== memberEmails.length){
            return res.status(400).json({success:false,message:"Invalid user for team creation"})
        }
        //find memberIDs
        const memberIds = users.map(user => user._id);

        //create the team

        const newTeam = new Team({
            name,
            members:memberIds,
            createdBy:req.user.userId  //admin name
        })


        await newTeam.save();
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $push: { teams: newTeam._id } }
        );


        res.status(200).json({success:true,message:"Team Created",team:newTeam});



    }catch(error){
res.status(500).json({success:false,message:"Error in Team Creation by server", error: error.message})
    }
}


exports.getAllTeams = async(req,res)=>{
    try{
        const adminId = req.user.userId;
        const teams = await Team.find({createdBy:adminId}).populate("members","name email")

        res.status(200).json({success:true, message:"team fetched Successfully", teams})
    }

    catch(error){
        res.status(500).json({success:false,message:"error in fetching teams" , error:error.message

        })
    }
}


exports.deleteTeam = async(req , res)=>{
    try{
        const {teamId} = req.params;
        if(!teamId) {
            return res.status(400).json({success:false,message:"Team Id missing"})
        }

        const team = await Team.findById(teamId);
        if(!team){
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        await Team.findByIdAndDelete(teamId);
        await User.updateMany(
            { teams: teamId }, 
            { $pull: { teams: teamId } }  
        );


        res.status(200).json({success:true,message:"Team deleted"})

    }catch(error){
        res.status(500).json({success:false,message:"Error in deletion by server",error:error.message})

    }

}

exports.getTeamContacts = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId).populate("members");
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        const contacts = await Contact.find({ createdBy: { $in: team.members } }).populate({
            path: "createdBy",
            select: "email"
        }).sort({createdAt:-1});

        res.status(200).json({
            success: true,
            message: "Contacts fetched successfully",
            teamName: team.name,
            contacts: contacts.map(contact => ({
                id: contact._id,
                name: contact.name,
                phoneNo: contact.phoneNo,
                email: contact.email,
                designation: contact.designation,
              
                createdByEmail: contact.createdBy.email
            }))
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error in fetching contacts", error: error.message });
    }
};

