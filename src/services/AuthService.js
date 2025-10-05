import dotenv from 'dotenv';
dotenv.config();


export default class {
    /**
     * Stores the session through http cookies
     * @param {*} res 
     * @param {*} session 
     */
    static setAuthCookies(res, session){
        res.cookie('access_token', session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 // 1h
        })

        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
    }
}
