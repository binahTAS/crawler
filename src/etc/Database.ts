import {connect} from 'mongoose'
import secrets from '../../secrets.json'

export const doConn = async () => {
    return await connect(secrets.mongoDBString)
        .then(() => {
            return true
        })
        .catch(() => {
            return false;
        })
}