<template>
  <div>
      <div class="d1"><p>登录</p></div>
      <table cellpadding="0" cellspacing="0">
          <tr>
            <td><p>账号:&nbsp;&nbsp;</p></td>
            <td><input v-model="account" placeholder="输入账号"></td>
          </tr>
          <tr>
            <td><p>密码:&nbsp;&nbsp;</p></td>
            <td><input type="password" v-model="pwd" placeholder="输入密码"></td>
          </tr>
      </table>
      <div class="d2"><button @click="login">确认登录</button></div>
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
  created: function () {
    this.$emit('isHideNav', true)
  },
  methods: {
    login: function () {
      this.$http.post(this.global.serverPath + '/login', JSON.stringify({name: this.account, pwd: this.pwd}))
        .then(res => {
          var code = res['data']['code']
          var msg = this.global.codeError[code]
          if (msg === undefined) {
            var levelKey = this.global.levelKey
            var level = res['data'][levelKey]
            localStorage.setItem(levelKey, level)
            this.$router.push('/')
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
.d1{
  text-align: center;
  font-size: 20px;
}
.d2{
    text-align: center;
}
table{
    margin: auto;
}
</style>
