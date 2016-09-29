import * as express from 'express';
import { mongodb } from '../db/mongodb';


var Schema = mongodb.Schema;    // 创建模型
var userScheMa = new Schema({
  username: { 
    type: String,
    required: [true, '请输入用户名！']
    // enum: ['Coffee', 'Tea']
  },
  password: {
    type: String,
    required: [true, '请输入密码！']
  },
  phone: String,
  email: String,
  sex: Number,
  age: {
    type: Number,
    min:[18, '从你的年龄来看，还是个小屁孩！'],
    max:[120, '从你的年龄来看，您老肯定属乌龟的！']
  },
  level: {
    type: String,
    // default: "1",
    validate: [
      (val: string) => {
        return val != "" && val != "0";
      },
      '请选择等级'
    ]
  },
  create_date: { 
    type: Date, 
    default: Date.now
  }
});  
var Users = mongodb.model('users', userScheMa);


export function UsersServices(app: express.Application) {

  /**
   * 获取所有用户信息
   * @database
   */
  app.get('/api/users',
    (req:any, res:any, next:any) => {
      Users.find({}, 
        (err: any, doc: any) => {
          res.json({err: err, data: doc});
        });
    });

  /**
   * 根据ID获取用户信息
   * @database
   */
  app.get('/api/users/:id',
    (req:any, res:any, next:any) => {
      let condition:any = {};

      if(req.params.id) {
        condition['_id'] = req.params.id;
      }

      Users.find(condition, 
        (err: any, doc: any) => {
          res.json({err: err, data: doc});
        });
    });

  /**
   * 新增-用户
   * @database
   */
  app.post('/api/users',
    (req:any, res:any, next:any) => {
      console.log(req.body)
      let instance = new Users(req.body);
      instance.save(
        (err: any) => {
          res.json({err: err});
        });
    });

  /**
   * 更新-用户
   * @database
   */
  app.put('/api/users',
    (req:any, res:any, next:any) => {
      if (req.body.password == "") {
        delete req.body.password;
      }

      Users.update(
        {_id: req.body.id},
        {$set: req.body}, 
        {runValidators: true}, 
        (err: any) => {
          res.json({err: err});
        });
    });

  /**
   * 删除-单个用户
   * @database
   */
  app.delete('/api/users/:id',
    (req:any, res:any, next:any) => {
      Users.remove(
        req.params.id,
        (err: any) => {
          res.json({err: err});
        });
    });


  /**
   * 删除-多个用户
   * @database
   */
  app.post('/api/users/delAll',
    (req:any, res:any, next:any) => {
      let condition:any = {};

      if(req.body.ids) {
        condition['_id'] = { $in: JSON.parse(req.body.ids) };

        Users.remove(
          condition,
          (err: any) => {
            res.json({err: err});
          });
      } else {
        res.send({err:'用户ID不存在！'});
      }
    });

  /**
   * 用户列表分页数据
   * @database
   */
  app.post('/api/users/findPagination',
    (req:any, res:any, next:any) => {
      let condition = req.body;
      condition.querys = JSON.parse(req.body.querys);

      // 查询条件-用户名模糊查询处理
      if (condition.querys.username) {
        condition.querys.username = new RegExp(condition.querys.username);
      } else {
        delete condition.querys.username;
      }
      // 查询条件-等级判断
      if (condition.querys.level && condition.querys.level == "0") {
        delete condition.querys.level;
      }

      let q = condition.querys||{},  // 查询条件
          sort = condition.sort||"",  // 排序字段
          skipFrom = parseInt(condition.offset)||0,  // 位移
          limit = parseInt(condition.limit)||10;  // 每页显示多少条

      // 设置-排序递增或递减
      if (condition.order=="desc") {
          sort = "-" + sort;
      }

      Users.find(q)
           .sort(sort)
           .skip(skipFrom)
           .limit(limit)
           .exec( 
             (err: any, doc: any) => {
               if (err) res.json({err: err});
               else {
                 Users.count(q, 
                  (err: any, count: any) => {
                     res.json({err: err, data: doc, count: count});
                  })
               }
             });
    });

}