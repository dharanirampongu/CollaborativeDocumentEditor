const User = require('../models/User');

// @desc    Search for users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
        return res.json([]);
    }

    const users = await User.find({
        $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
        ],
        _id: { $ne: req.user.id } // Don't search for current user
    })
    .select('-password')
    .limit(10);

    res.json(users);
};

module.exports = {
    searchUsers,
};
