<script type="text/javascript">
const serverPath = 'http://14.29.123.151:8181'
const levelKey = 'level'
const codeError = {
  1: '参数错误,数据为空或者类型不对等',
  2: '登录失败,如无此账号或者密码错误等',
  3: '来自post请求中的Body解析json失败',
  4: 'xorm事务中Get方法执行出错',
  5: 'xorm事务中Exec方法执行出错',
  6: 'xorm事务中Insert方法执行出错',
  7: 'xorm事务中Commit方法执行出错'
}
const isChrome = function () {
  let u = navigator.appVersion
  let webKit = u.indexOf('AppleWebKit') > -1
  return webKit
}
const isNumber = function (str) {
  var rs = true
  var re = /^(-?\d+)(\.\d+)?$/
  if (!re.test(str)) {
    rs = false
  }
  return rs
}
const handleSpecialNumber = function (number) {
  var rs = number.toString()
  rs = Number(rs)
  return rs
}
export default{
  serverPath,
  codeError,
  levelKey,
  isChrome,
  isNumber,
  handleSpecialNumber
}
</script>
