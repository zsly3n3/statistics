<script type="text/javascript">
const serverPath = 'http://127.0.0.1:8181'
const codeError = {
  1: '参数错误,数据为空或者类型不对等',
  2: '登录失败,如无此账号或者密码错误等',
  3: '来自post请求中的Body解析json失败',
  4: 'xorm事务中Get方法执行出错',
  5: 'xorm事务中Exec方法执行出错',
  6: 'xorm事务中Insert方法执行出错',
  7: 'xorm事务中Commit方法执行出错'
}
export default{
  serverPath,
  codeError
}
</script>
