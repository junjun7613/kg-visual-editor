<template>
  <div>
    <Header2 class="header" /> 
    <div class="middle">
      <NuxtPage class="main"/>
    </div>
  </div>
</template>
<style>
.header{
    position: fixed;
    color: #fff;
    background-color: #527b8e;
    width: 100%;
    height: 50px;
    z-index: 1;
}

.middle{
    position:absolute;
    top:50px;
    display:flex
}

.main{
    position: relative;
    /*left: 50px*/
}
</style>
