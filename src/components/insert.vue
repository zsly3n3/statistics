<template>
  <div v-loading="querying"
    element-loading-text="执行中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="title">
      <el-upload class="btnImport"
    ref="upload"
    action="/wm/upload/"
    :show-file-list="false"
    :on-change="importFile"
    :auto-upload="false">
  <el-button
   icon="el-icon-upload"
      type="primary">
    导入Excel
  </el-button>
</el-upload>
<!-- <el-date-picker
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
      </el-date-picker> -->
      <el-button class="btnInsert" type="primary" @click="addRow">新增</el-button>
      <el-button class="btnDel" type="danger" @click="delRow">删除</el-button>
      <el-button class="btnCommit" type="success" @click="postData">提交</el-button>
    </div>
<el-table
    :max-height = "tableHeight"
    :data="excelData"
    :cell-style="cellClass"
    @selection-change="handleSelectionChange"
    border>
    <el-table-column
      type="selection"
      width="50">
    </el-table-column>
    <el-table-column
      label="序列"
      width="50"
      align="center">
      <template slot-scope="scope">
       <p>{{scope.$index+1}}</p>
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
    format="HH:mm"
    placeholder="选择时间"
    v-on:change="computeRowTime(scope.$index)">
  </el-time-picker>
      </template>
    </el-table-column>
    <el-table-column
      label="桌号"
      width="90"
      align="center">
      <template slot-scope="scope">
       <el-input :id="tableInputId+scope.$index" @keyup.enter.native="enterNext(0, scope.$index)" v-model="scope.row.tableId" placeholder="桌号"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="联盟"
      width="110"
      align="center">
      <template slot-scope="scope">
        <el-select v-model="scope.row.leagueId" :id="leagueInputId+scope.$index" @keyup.enter.native="enterNext(1, scope.$index)">
          <el-option v-for="item in scope.row.types" :key="item.Id" :label="item.Name" :value="item.Id">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      label="游戏ID"
      width="140"
      align="center">
      <template slot-scope="scope">
       <el-input :id="gidInputId+scope.$index" @keyup.enter.native="enterNext(2, scope.$index)" v-model="scope.row.gid" placeholder="游戏ID" v-on:change="getTR(scope.$index)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
        prop="tid"
        label="玩家账号"
        width="140"
        align="center">
    </el-table-column>
    <el-table-column
      label="带入积分"
      width="90"
      align="center">
      <template slot-scope="scope">
       <el-input :id="scoreInputId+scope.$index" @keyup.enter.native="enterNext(3, scope.$index)" v-model="scope.row.score" placeholder="积分" v-on:change="computeTotal(scope.$index)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="会员积分"
      width="100"
      align="center">
      <template slot-scope="scope">
       <el-input :id="memberInputId+scope.$index" @keyup.enter.native="enterNext(4, scope.$index)" v-model="scope.row.memberScore" placeholder="" ></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="战绩"
      width="100"
      align="center">
      <template slot-scope="scope">
       <el-input :id="recordInputId+scope.$index" @keyup.enter.native="enterNext(5, scope.$index)" v-model="scope.row.record" placeholder="战绩" v-on:change="computeZJ(scope.$index, true)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="保险"
      width="80"
      align="center">
      <template slot-scope="scope">
       <el-input :id="bxInputId+scope.$index" @keyup.enter.native="enterNext(6, scope.$index)" v-on:change="computeBX(scope.$index, true, true)" v-model="scope.row.baoxian" placeholder="保险"></el-input>
      </template>
    </el-table-column>
     <el-table-column
        label="战绩结算"
        width="90"
        align="center">
      <template slot-scope="scope">
       <el-input :id="zjjsInputId+scope.$index" @keyup.enter.native="enterNext(7, scope.$index)" v-model="scope.row.zhanjirs" placeholder="" v-on:change="computeTotal(scope.$index)"></el-input>
      </template>
    </el-table-column>
     <el-table-column
        label="保险结算"
        width="90"
        align="center">
      <template slot-scope="scope">
       <el-input :id="bxjsInputId+scope.$index" @keyup.enter.native="enterNext(8, scope.$index)" v-model="scope.row.baoxianrs" placeholder="" v-on:change="computeTotal(scope.$index)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
        label="总额"
        width="100"
        align="center">
      <template slot-scope="scope">
       <el-input :id="totalInputId+scope.$index" @keyup.enter.native="enterNext(9, scope.$index)" v-model="scope.row.total" placeholder="总额"></el-input>
      </template>
    </el-table-column>
    <el-table-column
        prop="rid"
        label="推荐人"
        width="140"
        align="center">
    </el-table-column>
    <el-table-column
        label="推荐人结算"
        width="100"
        align="center">
      <template slot-scope="scope">
       <el-input :id="tjrjsInputId+scope.$index" @keyup.enter.native="enterNext(10, scope.$index)" v-if="scope.row.isShowReferrer" v-model="scope.row.rgain" placeholder=""></el-input>
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
      tableInputId: 'table_',
      leagueInputId: 'league_',
      gidInputId: 'gid_',
      scoreInputId: 'score_',
      memberInputId: 'member_',
      recordInputId: 'record_',
      bxInputId: 'bx_',
      zjjsInputId: 'zjjs_',
      bxjsInputId: 'bxjs_',
      totalInputId: 'total_',
      tjrjsInputId: 'tjrjs_',
      tableHeight: 0,
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
      jiesuan: [
        {label: 'x', value: false},
        {label: '√', value: true}
      ],
      errorMsg: '', // 错误信息内容
      excelData: [
      ],
      multipleSelection: [],
      errorDialog: false // 错误信息弹窗
    }
  },
  created: function () {
    this.$emit('isHideNav', false)
  },
  mounted: function () {
    this.computeTableHeight(this)
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
    let $t = this
    window.onresize = function () {
      $t.computeTableHeight($t)
    }
    window.setInterval(this.computeTime, 1000 * 60)
  },
  activated: function () {
    this.$emit('switchroute', '/')
    this.computeTableHeight(this)
  },
  methods: {
    enterNext: function (index, rowIndex) {
      var el
      switch (index) {
        case 0:
          el = document.getElementById(this.leagueInputId + rowIndex)
          break
        case 1:
          el = document.getElementById(this.gidInputId + rowIndex)
          break
        case 2:
          el = document.getElementById(this.scoreInputId + rowIndex)
          break
        case 3:
          el = document.getElementById(this.memberInputId + rowIndex)
          break
        case 4:
          el = document.getElementById(this.recordInputId + rowIndex)
          break
        case 5:
          el = document.getElementById(this.bxInputId + rowIndex)
          break
        case 6:
          el = document.getElementById(this.zjjsInputId + rowIndex)
          break
        case 7:
          el = document.getElementById(this.bxjsInputId + rowIndex)
          break
        case 8:
          el = document.getElementById(this.totalInputId + rowIndex)
          break
        case 9:
          el = document.getElementById(this.tjrjsInputId + rowIndex)
          if (el === null || el === undefined) {
            el = document.getElementById(this.tableInputId + rowIndex)
          }
          break
        case 10:
          el = document.getElementById(this.tableInputId + rowIndex)
          break
      }
      if (el !== undefined && el !== null) {
        el.focus()
      }
    },
    computeTableHeight: function ($t) {
      var tableHeight = document.documentElement.clientHeight - 64 - 60
      tableHeight = tableHeight - 30
      $t.tableHeight = tableHeight
    },
    cellClass: function ({row, column, rowIndex, columnIndex}) {
      if (row.isSettled === true) {
        return {'background-color': 'rgb(197, 224, 178)'}
      }
      if (row.isTimeOut === true && columnIndex === 2) {
        return {'background-color': 'red'}
      }
      return {'background-color': 'white'}
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val
    },
    arrToJsonString: function (obj) {
    },
    importFile: function (file) {
      if (this.global.isChrome() === true) {
        this.importFile1(file)
      } else {
        this.importFile2()
      }
    },
    importFile1: function (file) { // 导入excel
      const fileReader = new FileReader()
      let $t = this
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          for (let sheet in workbook.Sheets) {
            let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            $t.dealFile(json)
            break
          }
        } catch (e) {
          console.log(e)
          this.$message.warning('文件类型不正确！')
        }
      }
      fileReader.readAsBinaryString(file.raw)
    },
    importFile2: function () {
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
              tmpData.memberScore = obj.memberScore
              if (obj.total !== undefined && obj.total !== null && obj.total !== '') {
                tmpData.total = obj.total
              }
              if (obj.zhanjirs !== undefined && obj.zhanjirs !== null && obj.zhanjirs !== '') {
                tmpData.zhanjirs = obj.zhanjirs
              }
              if (obj.baoxianrs !== undefined && obj.baoxianrs !== null && obj.baoxianrs !== '') {
                tmpData.baoxianrs = obj.baoxianrs
              }
              if (obj.rgain !== undefined && obj.rgain !== null && obj.rgain !== '') {
                tmpData.rgain = obj.rgain
              }
              if (obj.jiesuan !== undefined && obj.jiesuan !== null && obj.jiesuan === 'x') {
                tmpData.isSettled = false
              } else if (obj.jiesuan !== undefined && obj.jiesuan !== null && obj.jiesuan === '√') {
                tmpData.isSettled = true
              } else {
                tmpData.isSettled = false
              }
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
          tmpData.memberScore = obj.memberScore
          if (obj.total !== undefined && obj.total !== null && obj.total !== '') {
            tmpData.total = obj.total
          }
          if (obj.zhanjirs !== undefined && obj.zhanjirs !== null && obj.zhanjirs !== '') {
            tmpData.zhanjirs = obj.zhanjirs
          }
          if (obj.baoxianrs !== undefined && obj.baoxianrs !== null && obj.baoxianrs !== '') {
            tmpData.baoxianrs = obj.baoxianrs
          }
          if (obj.rgain !== undefined && obj.rgain !== null && obj.rgain !== '') {
            tmpData.rgain = obj.rgain
          }
          if (obj.jiesuan !== undefined && obj.jiesuan !== null && obj.jiesuan === 'x') {
            tmpData.isSettled = false
          } else if (obj.jiesuan !== undefined && obj.jiesuan !== null && obj.jiesuan === '√') {
            tmpData.isSettled = true
          } else {
            tmpData.isSettled = false
          }
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
      var tmpData = {tjrfbxl: 0, bxfl: 0, csl: 0, jiesuan: '', isSettled: false, isTimeOut: false, time: null, isShowReferrer: false, tid_id: 0, rid_id: 0, tableId: '', leagueId: '', gid: '', tid: '', rid: '', score: '', record: '', memberScore: '', total: '', baoxian: '', baoxianrs: '', zhanjirs: '', rgain: '', types: null}
      tmpData.types = $t.types
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
            this.excelData[index].tjrfbxl = 0
            this.excelData[index].csl = 0
            this.excelData[index].bxfl = 0
            return
          }
          this.excelData[index].tid = data['tid']
          this.excelData[index].rid = data['rid']
          this.excelData[index].tid_id = data['tid_id']
          let ridId = data['rid_id']
          this.excelData[index].rid_id = ridId
          var isShowReferrer = true
          if (ridId <= 0) {
            isShowReferrer = false
          }
          this.excelData[index].isShowReferrer = isShowReferrer
          this.excelData[index].tjrfbxl = ridId <= 0 ? 0 : data['tjrfbxl']
          this.excelData[index].csl = data['csl']
          this.excelData[index].bxfl = data['bxfl']
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
              $t.excelData[i].tjrfbxl = 0
              $t.excelData[i].csl = 0
              $t.excelData[i].bxfl = 0
            } else {
              $t.excelData[i].tid = obj['tid']
              $t.excelData[i].rid = obj['rid']
              $t.excelData[i].tid_id = obj['tid_id']
              let ridId = obj['rid_id']
              $t.excelData[i].rid_id = ridId
              var isShowReferrer = true
              if (ridId <= 0) {
                isShowReferrer = false
              }
              $t.excelData[i].isShowReferrer = isShowReferrer
              $t.excelData[i].tjrfbxl = ridId <= 0 ? 0 : obj['tjrfbxl']
              $t.excelData[i].csl = obj['csl']
              $t.excelData[i].bxfl = obj['bxfl']
            }
            var isUpdateTotal = false
            if ($t.excelData[i].total === '') {
              isUpdateTotal = true
            }
            if ($t.excelData[i].rgain === '') {
              $t.computeRgain(i, $t)
            }
            if ($t.excelData[i].zhanjirs === '') {
              $t.computeZJ(i, isUpdateTotal, $t)
            }
            if ($t.excelData[i].baoxianrs === '') {
              $t.computeBX(i, isUpdateTotal, false, $t)
            }
          }
          $t.querying = false
        })
        .catch(err => {
          $t.querying = false
          $t.$message.error(err)
        })
    },
    computeZJ: function (index, isUpdateTotal, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      let record = $t.getNumber($t.excelData[index].record, index, 'record', '战绩')
      let csl = parseFloat($t.excelData[index].csl)
      var zhanjirs
      if (record > 0) {
        let rs = 1 - (csl / parseFloat(100))
        zhanjirs = rs * parseFloat(record)
      } else {
        zhanjirs = record
      }
      this.excelData[index].zhanjirs = zhanjirs.toFixed(0)
      if (isUpdateTotal) {
        $t.computeTotal(index, $t)
      }
    },
    computeBX: function (index, isUpdateTotal, isUpdateRgain, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      var baoxian = $t.getNumber($t.excelData[index].baoxian, index, 'baoxian', '保险')
      let bxfl = parseFloat($t.excelData[index].bxfl) / parseFloat(100)
      $t.excelData[index].baoxianrs = (parseFloat(Math.abs(baoxian)) * bxfl).toFixed(0)
      if (isUpdateTotal) {
        $t.computeTotal(index, $t)
      }
      if (isUpdateRgain) {
        $t.computeRgain(index, $t)
      }
    },
    computeRgain: function (index, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      let baoxian = $t.getNumber($t.excelData[index].baoxian, index, 'baoxian', '保险')
      if (baoxian < 0) {
        $t.excelData[index].rgain = 0
      } else {
        let rs = parseFloat($t.excelData[index].tjrfbxl) / parseFloat(100)
        $t.excelData[index].rgain = (rs * parseFloat(baoxian)).toFixed(0)
      }
    },
    computeTotal: function (index, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      let score = $t.getNumber($t.excelData[index].score, index, 'score', '带入积分')
      let zhanjirs = $t.getNumber($t.excelData[index].zhanjirs, index, 'zhanjirs', '战绩结算')
      let baoxianrs = $t.getNumber($t.excelData[index].baoxianrs, index, 'baoxianrs', '保险结算')
      $t.excelData[index].total = (score + zhanjirs + baoxianrs).toFixed(0)
    },
    computeTime: function () {
      for (var i = 0; i < this.excelData.length; i++) {
        this.computeRowTime(i)
      }
    },
    computeRowTime: function (index) {
      let date = this.excelData[index].time
      var rs = false
      if (date === undefined || date === null) {
        this.excelData[index].isTimeOut = false
        return
      }
      let current = new Date()
      let hour = date.getHours()
      let min = date.getMinutes()
      let cH = current.getHours()
      let cM = current.getMinutes()
      if (cH > hour) {
        rs = true
      } else if (cH === hour) {
        if (cM >= min) {
          rs = true
        }
      }
      this.excelData[index].isTimeOut = rs
    },
    getNumber: function (str, index, key, field) {
      var rs
      if (str === '') {
        rs = 0
      } else {
        rs = this.global.isNumber(str)
        if (!rs) {
          let errStr = '第' + (index + 1) + '行中的' + field + '字段,输入的不是数字格式!'
          this.$message.error(errStr)
          this.excelData[index][key] = ''
          rs = 0
        } else {
          rs = this.global.handleSpecialNumber(str)
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
  height: 64px;
  margin-top:20px;
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
td.el-table_1_column_3.is-center{
  background-color: red;
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
