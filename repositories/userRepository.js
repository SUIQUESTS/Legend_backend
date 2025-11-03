import User from "../models/User.js";

export const findByWallet = async (walletAddress) => {
    return await User.findOne({walletAddress});
};
export const createUser = async (data) => {
    return await User.create(data);
}