<template>
  <div class="wrap">
    <ul class="tab border-b">
      <li class="tab-item current">
        <span>热门</span>
      </li>
      <li class="tab-item">
        <span>热门</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {

}
</script>
 <style lang="stylus" scoped>
 li {
   list-style: none;
 }

 .wrap {
   width: 100%;
 }

 .tab {
   width: 100%;
   position: absolute;
   top: 0;
   left: 0;
   background: #fff;
   display: flex;
   justify-content: center;
 }

 .tab .tab-item {
   /* width: 100%; */
   width: 109px;
   display: inline-block;
   text-align: center;
   font-size: 15px;
 }

 .tab .tab-item span {
   height: 44px;
   line-height: 44px;
   position: relative;
   display: inline-block;
   padding: 0 10px;
   /* border-bottom: 4px solid #00a5e0; */
 }

 .tab .tab-item span:after {
   content: '';
   position: absolute;
   left: 0;
   bottom: 0;
   right: 0;
   height: 4px;
 }

 .tab .tab-item.current span {
   color: #00a5e0;
 }

 .tab .tab-item.current span:after {
   background: #00a5e0;
 }

 .border-b {
   position: relative;
 }

 .border-b:after {
   content: '';
   position: absolute;
   left: 0;
   bottom: 0;
   display: block;
   width: 100%;
   border-bottom: 1px solid #ccc;
   transform-origin: 0 100%;
   transform: scaleY(0.5);
 }
</style>