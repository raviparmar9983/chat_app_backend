import mongoose from 'mongoose';
import * as config from 'config';

const DB_URL: string = config.get('DB.URL')

const connection = async () => {
    try {
        const connection = await mongoose.connect(DB_URL)
        console.log(`Connected Successfully ${DB_URL}`);
    }
    catch (err) {
        console.error(`db connection fail ${err.message}`);
    }
}
export default connection;