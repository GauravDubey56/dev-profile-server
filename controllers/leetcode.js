async function checkIfUserOnLeetcode(req, res) {
  const user = await User.findOne({ username: req.query.username });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "username not found",
    });
  }
  if (user.leetcodeId) {
    return res.status(200).json({
      success: true,
      message: "user found",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "user not found",
    });
  }
}
