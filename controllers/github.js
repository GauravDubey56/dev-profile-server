const axios = require('axios');
const { User } = require('../models')
var access_token = "";
const auth_url = `https://github.com/login/oauth/authorize?client_id=${process.env.clientID}`
async function getAccessToken(req, res, next) {
    const requestToken = req.query.code;
    try {
        axios({
            method: 'post',
            url: `https://github.com/login/oauth/access_token?client_id=${process.env.clientID}&client_secret=${process.env.clientSecret}&code=${requestToken}`,
            headers: {
                accept: 'application/json'
            }
        }).then((response) => {
            access_token = response.data.access_token
            console.log(access_token)
            res.redirect('/save');
        })
    } catch (error) {
        console.log(error)
    }

}

async function saveUserData(req, res) {

    try {
        axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                Authorization: 'token ' + access_token
            }
        }).then(async (response) => {
            const { avatar_url, login, name } = response.data
            const user = await User.findOne({username : login})
            if(!user){
                await User.create({ username: login, avatar_url, access_token, name})
            }
            return res.status(200).json({ success: true, userData: response.data, access_token, login, name, avatar_url });
        })
    } catch (error) {
        console.log(error)
    }
}
async function getProfile(req, res){
    const user = await User.findOne({username : req.query.username});
    return res.status(200).json({
        success : true,
        data : {
            username : user.username,
            access_token : user.access_token,
            cfId : user.cfId,
            leetcodeId : user.leetcodeId
        }
    })
}
module.exports = {
    getAccessToken, saveUserData, getProfile
}