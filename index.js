const express = require('express');
const app = express();

const dotenv = require('dotenv')
dotenv.config({ path: './.env' });


const port = process.env.PORT || 2400;
app.listen(port , () => console.log('App listening on port ' + port));

const cors = require("cors");
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = require('./db')
connectDB();
const {getAccessToken, saveUserData, getProfile} = require('./controllers/github')
const {addCpHandles, getUserInfo, getBlogEntries, getContestsInfo} = require('./controllers/codeforces')

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});


app.get('/github/callback', getAccessToken);
app.get('/save', saveUserData);
app.get('/profile', getProfile);
app.post('/cp', addCpHandles);
app.get('/cfInfo', getUserInfo);
app.get('/cfBlog', getBlogEntries);
app.get('/cfContests', getContestsInfo);