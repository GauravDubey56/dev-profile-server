async function checkIfUserOnLeetcode (req, res) {
    const user = await User.findOne({ username: req.query.username })
    if (!user) {
        return res.status(200).json({
            success: false,
            msg: "username not found"
        })
    }
    if (user.leetcodeId){
        return res.status(200).json({
            success: true,
            msg: "user found"
        })
    } else {
        return res.status(200).json({
            success: false,
            msg: "user not found"
        })
    }
}