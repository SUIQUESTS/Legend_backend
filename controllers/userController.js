import * as userService from "../services/userService.js"

export const checkWallet = async(request, response) =>{
    try{
        const exists = await userService.checkWallet(request.params.walletAddress);
        response.json({exists});
    }catch(error){
        response.status(500).json({message: error.message});
    }
};

export const createProfile = async (request, response) => {
  try {
    const { name, walletAddress } = request.body;
    const user = await userService.createProfile(name, walletAddress);
    response.status(201).json(user);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
export const getProfile = async (request, response) => {
    try{
        const user = await userService.getProfile(request.params.walletAddress);
        response.json(user);
    }catch(error){
        response.status(404).json({message:error.message });
    };
}