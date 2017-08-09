/**
 * Created by Administrator on 2017/5/23.
 */
window.onload = function(){

    //头部导航栏的透明度
    topBarApha();

    //banner无限轮播
    autoPlayBanner();

    //秒杀倒计时
    seckill();
};

    function topBarApha(){
        //1.获取标签
        var header_box = document.getElementsByClassName("header_box")[0];
        var jd_banner = document.getElementsByClassName("jd_banner")[0];

        //2.定义常量
        var bannerH = jd_banner.offsetHeight;
        var scrollH = 0;
        //让透明度随着屏幕滚动变化
        var alpha = 0;
        //3.获取鼠标滚动事件
        window.onscroll = function () {
            scrollH = document.body.scrollTop;
            if(scrollH>=bannerH){
                alpha = 0.8
            }else{
                alpha = scrollH/bannerH
            }
            header_box.style.backgroundColor = "rgba(201,21,35,"+alpha+")"
        }

    }

    function autoPlayBanner(){
        //1.获取标签
        var jd_banner = document.getElementsByClassName("jd_banner")[0];
        var ul = jd_banner.getElementsByTagName("ul")[0];
        var uli = ul.getElementsByTagName("li");
        var ol = jd_banner.getElementsByTagName("ol")[0];
        var oli = ol.getElementsByTagName("li");


        //定义常量
        var jd_bannerW = jd_banner.offsetWidth;
        var timer = null;
        var index = 1;
        var curX = 0;//记录手势拖拽图片的移动距离

        //平移方法
        function getTranslate(index) {
            ul.style.transform = "translateX(" + (-index*jd_bannerW) + "px)";
            ul.style.webkitTransform = "translateX(" + (-index*jd_bannerW) + "px)";
        }
        //过渡效果  ***注意定时器的时间要大于过渡的时间
        function setTransition(){
            ul.style.transition = "all 0.2s ease ";
            ul.style.webkitTransition = "all 0.2s ease ";
        }
        //移除过渡效果，为了让转动到最后一张直接调回第一张
        function clearTransition(){
            ul.style.transition = "none";
            ul.style.webkitTransition = "none";
        }

        //图片自动滚动:ul每次滚动一个banner的距离
         timer = setInterval(scrollTimer,1500);

         //定时器方法
        function scrollTimer() {
            index++;
            setTransition();
            getTranslate(index);
            changeIndex(index);
         }

        function noTransition() {
            if (index >= uli.length-2) {
                index = 0;
            } else if (index <= 0) {
                index = uli.length-2;
            }
            clearTransition();
            getTranslate(index);
        }
        //transitionend动画结束后调用，用来让图片轮播到最后一张的时候直接回到第一张
        ul.addEventListener("transitionEnd",noTransition);
        ul.addEventListener("webkitTransitionEnd",noTransition);

        //小圆点的跟随运动
        var lastIndex=0;
        function changeIndex(index){
            oli[lastIndex].className ="";
            oli[index-1].className = "current";
            lastIndex = index-1;
        }
        //手势滑动开始
        var startX,moveX,changeX;
            startX=0;
            moveX=0;
            changeX=0;

        //手势运动开始
        ul.addEventListener("touchstart",function(e){
            //停止定时器
            clearInterval(timer);
            startX = e.touches[0].clientX;//获取触摸点离浏览器x距离
            // console.log(startX);
        });
         //手势移动
        ul.parentNode.addEventListener("touchmove",function(e){//ul要有高度
            //清除默认效果
            e.preventDefault();
            moveX = e.touches[0].clientX;
            //获取移动的X值
            changeX = moveX - startX;
            //让ul跟随运动,这是让移动的时候让banner可以跨越几张图让它立即定位在当前位置
            curX = -index*jd_bannerW + changeX;

            clearTransition();
            ul.style.transform = "translateX(" + curX + "px)";
           // getTranslate(index)

        });

        // 手势结束；看图片占那边方向多点松开时就切换占位多的图片
        ul.addEventListener("touchend",function(e){
            console.log(66);
            if(changeX > jd_bannerW*0.49){//距离大于一半的图片宽。向右拉
                index--;
            }else if(changeX <-jd_bannerW*0.49){//向左拉
                index++;
            }
            setTransition();
            getTranslate(index);
            changeIndex(index);
            //重启定时器
            timer = setInterval(scrollTimer,1500);
            //数据重置
            startX=0;
            moveX=0;
            changeX=0;
        })


    }


    // 0  -  8  -  16
    function seckill() {
        //1获取标签
        var box = document.getElementsByClassName("product_seckill")[0];
        var em = box.getElementsByTagName("em")[0];
        var span = box.getElementsByTagName("span");
        console.log(span);

        setInterval(function () {
            //2、获取当前时间
            var date = new Date();
            // console.log(date);
            var now_h = date.getHours();
            var now_m = date.getMinutes();
            var now_s = date.getSeconds();


            var nth =0;
            var leftH = 0 ;
            var leftM = 0 ;
            var leftS = 0 ;

            //0-8-18-24  每隔8小时一场
            if(now_h>0 &&now_h<8){//判断  当在0-8时间内不变 其他场次每隔n小时执行一次
                nth = 0 ;  //0点场
            }else{
                var  n = 8 ;//每隔多少小时执行一场
                var nth = Math.floor(now_h/n)*n;//判断当前时间处于第几次，向下取整确保到达下一个场次前，到了下个场次时是整除。
            }
            //now_h-nth:当前时间离上一个场次过了多久时间
            //nth-(now_h-nth)：当前场次里下一个场次的时间
            //当分秒是整数的时候，H是当前场次的时间，不是整数的时候，相减要向前借一
            leftH = (now_m==0&&now_s==0)?nth-(now_h-nth):(nth-1)-(now_h-nth);
            leftM = now_s==0?60-now_m:59-now_m;
            leftS = now_s==0?0:59-now_s;

            //赋值到每个对应的span中
            span[1].innerHTML = leftH;
            span[3].innerHTML = parseInt(leftM/10);
            span[4].innerHTML = leftM%10;
            span[6].innerHTML = parseInt(leftS/10);
            span[7].innerHTML = leftS%10;
        },1000)

    }






