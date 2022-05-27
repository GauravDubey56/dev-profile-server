
const { User } = require('../models')
const cf_url = "https://codeforces.com/api"
async function addCpHandles(req, res) {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
        return res.status(200).json({
            success: false,
            msg: "username not found"
        })
    }
    if (req.body.codeforces){
        user.codeforces_handle = req.body.codeforces;
        await user.save();
    }
    if (req.body.leetcode){
        user.leetcode = req.body.leetcode;
        await user.save();
    }
    console.log(user)
    return res.status(200).json({
        success: true,
        msg: "Profile added"
    })

}

async function getUserInfo(req, res) {
    const user = await User.findOne({ username: req.body.username })
    
    if (!user) {
        return res.status(200).json({
            success: false,
            msg: "username not found"
        })
    }
    
    return res.status(200).json({
        success: true,
        msg: "Profile found",
        user: user
    })  
}

module.exports = { addCpHandles }