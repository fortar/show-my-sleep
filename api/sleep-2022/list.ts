import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, Sort } from 'mongodb'
import { CONNECTION_STRING, DB_NAME, SLEEP_COLLECTION} from './_settings'

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    const client = await MongoClient.connect(CONNECTION_STRING);
    const db = await client.db(DB_NAME);
    const collection = db.collection(SLEEP_COLLECTION);

    const mysort:Sort = { day: 1 };
    var result = await collection.find().sort(mysort).toArray();
    // [{},....]
    res.status(200).json(result);
}