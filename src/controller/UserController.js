import User from '../services/UserService'

export async function getOwnInfo(req, res){
    const info = await User.getInfo();
}