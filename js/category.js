/**
 * Created by Administrator on 2017/5/25.
 */

/**1.先获取整个内容盒子的高度赋值给盒子，就可以把左边ul超出的宽度隐藏，达到单单ul滑动效果，
 * 2.获取左边的ul的高度，ul的父盒子的高度，相减得出ul能向上滚动的最大距离（为负）
 * 3.根据缓冲范围（是三个li的高度），算出缓动的最大Y值和最小Y值，当手势移动的时候用到，判断再这个范围内不需要过渡transition效果
 *4.设置过渡，移除过渡，竖直位移的函数
 *5.设置手势跟随变量moveY,starY,changedY,开始手势函数，touchstart、touchmoving、touchend,
 * 6.touchstart函数中，只需要获取手势点击的初始位置 startY = e.touches[0].clientY;
 * 7.touchmoving函数中，获取移动的距离： movingY = e.touches[0].clientY;然后算出移动的距离 = 移动位置 - 初始位置；然后给一个临时的位移高度temp_topY，不能直接用top_Y放进位移函数中，因为这样的话每次点击移动了一定的距离放开后，第二次点击的时候不会记录第一次的位置，而且从新从点击点开始算，实现不了承接上次的动位置，最后再touchmove函数中判断当temp_topY在最大缓冲和最小缓冲高度中间直接位移不需要过渡效果，这样滑动ul的时候只能到最大和最小缓冲的区域之中，不能将ul滑动的高度大于缓冲区域的时候等于最高高度，这样的话在moving的时候就能一直往下话，所以要放在touchend中
 * 8.首先设置top_Y = top_Y +changedY ,  这样就能承接上次移动的位置，然后判断当ul位移temp_topY大于最大缓冲区的时候等于最大高度，小于最小缓冲区的时候等于最小高度
 * 并设置过渡效果
 *
 *
 * **/

window.onload = function(){
    //1.隐藏栏
    showHiden();

    //获取mian内容的高度
    getMainH();

    //左边ul滑动特效
    getLeftH();

    //右边main滑动特效
    getrightH();
};

//获取中间内容main的高度
function getMainH() {
    var mainBox = document.getElementsByClassName("category_main")[0];
    var category_header = document.getElementsByClassName("category_header")[0];
    //获取当前屏幕的高度  document.body.heigh 是整个body的高度包括滚动条下的内容
    var screnH = window.screen.height;
    //头部高度
    var headerH = category_header.offsetHeight;
    var mainH = screnH-headerH;
    //赋值给盒子
    mainBox.style.height = mainH +"px";
}

//让左边盒子动起来
function getLeftH(){
    var mainLeftBox = document.getElementsByClassName('category_left')[0];
    var ulBox = mainLeftBox.getElementsByTagName('ul')[0];
    console.log(mainLeftBox);
    console.log(ulBox);
    //左边盒子的高度和盒子里面ul的高度
    var ulH = ulBox.offsetHeight;//1104
    var mainLeftH = mainLeftBox.offsetHeight;
    // console.log(ulH);
    //ul能走的最大这和最小值
    var topY = 0;
    var ul_topmaxY = 0;
    var ul_topminY = mainLeftH - ulH;//524 - 1104

    //缓冲告诉是三个li
    var bufferY = 46*3;
    //到达的最大高度（往下拉，初始0为最大高度）
    var bufferMaxY = ul_topmaxY + bufferY;
    //到达的最小高度（往上拉）
    var bufferMinY  = ul_topminY - bufferY;

    function getTransform(y){
        ulBox.style.transform = "translateY("+y+"px)"
    }
    function setTransition(){
        ulBox.style.transition = "all .2s ease";
    }
    function clearTransition(){
        ulBox.style.transition = "none";
    }

    //手势移动
    var startY,movingY,changedY;
    startY = 0;
    movingY = 0;
    changedY = 0;
    ulBox.addEventListener("touchstart",function(e){
        startY = e.touches[0].clientY;
    });
    ulBox.addEventListener("touchmove",function(e){
        e.preventDefault();
        movingY = e.touches[0].clientY;
        changedY =movingY - startY;
        var tem_topY = topY+changedY;
       //判断，在能到的缓冲最大和最小区域高度之间不用过渡效果。
        //判断当但缓冲最大和最小区域的时候恢复过渡最大最小值放在手势结束的时候，
        if(tem_topY>bufferMinY && tem_topY<bufferMaxY){
            clearTransition();
            getTransform(tem_topY);
        }

    });
    ulBox.addEventListener("touchend",function(e){
        topY = topY+changedY;
        if(topY>bufferMaxY){
            topY = ul_topmaxY;//向下拉大于缓冲的时候让它回到顶部
            setTransition();
            getTransform(topY);
        }else if(topY<bufferMinY){ //bufferMinY为负，向上拉
            topY = ul_topminY;
            setTransition();
            getTransform(topY);
        }else{
            getTransform(topY);
        }
        //还原
        startY = 0;
        movingY = 0;
        changedY = 0;
    });


    //点击和左边盒子
    mjd.tap(ulBox,function (e) {
        var lis = ulBox.getElementsByTagName('li');
        var tap_li = e.target.parentNode;//获取当前点击的li
        // console.log(tap_li);
        if(tap_li.className == 'current'){
            return;
        }else{
            for (var i = 0; i < lis.length; i++) {
                lis[i].className = '';
                lis[i].index = i;
            }
            tap_li.className = 'current';
            //让li过渡位移,通过绑定的index
            topY = -tap_li.index * 46;
            setTransition();
            getTransform(topY);
            //判断，当最后一个li在最下面的时候不在往上平移，直接选中
            if(topY<ul_topminY){
                topY=ul_topminY;
                getTransform(topY);
            }

            //刷新右边的数据界面
            var category_right = document.getElementsByClassName("category_right")[0];
            // console.log(category_right);
            category_right.style.display = 'none';
            setTimeout(function () {
                category_right.style.display = 'block';
            }, 200);
        }

        })

}
//让右边内容动起来
function getrightH(){
    //最外层总盒子
    var category_main = document.getElementsByClassName('category_main')[0];
    //右边内容盒子
    var rightBox = document.getElementsByClassName('category_right')[0];

    //右边内容盒子的高度
    var RightH = rightBox.offsetHeight;//1192
    //最外层总盒子的高度
    var mainBoxH = category_main.offsetHeight;//668
    //右边盒子能走的最大这和最小值

    var topY = 0;
    var rightmaxY = 0;
    var rightminY = mainBoxH - RightH; //负数

    //缓冲告诉是三个li
    var bufferY = 46*3;
    //到达的最大高度（往下拉，初始0为最大高度）
    var bufferMaxY = rightmaxY + bufferY;
    //到达的最小高度（往上拉）
    var bufferMinY  = rightminY - bufferY;

    function getTransform(y){
        rightBox.style.transform = "translateY("+y+"px)"
    }
    function setTransition(){
        rightBox.style.transition = "all .2s ease";
    }
    function clearTransition(){
        rightBox.style.transition = "none";
    }

    //手势移动
    var startY,movingY,changedY;
    startY = 0;
    movingY = 0;
    changedY = 0;
    rightBox.addEventListener("touchstart",function(e){
        startY = e.touches[0].clientY;
    });
    rightBox.addEventListener("touchmove",function(e){
        e.preventDefault();
        movingY = e.touches[0].clientY;
        changedY =movingY - startY;
        var tem_topY = topY+changedY;
        //判断，在能到的缓冲最大和最小区域高度之间不用过渡效果。
        //判断当但缓冲最大和最小区域的时候恢复过渡最大最小值放在手势结束的时候，
        if(tem_topY>bufferMinY && tem_topY<bufferMaxY){
            clearTransition();
            getTransform(tem_topY);
        }

    });
    rightBox.addEventListener("touchend",function(e){
        topY = topY+changedY;
        if(topY>bufferMaxY){
            topY = rightmaxY;//向下拉大于缓冲的时候让它回到顶部
            setTransition();
            getTransform(topY);
        }else if(topY<bufferMinY){ //bufferMinY为负，向上拉
            topY = rightminY;
            setTransition();
            getTransform(topY);
        }else{
            getTransform(topY);
        }
        //还原
        startY = 0;
        movingY = 0;
        changedY = 0;
    });


}





