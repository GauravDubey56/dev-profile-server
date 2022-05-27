const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : String,
    username : String,
    access_token : String,
    refresh_token : String,
    avatar_url : String,
    codeforces_handle: String,
    leetcodeId : String,
})

const User = mongoose.model('User', UserSchema);

module.exports = User