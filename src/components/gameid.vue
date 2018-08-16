<template>
  <div v-loading="querying"
    element-loading-text="查询中"
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
    <div v-if="showRS" class="d2">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="tid"
        label="玩家账号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="gid"
        label="游戏ID"
        >
      </el-table-column>
      <el-table-column
        prop="rid"
        label="推荐人"
        width="150">
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'gameid',
  data () {
    return {
      querying: false,
      queryIndex: 0,
      queryText: '',
      showRS: true,
      types: [
        {label: '玩家账号', id: 0}, {label: '游戏ID', id: 1}, {label: '推荐人', id: 2}
      ],
      tableData: [
        {tid: 'wx_123213', gid: 'gameid_123', rid: '等我'}
      ]
    }
  },
  created: function () {
    this.$emit('isHideNav', false)
  },
  methods: {
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
            this.showRS = false
          } else {
            this.showRS = true
          }
          this.querying = false
        })
        .catch(err => {
          this.$message.error(err)
          this.querying = false
        })
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
  width:500px;
}
</style>
