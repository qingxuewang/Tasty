var sqlMap = {
    user: {
        select_name: 'select userName,userPw from t_admin where userName=',
        update_user: 'update t_admin set userPw='
    },
    message:{
      select_message:'select * from t_message',
      selectOne_message:'select * from t_message where message_name=',
      insertOne:'insert into t_message (message_name,message_title,message_content)  values (?,?,?)',
      updateOne:'update t_message set',
      deleteOne:'delete from t_message where message_id=',
      deleteAll:'delete from t_message where message_id in'
    },
    category:{
      select_category:'select * from t_catelog',
      insertOne:'insert into t_catelog (catelog_name,catelog_des)  values (?,?)',
      updateOne:'update t_catelog set',
      deleteOne:'delete from t_catelog where catelog_id=',
    },
    food:{
      select_food:'select * from t_foods',
      deleteOne:'delete from t_foods where foods_id=',
      updateOne:'update t_foods set',
      insertOne:'insert into t_foods (catelog_id,foods_name,foods_des,foods_img,foods_price)  values (?,?,?,?,?)',
    },
    member:{
      select_member:'select * from t_user',
      deleteOne:'delete from t_user where user_id=',
      deleteAll:'delete from t_user where user_id in',
      selectOne_member:'select * from t_user where user_name=',
    },
    notice:{
      select_notice:'select * from t_notice',
      deleteOne:'delete from t_notice where notice_id=',
      insertOne:'insert into t_notice (notice_title,notice_content,notice_person)  values (?,?,?)',
      updateOne:'update t_notice set',
    },
    order:{
      select_order:'select * from t_order',
      deleteOne:'delete from t_order where order_id=',
      updateOne:'update t_order set order_state = "1" where order_id = ',
    }
}

module.exports = sqlMap;

