import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb'
import { CONNECTION_STRING, DB_NAME, SLEEP_COLLECTION} from './_settings'

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    const client = await MongoClient.connect(CONNECTION_STRING);
    const db = await client.db(DB_NAME);
    const collection = db.collection(SLEEP_COLLECTION);
    let result = {}

    if(req.query._id) {
      var whereStr = {
        _id: new ObjectId(req.query._id.toString())
      };
      var updateData = {}
      if(req.query.day) {
        updateData["day"] = req.query.day
      }
      if(req.query.start) {
        updateData["start"] = req.query.start
      }
      if(req.query.end) {
        updateData["end"] = req.query.end
      }
      if(req.query.text) {
        updateData["text"] = req.query.text
      }

      var updateStr = {$set: updateData};

      result = await collection.updateOne(whereStr, updateStr)
      //{"acknowledged":true,"modifiedCount":1,"upsertedId":null,"upsertedCount":0,"matchedCount":1}
    }
    
    res.status(200).json(result);
}