<template>
  <div v-loading="querying"
    element-loading-text="执行中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="d1">
     <table class="table1" cellpadding="0" cellspacing="0">
       <tr>
         <td>
           <el-select v-model="queryIndex">
             <el-option v-for="item in types" :key="item.id" :label="item.label" :value="item.id">
             </el-option>
           </el-select>
         </td>
         <td>
           <el-input class="queryText" v-model="queryText" placeholder="根据选项输入内容"></el-input>
         </td>
         <td>
           <el-button class="queryBtn" type="primary" @click="queryTidGidRid">查询</el-button>
         </td>
       </tr>
     </table>
    </div>
    <hr>
    <div class="d2">
      <el-table :data="tableData" :border="true">
        <el-table-column label="玩家账号" width="200">
          <template slot-scope="scope">
            <el-input :id="wjzhInputId" v-if="scope.row.showTid" v-model="scope.row.tid" @keyup.enter.native="enterNext(0, scope.$index)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="游戏ID" width="380">
          <template slot-scope="scope">
            <el-input :id="gidInputId+scope.$index" v-on:change="gidChange(scope.row.gid,scope.$index)" style="width:240px;" v-model="scope.row.gid" @keyup.enter.native="enterNext(5, scope.$index)"></el-input>
            <el-button v-if="scope.row.showBtn" class="removeBtn" size="mini" type="danger" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="推荐人" width="200">
          <template slot-scope="scope">
            <el-input :id="tjrInputId" v-if="scope.row.showRid" v-model="scope.row.rid" @keyup.enter.native="enterNext(1, scope.$index)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="抽水率" width="110">
          <template slot-scope="scope">
            <el-input :id="choushuilvKey" v-if="scope.row.showRid" v-model="scope.row.csl" @keyup.enter.native="enterNext(2, scope.$index)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="保险返率" width="110">
          <template slot-scope="scope">
            <el-input :id="baoxianfanlvKey" v-if="scope.row.showRid" v-model="scope.row.bxfl" @keyup.enter.native="enterNext(3, scope.$index)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="推荐人返保险率" width="130">
          <template slot-scope="scope">
            <el-input :id="tuijianrenfanlvKey" v-if="scope.row.showRid" v-model="scope.row.tjrfbxl" @keyup.enter.native="enterNext(4, scope.$index)"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="d3">
       <el-button type="success" @click="insertgidtidrid">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'gameid',
  data () {
    return {
      gidInputId: 'gid',
      wjzhInputId: 'wjzh',
      tjrInputId: 'tjr',
      choushuilvKey: 'csl',
      baoxianfanlvKey: 'bxfl',
      tuijianrenfanlvKey: 'tjrfbxl',
      querying: false,
      queryIndex: 0,
      queryText: '',
      types: [
        {label: '玩家账号', id: 0}, {label: '游戏ID', id: 1}, {label: '推荐人', id: 2}
      ],
      tableData: [
        {gid: '', rid: '', showBtn: false, showTid: true, showRid: true, 'csl': '', 'bxfl': '', 'tjrfbxl': ''}
      ]
    }
  },
  created: function () {
    this.$emit('isHideNav', false)
  },
  methods: {
    enterNext: function (index, rowIndex) {
      var el
      switch (index) {
        case 0:
          el = document.getElementById(this.gidInputId + rowIndex)
          break
        case 1:
          el = document.getElementById(this.choushuilvKey)
          break
        case 2:
          el = document.getElementById(this.baoxianfanlvKey)
          break
        case 3:
          el = document.getElementById(this.tuijianrenfanlvKey)
          break
        case 4:
          el = document.getElementById(this.wjzhInputId)
          break
        case 5:
          el = document.getElementById(this.gidInputId + rowIndex)
          let row = rowIndex + 1
          if (row === this.tableData.length) {
            el = document.getElementById(this.tjrInputId)
          } else {
            el = document.getElementById(this.gidInputId + row)
          }
          break
      }
      if (el !== undefined && el !== null) {
        el.focus()
      }
    },
    queryTidGidRid: function () {
      if (this.queryText === '') {
        this.$message.error('输入内容不能为空')
        return
      }
      this.querying = true
      var queryUrl = ''
      switch (this.queryIndex) {
        case 0:
          queryUrl = '/getGTRWithTName/' + this.queryText
          break
        case 1:
          queryUrl = '/getGTRWithGName/' + this.queryText
          break
        case 2:
          queryUrl = '/getGTRWithRName/' + this.queryText
          break
      }
      this.$http.get(this.global.serverPath + queryUrl)
        .then(res => {
          var data = res['data']['data']
          if (data === null) {
            this.tableData = [{tid: '', gid: '', rid: '', showBtn: false, showTid: true, showRid: true}]
          } else {
            this.tableData.length = 0
            for (var i = 0; i < data['gids'].length; i++) {
              var obj
              if (i === 0) {
                obj = {gid: data['gids'][i], tid: data['tid'], rid: data['rid'], showBtn: false, showTid: true, showRid: true}
                obj[this.choushuilvKey] = data[this.choushuilvKey]
                obj[this.baoxianfanlvKey] = data[this.baoxianfanlvKey]
                if (data['rid'] !== '') {
                  obj[this.tuijianrenfanlvKey] = data[this.tuijianrenfanlvKey]
                }
              } else {
                obj = {gid: data['gids'][i], showBtn: true, showTid: false, showRid: false}
              }
              this.tableData.push(obj)
            }
          }
          this.querying = false
        })
        .catch(err => {
          this.$message.error(err)
          this.querying = false
        })
    },
    insertgidtidrid: function () {
      if (this.tableData[0].tid === '') {
        this.$message.error('玩家账号不能为空')
        return
      }
      if (this.tableData[0].gid === '') {
        this.$message.error('游戏ID不能为空')
        return
      }
      var choushuilv = this.tableData[0].csl
      if (choushuilv === '') {
        this.$message.error('抽水率不能为空')
        return
      }
      if (!this.global.isNumber(choushuilv)) {
        this.$message.error('抽水率只能为数字')
        return
      }
      let nChoushuilv = Number(choushuilv)
      if (nChoushuilv < 0 || nChoushuilv > 100) {
        this.$message.error('抽水率只能输入0到100')
        return
      }
      var baoxianfanlv = this.tableData[0].bxfl
      if (baoxianfanlv === '') {
        this.$message.error('保险返率不能为空')
        return
      }
      if (!this.global.isNumber(baoxianfanlv)) {
        this.$message.error('保险返率只能为数字')
        return
      }
      let nbaoxianfanlv = Number(baoxianfanlv)
      if (nbaoxianfanlv < 0 || nbaoxianfanlv > 100) {
        this.$message.error('保险返率只能输入0到100')
        return
      }
      var tuijianrenfanlv = this.tableData[0].tjrfbxl
      if (this.tableData[0].rid === '') {
        this.tableData[0].tjrfbxl = ''
      } else {
        if (tuijianrenfanlv === '') {
          this.$message.error('推荐人返保险率不能为空')
          return
        }
        if (!this.global.isNumber(tuijianrenfanlv)) {
          this.$message.error('推荐人返保险率只能为数字')
          return
        }
        let ntuijianrenfanlv = Number(tuijianrenfanlv)
        if (ntuijianrenfanlv < 0 || ntuijianrenfanlv > 100) {
          this.$message.error('推荐人返保险率只能输入0到100')
          return
        }
      }
      this.$confirm('是否确认提交数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.querying = true
        var arr = []
        for (var i = 0; i < this.tableData.length; i++) {
          let gid = this.tableData[i].gid
          if (gid !== '') {
            arr.push(gid)
          }
        }
        choushuilv = this.global.handleSpecialNumber(Number(choushuilv))
        baoxianfanlv = this.global.handleSpecialNumber(Number(baoxianfanlv))
        var json = {tid: this.tableData[0].tid, rid: this.tableData[0].rid, gids: arr, csl: choushuilv, bxfl: baoxianfanlv}
        if (tuijianrenfanlv !== '') {
          tuijianrenfanlv = this.global.handleSpecialNumber(Number(tuijianrenfanlv))
          json[this.tuijianrenfanlvKey] = tuijianrenfanlv
        }
        this.$http.post(this.global.serverPath + '/insertgidtidrid', JSON.stringify(json))
          .then(res => {
            var code = res['data']['code']
            var msg = this.global.codeError[code]
            if (msg === undefined) {
              this.$message({message: '提交成功', type: 'success'})
            } else {
              this.$message.error(msg)
            }
            this.querying = false
          })
          .catch(err => {
            this.$message.error(err)
            this.querying = false
          })
      }).catch(() => {
      })
    },
    gidChange: function (value, index) {
      if (value === '') {
        if (this.tableData.length > 1) {
          this.tableData.splice(index + 1, 1)
        }
      } else {
        if (index === this.tableData.length - 1) {
          let obj = {tid: '', gid: '', rid: '', showBtn: true, showTid: false, showRid: false}
          this.tableData.push(obj)
        }
      }
      if (this.tableData.length > 1) {
        this.tableData[0].showBtn = true
      } else {
        this.tableData[0].showBtn = false
      }
    },
    deleteRow: function (index) {
      if (index === 0) {
        this.tableData[1].tid = this.tableData[0].tid
        this.tableData[1].rid = this.tableData[0].rid
        this.tableData[1].showBtn = true
        this.tableData[1].showTid = true
        this.tableData[1].showRid = true
      }
      this.tableData.splice(index, 1)
      if (this.tableData.length > 1) {
        this.tableData[0].showBtn = true
      } else {
        this.tableData[0].showBtn = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.d1{
  padding-top:15px;
  padding-bottom:15px;
  margin:auto;
  width:500px;
}
.queryText{
  margin-left:15px;
  width: 260px;
}
.queryBtn{
  margin-left:15px;
}
.d2{
  margin:auto;
  width:100%;
}
.d3{
  padding-top:20px;
  margin:auto;
  width:500px;
  text-align: center;
}
.removeBtn{
 margin-left:31px;
}
</style>
