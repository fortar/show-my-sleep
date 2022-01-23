import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb'
import { CONNECTION_STRING, DB_NAME, SLEEP_COLLECTION} from './_settings'

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    const client = await MongoClient.connect(CONNECTION_STRING);
    const db = await client.db(DB_NAME);
    const collection = db.collection(SLEEP_COLLECTION);

    let result = {}

    if(req.query.day) {
      const data = {
        day: req.query.day,
        start: req.query.start,
        end: req.query.end,
        text: req.query.text, 
      };
      result = await collection.insertOne(data) 
      // {"acknowledged":true,"insertedId":"xxxxxxx"}
    }
   
    res.status(200).json(result);
}