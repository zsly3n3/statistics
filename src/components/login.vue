<template>
  <div>
      <div class="d1"><p class="font">登录</p></div>
      <table cellpadding="0" cellspacing="0">
          <tr>
            <td><p class="font">账号:&nbsp;&nbsp;</p></td>
            <td><el-input v-model="account" placeholder="输入账号"></el-input></td>
          </tr>
          <tr>
            <td><p class="font">密码:&nbsp;&nbsp;</p></td>
            <td><el-input type="password" v-model="pwd" placeholder="输入密码"></el-input></td>
          </tr>
      </table>

      <div class="d2"><el-button type="primary" @click="login">确认登录</el-button></div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      account: '',
      pwd: ''
    }
  },
  mounted: function () {
    this.$emit('isHideNav', true)
  },
  methods: {
    login: function () {
      if (this.account === '' || this.pwd === '') {
        this.$message.error('账户和密码都不能为空!')
        return
      }
      this.$http.post(this.global.serverPath + '/login', JSON.stringify({name: this.account, pwd: this.pwd}))
        .then(res => {
          var code = res['data']['code']
          var msg = this.global.codeError[code]
          if (msg === undefined) {
            var levelKey = this.global.levelKey
            var level = res['data'][levelKey]
            localStorage.setItem(levelKey, level)
            this.$router.push('/')
            this.$emit('isHideNav', false)
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.font{
font-size: 25px;
}
.d1{
  text-align: center;
}
.d2{
    text-align: center;
}
table{
    margin: auto;
}
</style>
