<template>
  <div v-loading="querying"
    element-loading-text="执行中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="title">
      <el-button class="btnImport" type="primary" @click="uploadFile">导入Excel</el-button>
      <el-button class="btnInsert" type="primary" @click="addRow">新增</el-button>
      <el-button class="btnDel" type="danger" @click="delRow">删除</el-button>
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
      <el-button class="btnCommit" type="success" @click="postData">提交</el-button>
    </div>
<el-table
    :data="excelData"
    :row-style="rowClass"
    @selection-change="handleSelectionChange"
    border>
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="桌号"
      width="130"
      align="center">
      <template slot-scope="scope">
       <el-input v-model="scope.row.tableId" placeholder="请输入桌号"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="联盟"
      width="110"
      align="center">
      <template slot-scope="scope">
        <el-select v-model="scope.row.leagueId">
          <el-option v-for="item in scope.row.types" :key="item.Id" :label="item.Name" :value="item.Id">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
     <el-table-column
      label="游戏ID"
      width="160"
      align="center">
      <template slot-scope="scope">
       <el-input v-model="scope.row.gid" placeholder="请输入游戏ID" v-on:change="getTR(scope.$index)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
        prop="tid"
        label="玩家账号"
        width="160"
        align="center">
    </el-table-column>
    <el-table-column
      label="带入积分"
      width="130"
      align="center">
      <template slot-scope="scope">
       <el-input v-model="scope.row.score" placeholder="请输入积分" v-on:change="computeJieYu(scope.$index)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="战绩(正负数)"
      width="212"
      align="center">
      <template slot-scope="scope">
       <el-input style="width:110px;" v-model="scope.row.record" placeholder="请输入战绩" v-on:change="computeJieYu(scope.$index)"></el-input>
       <el-select v-on:change="computeJieYu(scope.$index)" style="width:76px;" v-model="scope.row.percent">
          <el-option v-for="item in scope.row.percents" :key="item.label" :label="item.label" :value="item.value">
       </el-option>
       </el-select>
      </template>
    </el-table-column>
     <el-table-column
        prop="jieyu"
        label="结余"
        width="100"
        align="center">
    </el-table-column>
    <el-table-column
      label="保险"
      width="130"
      align="center">
      <template slot-scope="scope">
       <el-input v-on:change="computeBaoXianHuoDongShu(scope.$index,true)" v-model="scope.row.baoxian" placeholder="请输入保险"></el-input>
      </template>
    </el-table-column>
 <el-table-column
      label="保险返利"
      width="110"
      align="center">
      <template slot-scope="scope">
       <el-select v-on:change="computeBaoXianHuoDongShu(scope.$index,false)" v-model="scope.row.baoxianfanli">
          <el-option v-for="item in scope.row.fanli" :key="item.label" :label="item.label" :value="item.value">
       </el-option>
       </el-select>
      </template>
    </el-table-column>
     <el-table-column
        prop="baoxianrs"
        label="保险活动数"
        width="160"
        align="center">
    </el-table-column>
    <el-table-column
        prop="rid"
        label="推荐人"
        width="160"
        align="center">
    </el-table-column>
    <el-table-column
      label="推荐人返利"
      width="110"
      align="center">
      <template slot-scope="scope">
       <el-select v-if="scope.row.isShowReferrer" v-on:change="computeRgain(scope.$index)" v-model="scope.row.rgainper">
          <el-option v-for="item in scope.row.fanli" :key="item.label" :label="item.label" :value="item.value">
       </el-option>
       </el-select>
      </template>
    </el-table-column>
    <el-table-column
        label="推荐人返利结果"
        width="120"
        align="center">
      <template slot-scope="scope">
       <p v-if="scope.row.isShowReferrer">{{scope.row.rgain}}</p>
      </template>
    </el-table-column>
    <el-table-column
        label="结算时间"
        width="150"
        align="center">
      <template slot-scope="scope">
        <el-time-picker style="width:120px;"
    v-model="scope.row.time"
    :picker-options="{
      selectableRange: '00:00:00 - 23:59:00'
    }"
    placeholder="选择时间">
  </el-time-picker>
      </template>
    </el-table-column>
  <el-table-column
      label="是否结算"
      width="80"
      align="center">
      <template slot-scope="scope">
       <el-select v-model="scope.row.isSettled">
         <el-option v-for="item in scope.row.jiesuan" :key="item.label" :label="item.label" :value="item.value">
         </el-option>
       </el-select>
      </template>
    </el-table-column>
</el-table>

<input type="file" @change="importFile2(this)" id="imFile" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
<el-dialog title="提示" v-model="errorDialog">
<span>{{errorMsg}}</span>
<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="errorDialog=false">确认</el-button>
</span>
</el-dialog>
</div>
</template>
<script>
var XLSX = require('xlsx')
export default {
  name: 'insert',
  data () {
    return {
      querying: false,
      pickerOptions: {
        shortcuts: [
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
      timestampValue: '',
      types: [],
      percents: [
        {label: '0', value: 0.0},
        {label: '3%', value: 0.97},
        {label: '5%', value: 0.95}
      ],
      fanli: [
        {label: '10%', value: 0.1},
        {label: '15%', value: 0.15},
        {label: '20%', value: 0.2}
      ],
      jiesuan: [
        {label: 'x', value: false},
        {label: '√', value: true}
      ],
      errorMsg: '', // 错误信息内容
      excelData: [
      ],
      multipleSelection: [],
      imFile: '', // 导入文件el
      errorDialog: false // 错误信息弹窗
    }
  },
  created: function () {
    this.$emit('isHideNav', false)
  },
  mounted: function () {
    this.querying = true
    this.$http.get(this.global.serverPath + '/getleague')
      .then(res => {
        this.types = res['data']
        this.querying = false
      })
      .catch(err => {
        this.$message.error(err)
        this.querying = false
      })
    this.imFile = document.getElementById('imFile')
    window.setInterval(this.computeTime, 1000)
  },
  activated: function () {
    this.$emit('switchroute', '/')
  },
  methods: {
    rowClass: function ({row, rowIndex}) {
      if (row.isSettled === true) {
        return {'background-color': 'red'}
      }
      if (row.isTimeOut === true) {
        return {'background-color': 'blue'}
      }
      return {'background-color': 'white'}
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val
    },
    arrToJsonString: function (obj) {
    },
    uploadFile: function () {
      this.imFile.click()
    },
    importFile2: function () { // 导入excel
      this.querying = true
      let obj = this.imFile
      if (!obj.files) {
        this.querying = false
        return
      }
      var f = obj.files[0]
      var reader = new FileReader()
      let $t = this
      reader.onload = function (e) {
        var data = e.target.result
        if ($t.rABS) {
          $t.wb = XLSX.read(btoa(this.fixdata(data)), {type: 'base64'})
        } else {
          $t.wb = XLSX.read(data, {type: 'binary'})
        }
        let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
        $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
      }
      if (this.rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    importFile: function () {
      this.file = event.currentTarget.files[0]
      var rABS = false
      var f = this.file
      var reader = new FileReader()
      let $t = this
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = ''
        var rABS = false
        var wb
        var outdata
        var reader = new FileReader()
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          var i
          for (i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          if (rABS) {
            wb = XLSX.read(btoa(this.fixdata(binary)), {
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          this.da = [...outdata]
          if (this.da.length >= 2) {
            $t.excelData.length = 0
            for (i = 1; i < this.da.length; i++) {
              let obj = this.da[i]
              var tmpData = $t.createTmpData($t)
              tmpData.tableId = obj.tableId
              tmpData.gid = obj.gid
              tmpData.score = obj.score
              tmpData.record = obj.record
              tmpData.baoxian = obj.baoxian
              tmpData.leagueId = $t.getLeagueId(obj.league, $t)
              $t.excelData.push(tmpData)
            }
          }
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    analyzeData: function (data) {
      return data
    },
    dealFile: function (data) {
      this.imFile.value = ''
      this.querying = false
      if (data.length <= 1) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      } else {
        let $t = this
        $t.excelData.length = 0
        var arr = []
        for (var i = 1; i < data.length; i++) {
          let obj = data[i]
          var tmpData = $t.createTmpData($t)
          tmpData.tableId = obj.tableId
          tmpData.gid = obj.gid
          tmpData.score = obj.score
          tmpData.record = obj.record
          tmpData.baoxian = obj.baoxian
          tmpData.leagueId = $t.getLeagueId(obj.league, $t)
          $t.excelData.push(tmpData)
          arr.push(obj.gid)
        }
        $t.getTRs($t, arr)
      }
    },
    fixdata: function (data) {
      var o = ''
      var l = 0
      var w = 10240
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    addRow: function () {
      let tmpData = this.createTmpData(this)
      this.excelData.splice(0, 0, tmpData)
    },
    createTmpData: function ($t) {
      var tmpData = {isSettled: false, isTimeOut: false, time: null, isShowReferrer: false, tid_id: 0, rid_id: 0, tableId: '', leagueId: '', gid: '', tid: '', rid: '', score: '', record: '', percent: 0, jieyu: '', baoxian: '', baoxianfanli: 0.1, baoxianrs: '', rgainper: 0.1, rgain: '', percents: null, fanli: null, jiesuan: null, types: null}
      tmpData.percents = $t.percents
      tmpData.types = $t.types
      tmpData.fanli = $t.fanli
      tmpData.jiesuan = $t.jiesuan
      return tmpData
    },
    postData: function () {
      var date = this.excelData[0].time
      console.log(date.getHours())
      console.log(date.getMinutes())
      console.log(date.getSeconds())
    },
    getTR: function (index) {
      this.querying = true
      let url = '/getTRWithGName/' + this.excelData[index].gid
      this.$http.get(this.global.serverPath + url)
        .then(res => {
          let data = res['data']['data']
          if (data === null || data === undefined) {
            this.querying = false
            this.excelData[index].tid = ''
            this.excelData[index].rid = ''
            this.excelData[index].tid_id = 0
            this.excelData[index].rid_id = 0
            this.excelData[index].isShowReferrer = false
            return
          }
          this.excelData[index].tid = data['tid']
          this.excelData[index].rid = data['rid']
          this.excelData[index].tid_id = data['tid_id']
          let ridId = data['rid_id']
          this.excelData[index].rid_id = ridId
          this.excelData[index].isShowReferrer = ridId <= 0 ? 'false' : 'true'
          this.querying = false
        })
        .catch(err => {
          this.$message.error(err)
          this.querying = false
        })
    },
    getTRs: function ($t, arr) {
      $t.querying = true
      $t.$http.post($t.global.serverPath + '/getTRWithGNames', JSON.stringify({gids: arr}))
        .then(res => {
          let data = res['data']['data']
          for (var i = 0; i < data.length; i++) {
            let obj = data[i]
            if (obj === null || obj === undefined) {
              $t.excelData[i].tid = ''
              $t.excelData[i].rid = ''
              $t.excelData[i].tid_id = 0
              $t.excelData[i].rid_id = 0
              $t.excelData[i].isShowReferrer = false
            } else {
              $t.excelData[i].tid = obj['tid']
              $t.excelData[i].rid = obj['rid']
              $t.excelData[i].tid_id = obj['tid_id']
              let ridId = obj['rid_id']
              $t.excelData[i].rid_id = ridId
              $t.excelData[i].isShowReferrer = ridId <= 0 ? 'false' : 'true'
            }
          }
          $t.querying = false
        })
        .catch(err => {
          $t.querying = false
          $t.$message.error(err)
        })
    },
    computeJieYu: function (index) {
      let score = this.getNumber(this.excelData[index].score, index, 'score', '带入积分')
      let record = this.getNumber(this.excelData[index].record, index, 'record', '战绩')
      let percent = this.excelData[index].percent
      var rs
      if (record > 0) {
        let tmp = (record * percent).toFixed(0)
        rs = Number(tmp) + score
      } else {
        rs = record + score
      }
      this.excelData[index].jieyu = rs.toFixed(4)
    },
    computeBaoXianHuoDongShu: function (index, isUpdateReferrer) {
      let bx = this.getNumber(this.excelData[index].baoxian, index, 'baoxian', '保险')
      let percent = this.excelData[index].baoxianfanli
      var rs
      if (bx >= 0) {
        rs = (bx * percent).toFixed(4)
      } else {
        rs = parseInt(bx * -(0.1))
      }
      this.excelData[index].baoxianrs = rs
      if (isUpdateReferrer === true) {
        this.computeRgain(index)
      }
    },
    computeRgain: function (index) {
      let bx = this.getNumber(this.excelData[index].baoxian, index, 'baoxian', '保险')
      let percent = this.excelData[index].rgainper
      var rs
      if (bx > 0) {
        rs = (bx * percent).toFixed(4)
      } else {
        rs = 0
      }
      this.excelData[index].rgain = rs
    },
    computeTime: function () {
      for (var i = 0; i < this.excelData.length; i++) {
        let date = this.excelData[i].time
        var rs = false
        if (date === undefined || date === null) {
          return
        }
        let current = new Date()
        let hour = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
        let cH = current.getHours()
        let cM = current.getMinutes()
        let cS = current.getSeconds()
        if (cH > hour) {
          rs = true
        } else if (cH === hour) {
          if (cM > min) {
            rs = true
          } else if (cM === min) {
            if (cS >= sec) {
              rs = true
            }
          }
        }
        this.excelData[i].isTimeOut = rs
      }
    },
    getNumber: function (str, index, key, field) {
      var rs
      if (str === '') {
        rs = 0
      } else {
        rs = Number(str)
        if (isNaN(rs)) {
          let errStr = '第' + (index + 1) + '行中的' + field + '字段,输入的不是数字格式!'
          this.$message.error(errStr)
          this.excelData[index][key] = ''
          rs = 0
        }
      }
      return rs
    },
    delRow: function () {
      if (this.multipleSelection.length <= 0) {
        return
      }
      this.$confirm('是否删除所选数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          let obj = this.multipleSelection[i]
          for (var j = 0; j < this.excelData.length; j++) {
            if (this.excelData[j] === obj) {
              this.excelData.splice(j, 1)
              break
            }
          }
        }
      }).catch(() => {
      })
    },
    getLeagueId: function (league, $t) {
      let types = $t.types
      for (var i = 0; i < types.length; i++) {
        let obj = types[i]
        if (league === obj.Name) {
          return obj.Id
        }
      }
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  margin-top:20px;
  text-align: center;
  margin-bottom: 20px;
}
.tableDiv{
   /* width:100%; */
   margin-left:10px;
   margin-right:10px;
}
.el-table th>.cell {
  text-align: center;
}
.el-table{
  width: 100%;
}
.button {
  margin-bottom: 20px;
}
.btnImport{
  float: left;
  margin-left:60px;
}
.btnInsert{
  float: left;
  margin-left:60px;
}
.btnDel{
  float: left;
  margin-left:60px;
}
.btnCommit{
  float: right;
  margin-right:60px;
}
.datePicker{
  width:370px;
}

/* .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: blue !important;
}
.el-table__body tr.el-table__row.hover-row>td{
background-color:blue !important;
}
.el-table .warning-row {
  background: yellow !important;
}

.el-table .success-row {
  background: green !important;
} */
</style>
