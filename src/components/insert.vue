<template>
  <div class="content">
    <select v-model="ppselected">
        <option v-for="item in types" :key="item.id" :value="item.id">
          {{item.type}}
        </option>
    </select>
<p>{{ppselected}}</p>
<button @click="test"></button>
<br>
<br>
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
</template>
<script>
export default {
  name: 'insert',
  data () {
    return {
      ppselected: 0,
      types: [
        {type: 'typeA', id: 0}, {type: 'typeB', id: 1}, {type: 'typeC', id: 2}
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
      value7: ''
    }
  },
  created: function () {
    this.$emit('isHideNav', false)
  },
  activated: function () {
    this.$emit('switchroute', '/')
  },
  methods: {
    test: function () {
      console.log(this.value7[0])
      console.log(this.value7[1])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
