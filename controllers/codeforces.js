const axios = require('axios');
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
    if (req.body.codeforces) {
        user.codeforces_handle = req.body.codeforces;
        const data = await axios.get(`${cf_url}/user.info?handles=${cfId}`)
        if (data.status == "FAILED") {
            return res.status(200).json({
                success: false,
                msg: "Codeforces profile not found",
            })
        } else {
            await user.save();
        }

    }
    if (req.body.leetcode) {
        user.leetcode = req.body.leetcode;
        await user.save();
    }
    console.log(user)
    return res.status(200).json({
        success: true,
        msg: "Profile added"
    })

}
async function checkIfUserOnCf(req, res) {
    const user = await User.findOne({ username: req.query.username })
    if (!user) {
        return res.status(200).json({
            success: false,
            msg: "username not found"
        })
    }
    if (user.codeforces_handle) {
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

async function getUserInfo(req, res) {
    //cache this
    console.log("function----")
    console.log(req.query);
    try {
        const user = await User.findOne({ username: req.query.username })

        if (!user) {
            return res.status(200).json({
                success: false,
                msg: "username not found"
            })
        }
        const cfId = user.codeforces_handle;
        const data = await axios.get(`${cf_url}/user.info?handles=${cfId}`)
        console.log(data);
        if (data.data.status == "OK") {
            const { rating, maxRating, rank, registrationTimeSeconds } = data.data.result[0];
            var myDate = new Date(registrationTimeSeconds * 1000);
            const joinDate = myDate.toLocaleDateString();
            return res.status(200).json({
                success: true,
                data: {
                    class: rank,
                    currentRating: rating,
                    maxRating: maxRating,
                    joinDate: joinDate
                }
            })

        } else {
            return res.status(200).json({
                success: false,
                msg: "Codeforces profile not found",
            })
        }

    } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "Internal server error"
        })
    }
}
async function getBlogEntries(req, res) {
    try {
        const username = req.query.username;
        const user = await User.findOne({ username: username })
        const cfId = user.codeforces_handle
        const response = await axios.get(cf_url + `/user.blogEntries?handle=${cfId}`);
        const prefix = "https://codeforces.com/blog/entry/";
        if (response.data.status == "OK") {
            const send = [];
            console.log(response.data);
            response.data.result.map(entry => {
                const { id, title, text, author, creationTimeSeconds } = entry;
                const myDate = new Date(creationTimeSeconds * 1000);
                const date = myDate.toLocaleDateString();
                send.push({
                    id: id,
                    title: title,
                    link: prefix + id
                })
            })
            return res.status(200).json({
                success: true,
                data: send
            })
        }
        else {
            return res.status(200).json({
                success: false,
                msg: "No blog entries found"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        })
    }

}

async function getContestsInfo(req, res) {
    try {
        const username = req.query.username;
        const user = await User.findOne({ username: username })
        const cfId = user.codeforces_handle
        const response = await axios.get(cf_url + `/user.rating?handle=${cfId}`);
        if (response.data.status == "OK") {
            const send = [];
            console.log(response.data)
            response.data.result.map(entry => {
                const { id, contestName, oldRating, newRating, rank, ratingUpdateTimeSeconds } = entry;
                const myDate = new Date(ratingUpdateTimeSeconds * 1000);
                const date = myDate.toLocaleDateString();
                send.push({
                    id: id,
                    contestName, rank, oldRating, newRating, date
                })
            });
            return res.status(200).json({
                success: true,
                data: send
            })
        }
        else {
            return res.status(200).json({
                success: false,
                msg: "No contests found"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        })
    }


}
module.exports = { addCpHandles, getUserInfo, getBlogEntries, getContestsInfo }