<template>
  <div>
    <select v-model="ppselected">
        <option v-for="item in types" :key="item.id" :value="item.id">
          {{item.type}}
        </option>
    </select>
<p>{{ppselected}}</p>
<button @click="test"></button>
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
      ]
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
      console.log(this.ppselected)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bg{
  margin: 0;
  padding: 0;
   background-color:red;
}
</style>
