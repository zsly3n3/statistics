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
      <el-button class="btnInsert" type="primary" @click="addRow">新增</el-button>
      <el-button class="btnDel" type="danger" @click="delRow">删除</el-button>
      <el-button class="btnCommit" type="success" @click="postData">提交</el-button>
    </div>
<el-table
    :data="tableData"
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
       <p>{{scope.row.rowIndex}}</p>
      </template>
    </el-table-column>
    <el-table-column
        label="结算时间"
        width="100"
        align="center">
      <template slot-scope="scope">
  <el-input :id="timeInputId+scope.$index" @keyup.enter.native="enterNext(-1, scope.$index)" v-model="scope.row.min" placeholder="分钟" v-on:change="saveTime(scope.$index)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="桌号"
      width="90"
      align="center">
      <template slot-scope="scope">
       <el-input :id="tableInputId+scope.$index" @keyup.enter.native="enterNext(0, scope.$index)" v-model="scope.row.tableId" placeholder="桌号" v-on:change="isAddRow(scope.$index)"></el-input>
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
       <el-input :id="scoreInputId+scope.$index" @keyup.enter.native="enterNext(3, scope.$index)" v-model="scope.row.score" placeholder="积分" v-on:change="computeTotal(scope.$index,false)"></el-input>
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
       <el-input :id="recordInputId+scope.$index" @keyup.enter.native="enterNext(5, scope.$index)" v-model="scope.row.record" placeholder="战绩" v-on:change="computeZJ(scope.$index, true, false)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="保险"
      width="80"
      align="center">
      <template slot-scope="scope">
       <el-input :id="bxInputId+scope.$index" @keyup.enter.native="enterNext(6, scope.$index)" v-on:change="computeBX(scope.$index, true, true, false)" v-model="scope.row.baoxian" placeholder="保险"></el-input>
      </template>
    </el-table-column>
     <el-table-column
        label="战绩结算"
        width="90"
        align="center">
      <template slot-scope="scope">
       <el-input :id="zjjsInputId+scope.$index" @keyup.enter.native="enterNext(7, scope.$index)" v-model="scope.row.zhanjirs" placeholder="" v-on:change="computeTotal(scope.$index,false)"></el-input>
      </template>
    </el-table-column>
     <el-table-column
        label="保险结算"
        width="90"
        align="center">
      <template slot-scope="scope">
       <el-input :id="bxjsInputId+scope.$index" @keyup.enter.native="enterNext(8, scope.$index)" v-model="scope.row.baoxianrs" placeholder="" v-on:change="computeTotal(scope.$index,false)"></el-input>
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
<el-pagination
  background
  layout="total, sizes, prev, pager, next, jumper"
  :page-size="pageSize"
  :page-sizes="pageSizes"
  :current-page.sync="currentPage"
  :total="excelData.length"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange">
</el-pagination>
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
      currentPage: 0,
      pageSize: 5,
      pageSizes: [],
      tableData: [],
      timeInputId: 'time_',
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
      querying: false,
      types: [],
      jiesuan: [
        {label: 'x', value: false},
        {label: '√', value: true}
      ],
      errorMsg: '', // 错误信息内容
      excelData: [],
      multipleSelection: [],
      errorDialog: false // 错误信息弹窗
    }
  },
  created: function () {
    for (var i = 3; i <= 10; i++) {
      this.pageSizes.push(i)
    }
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
    window.setInterval(this.computeTime, 1000 * 60)
  },
  activated: function () {
    this.$emit('switchroute', '/')
  },
  methods: {
    enterNext: function (index, rowIndex) {
      var el
      switch (index) {
        case -1:
          el = document.getElementById(this.tableInputId + rowIndex)
          break
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
            el = document.getElementById(this.timeInputId + rowIndex)
          }
          break
        case 10:
          el = document.getElementById(this.timeInputId + rowIndex)
          break
      }
      if (el !== undefined && el !== null) {
        el.focus()
      }
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
            var arr = []
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
              tmpData.rowIndex = $t.excelData.length + 1
              arr.splice(0, 0, obj.gid)
              $t.excelData.splice(0, 0, tmpData)
            }
            $t.handleCurrentChange($t.currentPage)
            $t.getTRs($t, arr)
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
          tmpData.rowIndex = $t.excelData.length + 1
          arr.splice(0, 0, obj.gid)
          $t.excelData.splice(0, 0, tmpData)
        }
        $t.handleCurrentChange($t.currentPage)
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
      tmpData.rowIndex = this.excelData.length + 1
      this.excelData.splice(0, 0, tmpData)
      this.handleCurrentChange(this.currentPage)
    },
    createTmpData: function ($t) {
      var tmpData = {tjrfbxl: 0, bxfl: 0, csl: 0, jiesuan: '', isSettled: false, isTimeOut: false, time: null, isShowReferrer: false, tid_id: 0, rid_id: 0, tableId: '', leagueId: '', gid: '', tid: '', rid: '', score: '', record: '', memberScore: '', total: '', baoxian: '', baoxianrs: '', zhanjirs: '', rgain: '', types: null}
      tmpData.types = $t.types
      tmpData.jiesuan = $t.jiesuan
      return tmpData
    },
    postData: function () {
      console.log(this.excelData)
    },
    clearTR: function ($t, index) {
      $t.excelData[index].tid = ''
      $t.excelData[index].rid = ''
      $t.excelData[index].tid_id = 0
      $t.excelData[index].rid_id = 0
      $t.excelData[index].isShowReferrer = false
      $t.excelData[index].tjrfbxl = 0
      $t.excelData[index].csl = 0
      $t.excelData[index].bxfl = 0
    },
    getTR: function (index) {
      let rsIndex = this.getDataIndex(index)
      let data = this.excelData[rsIndex]
      if (data.gid === '') {
        this.clearTR(this, rsIndex)
        return
      }
      this.querying = true
      let url = '/getTRWithGName/' + data.gid
      this.$http.get(this.global.serverPath + url)
        .then(res => {
          let rsData = res['data']['data']
          if (rsData === null || rsData === undefined) {
            this.querying = false
            this.clearTR(this, rsIndex)
            return
          }
          data.tid = rsData['tid']
          data.rid = rsData['rid']
          data.tid_id = rsData['tid_id']
          let ridId = rsData['rid_id']
          data.rid_id = ridId
          var isShowReferrer = true
          if (ridId <= 0) {
            isShowReferrer = false
          }
          data.isShowReferrer = isShowReferrer
          data.tjrfbxl = ridId <= 0 ? 0 : rsData['tjrfbxl']
          data.csl = rsData['csl']
          data.bxfl = rsData['bxfl']
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
            let rsIndex = i
            let rsData = $t.excelData[rsIndex]
            let obj = data[i]
            if (obj === null || obj === undefined) {
              $t.clearTR($t, rsIndex)
            } else {
              rsData.tid = obj['tid']
              rsData.rid = obj['rid']
              rsData.tid_id = obj['tid_id']
              let ridId = obj['rid_id']
              rsData.rid_id = ridId
              var isShowReferrer = true
              if (ridId <= 0) {
                isShowReferrer = false
              }
              rsData.isShowReferrer = isShowReferrer
              rsData.tjrfbxl = ridId <= 0 ? 0 : obj['tjrfbxl']
              rsData.csl = obj['csl']
              rsData.bxfl = obj['bxfl']
            }
            var isUpdateTotal = true
            $t.computeRgain(rsIndex, true, $t)
            $t.computeZJ(rsIndex, isUpdateTotal, true, $t)
            $t.computeBX(rsIndex, isUpdateTotal, false, true, $t)
          }
          $t.querying = false
        })
        .catch(err => {
          $t.querying = false
          $t.$message.error(err)
        })
    },
    computeZJ: function (index, isUpdateTotal, isRealIndex, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      var rsIndex
      if (isRealIndex) {
        rsIndex = index
      } else {
        rsIndex = $t.getDataIndex(index)
      }
      let data = $t.excelData[rsIndex]
      let rowIndex = data.rowIndex
      let record = $t.getNumber(data.record, rowIndex, 'record', '战绩')
      let csl = parseFloat(data.csl)
      var zhanjirs
      if (record > 0) {
        let rs = 1 - (csl / parseFloat(100))
        zhanjirs = rs * parseFloat(record)
      } else {
        zhanjirs = record
      }
      data.zhanjirs = zhanjirs.toFixed(0)
      if (isUpdateTotal) {
        $t.computeTotal(rsIndex, true, $t)
      }
    },
    computeBX: function (index, isUpdateTotal, isUpdateRgain, isRealIndex, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      var rsIndex
      if (isRealIndex) {
        rsIndex = index
      } else {
        rsIndex = $t.getDataIndex(index)
      }
      let data = $t.excelData[rsIndex]
      let rowIndex = data.rowIndex
      var baoxian = $t.getNumber(data.baoxian, rowIndex, 'baoxian', '保险')
      let bxfl = parseFloat(data.bxfl) / parseFloat(100)
      data.baoxianrs = (parseFloat(Math.abs(baoxian)) * bxfl).toFixed(0)
      if (isUpdateTotal) {
        $t.computeTotal(rsIndex, true, $t)
      }
      if (isUpdateRgain) {
        $t.computeRgain(rsIndex, true, $t)
      }
    },
    computeRgain: function (index, isRealIndex, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      var rsIndex
      if (isRealIndex) {
        rsIndex = index
      } else {
        rsIndex = $t.getDataIndex(index)
      }
      let data = $t.excelData[rsIndex]
      let rowIndex = data.rowIndex
      let baoxian = $t.getNumber(data.baoxian, rowIndex, 'baoxian', '保险')
      if (baoxian < 0) {
        data.rgain = 0
      } else {
        let rs = parseFloat(data.tjrfbxl) / parseFloat(100)
        data.rgain = (rs * parseFloat(baoxian)).toFixed(0)
      }
    },
    computeTotal: function (index, isRealIndex, $t) {
      if ($t === undefined || $t === null) {
        $t = this
      }
      var rsIndex
      if (isRealIndex) {
        rsIndex = index
      } else {
        rsIndex = $t.getDataIndex(index)
      }
      let data = $t.excelData[rsIndex]
      let rowIndex = data.rowIndex
      let score = $t.getNumber(data.score, rowIndex, 'score', '带入积分')
      let zhanjirs = $t.getNumber(data.zhanjirs, rowIndex, 'zhanjirs', '战绩结算')
      let baoxianrs = $t.getNumber(data.baoxianrs, rowIndex, 'baoxianrs', '保险结算')
      data.total = (score + zhanjirs + baoxianrs).toFixed(0)
    },
    computeTime: function () {
      for (var i = 0; i < this.excelData.length; i++) {
        this.computeRowTime(i)
      }
    },
    saveTime: function (index) {
      let rsIndex = this.getDataIndex(index)
      let data = this.excelData[rsIndex]
      data.isTimeOut = false
      data.time = null
      let min = Number(data.min)
      if (min <= 0 || min >= 10000 || isNaN(min)) {
        let errStr = '序列' + data.rowIndex + '的结算时间,必须在1到10000分钟内!'
        this.$message.error(errStr)
        data.min = ''
      } else {
        let current = new Date()
        let tmp = current.getMinutes()
        current.setMinutes(tmp + min)
        data.time = current
      }
    },
    computeRowTime: function (index) {
      let data = this.excelData[index]
      let date = data.time
      var rs = false
      if (date === undefined || date === null) {
        data.isTimeOut = false
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
      data.isTimeOut = rs
    },
    getDataIndex: function (index) {
      let pagesize = this.pageSize
      let currentpage = this.currentPage
      let rsIndex = (currentpage - 1) * pagesize + index
      return rsIndex
    },
    getNumber: function (str, index, key, field) {
      var rs
      if (str === '') {
        rs = 0
      } else {
        rs = this.global.isNumber(str)
        if (!rs) {
          let errStr = '序列' + index + '的' + field + '字段,输入的不是数字格式!'
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
              let page = this.currentPage
              this.excelData.splice(j, 1)
              this.reComputeCurrentPage(page)
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
    },
    reComputeCurrentPage: function (page) {
      let total = this.excelData.length
      let n = total / this.pageSize
      let mod = total % this.pageSize
      var pageNum
      if (mod === 0) {
        pageNum = n
      } else {
        pageNum = n + 1
      }
      var rspage = page
      if (page > pageNum) {
        rspage = pageNum
      }
      this.handleCurrentChange(rspage)
      this.reComputeRowIndex()
    },
    reComputeRowIndex: function () {
      var i
      for (i = 0; i < this.excelData.length; i++) {
        let data = this.excelData[i]
        data.rowIndex = this.excelData.length - i
      }
    },
    handleCurrentChange: function (val) {
      let pagesize = this.pageSize
      var currentpage
      if (val === undefined || val === null) {
        currentpage = this.currentPage
      } else {
        currentpage = val
      }
      this.tableData = this.excelData.slice((currentpage - 1) * pagesize, currentpage * pagesize)
    },
    handleSizeChange: function (val) {
      this.pageSize = val
      this.handleCurrentChange()
    },
    isAddRow: function (index) {
      let rsIndex = this.getDataIndex(index)
      let data = this.excelData[rsIndex]
      if (rsIndex === 0 && data.tableId !== '') {
        this.addRow()
      }
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
