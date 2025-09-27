import User from '../services/User'

export async function getOwnInfo(req, res){
    const info = await User.getInfo();
}