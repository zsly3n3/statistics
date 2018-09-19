<template>
  <div>
<el-button type="primary" v-on:click="downloadMater">导出</el-button>
  </div>
</template>
<script>
var XLSX = require('xlsx')
var FileSaver = require('file-saver')
export default {
  name: 'query',
  data () {
    return {
      exportList: [
        {name: '韩版设计时尚风衣大', number: 'MPM00112', salePrice: '￥999.00', stocknums: 3423, salesnums: 3423, sharenums: 3423},
        {name: '韩版设计时尚', number: 'MPM00113', salePrice: '￥999.00', stocknums: 3423, salesnums: 3423, sharenums: 3423}
      ]
    }
  },
  created: function () {
    this.$emit('isHideNav', false)
  },
  activated: function () {
    this.$emit('switchroute', '/query')
  },
  methods: {
    downloadMater: function () {
      const wopts = {bookType: 'xlsx', bookSST: false, type: 'binary', showGridLines: false}
      const wb = {SheetNames: ['Sheet1'], Sheets: {}, Props: {}}
      let data = this.exportList
      wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
      let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], {type: 'application/octet-stream'})
      FileSaver.saveAs(tmpDown, 'hello world.xlsx')
    },
    s2ab (s) {
      var buf
      var i
      if (typeof ArrayBuffer !== 'undefined') {
        buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xFF
        }
        return buf
      } else {
        buf = new Array(s.length)
        for (i = 0; i !== s.length; ++i) {
          buf[i] = s.charCodeAt(i) & 0xFF
        }
        return buf
      }
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
