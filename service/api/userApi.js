var $dbConfig = require('../db/DBConfig.js');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap.js');

//使用连接池链接数据库

var pool = mysql.createPool($dbConfig.mysql);

/**
 * 对query执行的结果自定义返回JSON结果
 */
function doReturn(res, results) {
  if(typeof results === 'undefined') {
    res.send('err');
  } else {
    res.send(results);
  }
};
//管理员登陆接口
router.post('/login', (req, res) => {
  var sql = $sql.user.select_name;
  var params = req.body;
  sql+="'"+params.userName+"'";
  pool.query(sql, function(error, results) {
    if (error) {
      console.log(error);
    }
    console.log(results);
    if (results[0] === undefined) {
      res.send('-1');  //查询不出username，data 返回-1
      console.log('用户名不存在');
    }else{
      if(results[0].userPw === params.userPw){
        doReturn(res, results);
      }else{
        res.send('0');
        console.log('用户名存在，密码错误');
      }
    }
  });
});

//留言板接口
router.get('/messages',(req,res)=>{
  var sql = $sql.message.select_message;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.end("查询失败：", error)
    }else{
      doReturn(res,results);
    }
  });
});
//留言板查询接口
router.get('/selectOne',(req,res)=>{
  var sql = $sql.message.selectOne_message;
  var name = req.query.message_name;
  sql+="'"+name+"'";
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.end("查询失败：", error)
    }else{
      doReturn(res,results)
    }
  })
});


//留言增加接口
router.post('/messages',(req,res)=>{
  var sql = $sql.message.insertOne;
  var params = req.body;
  console.log(sql);
  console.log(params);
  pool.query(sql, [params.message_name,params.message_title,params.message_content],function (error,results) {
    if(error){
      res.end("插入失败：", error)
    }else{
      doReturn(res,results);
    }
  })
});
//留言编辑接口
router.post('/updateone',(req,res)=>{
  var sql = $sql.message.updateOne;
  sql += ` message_title = '${req.body.message_title}',message_content = '${req.body.message_content}' where message_id = '${req.body.message_id}'`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.end("查询失败：", error);
    }else{
      doReturn(res,results);
    }
  })
});
//留言删除接口
router.get('/deleteone',(req,res)=>{
  var id=req.query.message_id;
  console.log(id);
  var sql = $sql.message.deleteOne;
  sql += `'${id}'`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      doReturn(res,results);
    }
  })
});

//留言批量删除接口
router.post('/deleteall',(req,res)=>{
  let ids=req.body.ids;
  var sql = $sql.message.deleteAll;
  sql += ` (${ids})`;
  console.log(sql);
    pool.query(sql,function(error,results){
      if(error){
        res.send("查询失败：", error);
      }else{
        res.send('1');
      }
    })
});
//管理员修改密码接口
router.post('/modifyPassword',(req,res)=>{
  let name =req.body.userName;
  let pass =req.body.userPw;
  var sql = $sql.user.update_user;
  sql += `'${pass}' where userName = '${name}'`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});

//菜品类别查询接口
router.get('/category',(req,res)=>{
  pool.query($sql.category.select_category,function (error,results) {
    if(error){
      res.send("查询失败：", error);
    }else {
      doReturn(res,results);
    }
  })
});

//菜品类别新增接口
router.post('/addcategory',(req,res)=>{
  pool.query($sql.category.insertOne,[req.body.catelog_name,req.body.catelog_des],function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});

//菜品类别编辑接口
router.post('/updatecategoryone',(req,res)=>{
  var sql = $sql.category.updateOne;
  sql += ` catelog_name = '${req.body.catelog_name}',catelog_des = '${req.body.catelog_des}' where catelog_id = '${req.body.catelog_id}'`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send("1");
    }
  })
});
//菜品删除接口
router.get('/deletecategoryone',(req,res)=>{
  var catelog_id=req.query.catelog_id;
  console.log(catelog_id);
  var sql = $sql.category.deleteOne;
  sql += `'${catelog_id}'`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});

//菜品查询接口
router.get('/foods',(req,res)=>{
  pool.query($sql.food.select_food,function (error,results) {
    if(error){
      res.send("查询失败：", error);
    }else {
      doReturn(res,results);
    }
  })
});

//菜品删除接口
router.get('/deletefoodone',(req,res)=>{
  var foods_id=req.query.foods_id;
  console.log(foods_id);
  var sql = $sql.food.deleteOne;
  sql += `'${foods_id}'`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});

//菜品编辑接口
router.post('/updatefoodone',(req,res)=>{
  var sql = $sql.food.updateOne;
  sql += ` foods_name = '${req.body.foods_name}',foods_des = '${req.body.foods_des}',foods_img = '${req.body.foods_img}',foods_price = '${req.body.foods_price}' where foods_id = '${req.body.foods_id}'`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send("1");
    }
  })
});

//菜品新增接口
router.post('/addfood',(req,res)=>{
  pool.query($sql.food.insertOne,[req.body.catelog_id,req.body.foods_name,req.body.foods_des,req.body.foods_img,req.body.foods_price],function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});

//会员查询接口
router.get('/member',(req,res)=>{
  pool.query($sql.member.select_member,function (error,results) {
    if(error){
      res.send("查询失败：", error);
    }else {
      doReturn(res,results);
    }
  })
});
//会员删除接口
router.get('/deletememberone',(req,res)=>{
  var user_id=req.query.user_id;
  console.log(user_id);
  var sql = $sql.member.deleteOne;
  sql += `${user_id}`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});
//会员删除接口批量删除接口
router.post('/deletememberall',(req,res)=>{
  let ids=req.body.user_id;
  var sql = $sql.member.deleteAll;
  sql += ` (${ids})`;
  console.log(sql);
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});
//会员查询接口接口
router.get('/selectmemberone',(req,res)=>{
  var sql = $sql.member.selectOne_member;
  var name = req.query.user_name;
  sql+="'"+name+"'";
  pool.query(sql,function(error,results){
    if(error){
      res.end("查询失败：", error)
    }else{
      doReturn(res,results)
    }
  })
});

//公告查询接口
router.get('/notice',(req,res)=>{
  pool.query($sql.notice.select_notice,function (error,results) {
    if(error){
      res.send("查询失败：", error);
    }else {
      doReturn(res,results);
    }
  })
});
//公告新增接口
router.post('/addnotice',(req,res)=>{
  pool.query($sql.notice.insertOne,[req.body.notice_title,req.body.notice_content,req.body.notice_person],function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});
//公告删除接口
router.get('/deletenotice',(req,res)=>{
  var sql = $sql.notice.deleteOne;
  sql += `'${req.query.notice_id}'`;
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send('1');
    }
  })
});
//公告类别编辑接口
router.post('/updatenoticeone',(req,res)=>{
  var sql = $sql.notice.updateOne;
  sql += ` notice_title = '${req.body.notice_title}',notice_content = '${req.body.notice_content}' where notice_id = '${req.body.notice_id}'`;
  pool.query(sql,function(error,results){
    if(error){
      res.send("查询失败：", error);
    }else{
      res.send("1");
    }
  })
});
//订单查询接口
router.get('/order',(req,res)=>{
  pool.query($sql.order.select_order,function (error,results) {
    if(error){
      res.send("查询失败：", error);
    }else {
      doReturn(res,results);
    }
  })
});
//订单删除接口
router.get('/deleteorder',(req,res)=>{
  var sql = $sql.order.deleteOne;
  sql += `'${req.query.order_id}'`;
  pool.query(sql,function(error,results){
    if(error){
      res.send("删除失败：", error);
    }else{
      res.send('1');
    }
  })
});
//订单配送接口
router.get('/updateorder',(req,res)=>{
  var sql = $sql.order.updateOne;
  sql += `'${req.query.order_id}'`;
  console.log(req.query.order_id);
  pool.query(sql,function(error,results){
    if(error){
      res.send("配送失败：", error);
    }else{
      res.send('1');
    }
  })
});
module.exports = router;
