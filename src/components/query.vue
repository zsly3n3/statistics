<template>
  <div>
<el-button type="primary" v-on:click="downloadMater">导出</el-button>
<el-date-picker
      class="datePicker"
      v-model="timestampValue"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp">
      </el-date-picker>
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
        {name: '名称', number: '编号'},
        {name: '韩版设计时尚', number: 'MPM00112'},
        {name: '美版设计时尚', number: 'MPM00113'}
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近两天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      timestampValue: ''
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
</style>
