const _ = require("lodash");
const { Profile } = require("../model/profileModel");

module.exports.getProfile = async (req, res) => {
  let userId = req.user._id;
  let profile = await Profile.findOne({ user: userId });
  return res.status(200).send(profile);
};

module.exports.setProfile = async (req, res) => {
  let userId = req.user._id;
  let userProfile = _.pick(req.body, [
    "phone",
    "address1",
    "address2",
    "city",
    "state",
    "postCode",
    "country",
  ]);
  userProfile["user"] = userId;

  let profile = await Profile.findOne({ user: userId });
  if (profile) {
    await Profile.updateOne({ user: userId }, userProfile);
    return res.status(200).send({ message: "Updated Successfully!" });
  } else {
    profile = new Profile(userProfile);
    await profile.save();
    return res.status(200).send({ message: "Profile Create Successfully!" });
  }
};
