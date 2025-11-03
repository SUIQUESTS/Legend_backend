import * as userRepo from "../repositories/userRepository.js";

export const checkWallet = async (walletAddress) => {
    const user = await userRepo.findByWallet(walletAddress);
    return !!user;
};

export const createProfile = async (name, walletAddress) =>{
    const existing = await userRepo.findByWallet(walletAddress);
    if (existing) throw new Error("Wallet already registered");
    return await userRepo.createUser({name, walletAddress});
};

export const getProfile = async (walletAddress) => {
    const user = await userRepo.findByWallet(walletAddress);
    if(!user) throw new Error("User not found");
    return user;
    
};