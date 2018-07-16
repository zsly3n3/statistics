<template>
  <div id="app">
     <div class="navTitle">
    <div class="navTitleDiv">
    <table border="0" cellpadding="0" cellspacing="0">
    <tr>
    <td class="navTitleTabletd"><label :class="{ navTitlelabelVisited: isSubmitted1 }" id="btnHome" @click="switchRoute('/')" class="navTitlelabel" >数据导入</label></td>
    <td class="navTitleTabletd"><label :class="{ navTitlelabelVisited: isSubmitted2 }" id="btnAbout" @click="switchRoute('/aboutus')" class="navTitlelabel" >查询数据</label></td>
    <td class="navTitleTabletd"><label :class="{ navTitlelabelVisited: isSubmitted3 }" id="btnGallery" @click="switchRoute('/gallery')" class="navTitlelabel" >每日统计</label></td>
    </tr>
    </table>
    <div id="navTitleline" v-bind:class="{ navTitlelineTransition: isTransition }"></div>
    </div>
    </div>
     <keep-alive>
      <router-view @switchroute="switchRoute"></router-view>
     </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isSubmitted1: false,
      isSubmitted2: false,
      isSubmitted3: false,
      isTransition: false
    }
  },
  mounted: function () {
    this.isTransition = false
    this.updateLabelStatus(this.$route.path)
    setTimeout(() => {
      this.isTransition = true
    }, 20)
  },
  methods: {
    switchRoute: function (path) {
      this.updateLabelStatus(path)
      if (path !== this.$route.path) {
        this.$router.push({ path: path })
      }
    },
    updateLabelStatus: function (path) {
      let marginRight = 20
      var lineWidth = 0
      var marginLeft = 0
      let btnHome = document.getElementById('btnHome')
      let btnAbout = document.getElementById('btnAbout')
      let btnGallery = document.getElementById('btnGallery')
      switch (path) {
        case '/':
          this.isSubmitted1 = true
          this.isSubmitted2 = false
          this.isSubmitted3 = false
          lineWidth = btnHome.offsetWidth
          break
        case '/aboutus':
          this.isSubmitted1 = false
          this.isSubmitted2 = true
          this.isSubmitted3 = false
          lineWidth = btnAbout.offsetWidth
          marginLeft = btnHome.offsetWidth + marginRight
          break
        case '/gallery':
          this.isSubmitted1 = false
          this.isSubmitted2 = false
          this.isSubmitted3 = true
          lineWidth = btnGallery.offsetWidth
          marginLeft = btnHome.offsetWidth + btnAbout.offsetWidth + 2 * marginRight
          break
        default:
          break
      }
      let line = document.getElementById('navTitleline')
      line.style.width = lineWidth + 'px'
      line.style.marginLeft = marginLeft + 'px'
    }
  }
}
</script>

<style>
#app {
  width:auto;
}
.navTitle{
   width: 100%;
   height:40px;
}
.navTitleDiv{
  float:left;
  margin-top:5px;
  margin-left:4%;
}
.navTitleTabletd{
   text-align: left;
   width:auto;
   height: auto;
}
.navTitlelabel{
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #888ba2;
  border: 0px none;
  outline: none;
  margin-right:20px;
  font-size: 16px;
  font-weight:normal;
}
.navTitlelabel:hover{
  color:#4b59bc;
  border: none;
  cursor: hand;
  cursor: pointer;
}
.navTitlelabelVisited{
  color: #4b59bc;
}
.navTitlelineTransition{
  transition: margin-left 0.3s ;
}
#navTitleline{
  float: left;
  width:40px;
  height:3px;
  margin-top:0px;
  background-color: #4b59bc;
}
</style>
