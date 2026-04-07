const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { use } = require('../routes/authRoutes');

require("dotenv").config();


// Admin to this app is only one and unique , hence adding the admin ,manually into DB so admin only need to login (no new admin can be created)


exports.createAdmin = async()=>{
    try{
        const adminExist = await User.findOne({role:'admin'})
if(adminExist){
    console.log("admin aldready in Db");
    return;
};

const  hashedPassword = await bcrypt.hash("uniqueAdmin2025",10);

const adminUser = new User({
    firstname:"Palak",
    lastname:"Vaghela",
    email:"palakvaghela83@gmail.com",
    password:hashedPassword,
    role:'admin'
});

await adminUser.save();
console.log("Admin created Successfully")
    }catch(error){
console.error("Error while admin creation", error)
    }
}

exports.signup = async(req, res) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;
        if (!email || !password || !firstname || !lastname) {
           
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            })
        }

        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: 'User already exists in DB' });

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'Signup done ' });
    } catch (error) {
        res.status(500).json({ message: 'Signup error by server', error });
    }

};


exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // for empty feilds
        if (!email || !password) {
            console.log("error in password matching");
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            })
        }

        // if User doesn't exist
        const user = await User.findOne({ email });
        if (!user) {
            console.log("user not found")
            return res.status(400).json({ success: false, message: "No user found enter a valid Email or signup first" })

        }

        //login password === user(Signup)password

        const passwordValidation = await bcrypt.compare(password, user.password);
        if (!passwordValidation) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        //set JWt token
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '30d' }
        );


        //passing token in cookie
        res.cookie('token', token, {
            httpOnly: true,         
           
            maxAge:  1000*30 * 24 * 60 * 60  // 30 days
        });


        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            }
        });


    } catch (error) {
        res.status(500).json({ message: 'Login error by server', error });

    }
}