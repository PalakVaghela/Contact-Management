const express = require("express");
const router = express.Router();
const {auth,isAdmin} = require("../middleware/auth");
const {getAllUsers,deleteUser,editUser} = require("../controllers/userController");


router.get("/allusers",auth,isAdmin,getAllUsers)
router.delete("/deleteuser/:userId",auth,isAdmin,deleteUser)
router.put('/updateuser/:userId', auth, isAdmin,editUser);

module.exports = router