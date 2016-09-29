import * as express from 'express';
import * as redis from 'redis';
// import { mongodb } from '../db/mongodb';



// var Schema = mongodb.Schema;    // 创建模型


// var userScheMa = new Schema({});  
// var Users = mongodb.model('users', userScheMa);


let nameData = require('../data/name.list.json');

export function nameList(app: express.Application) {

  /**
   * Get name list.
   * @static
   */
  app.get('/api/name-list/static',
    (req:any, res:any, next:any) => {

      res.json(nameData);
    });

  /**
   * Get name list.
   * @database
   */
  app.get('/api/name-list',
    (req:any, res:any, next:any) => {

      let RedisClient = redis.createClient(),
          nameList: string[] = [];

      RedisClient.smembers('name-list',
        (err:any, replies:any) => {
          console.log(`
          Reply length: ${replies.length}. 
          Reply: ${replies}.`);
          nameList = replies;
          res.json(nameList);
      });

      RedisClient.quit();
    });

  /**
   * Add new name.
   * @database
   */
  app.post('/api/name-list',
    (req:any, res:any, next:any) => {

      let RedisClient = redis.createClient(),
          request = req.body;
          // request = JSON.parse(req.body);

      RedisClient.sadd('name-list', request.name,
        (err:any, replies:any) => {
          console.log(`
          Reply: ${replies}.`);

          res.json({success: true});
        });

      RedisClient.quit();
    });

  /**
   * Delete name.
   * @database
   */
  app.delete('/api/name-list',
    (req:any, res:any, next:any) => {

      let RedisClient = redis.createClient(),
          request = req.body;
          // request = JSON.parse(req.body);

      RedisClient.srem('name-list', request.name,
        (err:any, replies:any) => {
          console.log(`
          Reply length: ${replies.length}. 
          Reply: ${replies}.`);

          res.json({success: true});
        });

      RedisClient.quit();
    });


  /**
   * Get name list.
   * @static
   */
  // app.get('/api/name-list/mongo',
  //   (req:any, res:any, next:any) => {

  //     Users.find({}, function(err: any, doc: any){
  //       console.log(doc)
  //       res.json({err: err,doc: doc});
  //     });

  //   });
}
