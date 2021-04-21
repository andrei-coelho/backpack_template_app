<template>
  <div id="app" class="home">
    <img class="logo" alt="BackPack logo" :src="file('img/logo.png')">
    <button @click="teste">API TEST</button>
    <h5>{{ testeMessage }}</h5>
  </div>
</template>

<script>
export default {
  comments: true,
  name: "home",
  data(){
    return {
      testeMessage: ""
    }
  },
  methods:{
    teste(){
      this.GET('teste', (res, err) => {
       if(!err) this.testeMessage = res.data.message
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

* {
  font-family: Consolas, monaco, monospace;
  margin: 0 auto;
  padding: 0 auto;
}

.logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

button, h5 {
  display: block;
  text-align:center;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 0px) {
    .logo {
      width: 90%;
    }
}

@media (min-width: 768px) {
    .logo {
      width: 70%;
    }
}

@media (min-width: 992px) {
    .logo {
      width: 40%;
    }
}

</style>
