export default class {
    /**
     * create a generic response object for all api request
     * @param {boolean} success 
     * @param {string} message 
     * @param {any} data 
     */
    static create(success, message, data=null){
        return {success, message, data}
    }

}