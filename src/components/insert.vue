<template>
  <div>
    <div class="title">
      <el-date-picker
      v-model="value7"
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
    <div class="tableDiv">
<el-table
    :data="excelData"
    height="250"
    border>
    <el-table-column
      label="桌号"
      width="130"
      align="center">
      <template slot-scope="scope" class="bg">
       <el-input v-model="input" placeholder="请输入内容"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="联盟"
      width="80"
      align="center">
      <template slot-scope="scope">
        <select v-model="ppselected">
        <option v-for="item in types" :key="item.id" :value="item.id">
          {{item.type}}
        </option>
        </select>
      </template>
    </el-table-column>
  </el-table>
  </div>
<p>{{ppselected}}</p>
<button @click="test"></button>
<br>
<br>
<input type="file" @change="importFile(this)" id="imFile" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
<el-button class="button" @click="uploadFile()">导入</el-button>
<el-dialog title="提示" v-model="errorDialog" size="tiny">
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
      ppselected: 0,
      types: [
        {type: 'a', id: 0}, {type: 'b', id: 1}, {type: 'c', id: 2}
      ],
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
      input: '',
      value7: '',
      imFile: '', // 导入文件el
      errorDialog: false, // 错误信息弹窗
      errorMsg: '', // 错误信息内容
      loading: false,
      excelData: [
        {
          name: '红烧鱼', size: '大', taste: '微辣', price: '40', remain: '100'
        },
        {
          name: '麻辣小龙虾', size: '大', taste: '麻辣', price: '138', remain: '200'
        }
      ]
    }
  },
  created: function () {
    this.$emit('isHideNav', false)
  },
  mounted: function () {
    this.imFile = document.getElementById('imFile')
  },
  activated: function () {
    this.$emit('switchroute', '/')
  },
  methods: {
    test: function () {
      console.log(this.value7[0])
      console.log(this.value7[1])
    },
    arrToJsonString: function (obj) {
      console.log(JSON.stringify(obj))
    },
    uploadFile: function () {
      this.imFile.click()
    },
    importFile: function () { // 导入excel
      this.loading = true
      let obj = this.imFile
      if (!obj.files) {
        this.loading = false
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
        console.log(typeof json)
        $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
      }
      if (this.rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    analyzeData: function (data) {
      return data
    },
    dealFile: function (data) {
      console.log(data)
      this.imFile.value = ''
      this.loading = false
      if (data.length <= 0) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      } else {
        this.excelData = data
        console.log(this.arrToJsonString(data))
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  margin-top:10px;
  text-align: center;
  margin-bottom: 10px;
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
.bg{
  background: #409EFF;
}
.button {
  margin-bottom: 20px;
}
</style>
