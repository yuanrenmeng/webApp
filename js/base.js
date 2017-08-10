/**
 * Created by Administrator on 2017/5/26.
 */
/**
 * 1.如果手指滑动了,就不是tap了
 * 2.如果 touchstart于touchend 两个事件间隔超过 duration, 认为不是tap, 而是LongPress
 * */

window.mjd = {};//把mjd作为Windows的属性
    mjd.tap = function (obj,callBack) {
        if( typeof obj != "object"){
            console.log('error:typeof(obj) != object ');
            return;
        }

        var ismoving = false;
        var duration = 300;//毫秒
        var startTime = new Date();

        obj.addEventListener("touchstart", function(e){
            startTime = new Date();
        });
        obj.addEventListener("touchmove", function(e){
            e.preventDefault();
            ismoving = true;
        });
        obj.addEventListener("touchend", function(e){
            if(new Date()-startTime<duration&&ismoving==false){
                if(callBack){
                    callBack(e);
                }
            }
            // 数据还原
            ismoving = false;
        })
};


//搜索栏左边的显示隐藏按钮
function showHiden() {
    var shortcut = document.getElementsByClassName("icon_shortcut")[0];
    var header  = document.getElementsByClassName("category_header")[0];
    var ul = header.getElementsByTagName("ul")[0];
    var flg = true;
    mjd.tap(shortcut,function () {
        if(flg){
            ul.style.display = "table";
            flg= false;
        }else{
            ul.style.display = "none";
            flg = true;
        }
    })
}

/* shortcut的展示 */
function shortcutDisplay() {
    // 1.拿到标签
    var c_header = document.getElementsByClassName('jd_c_header')[0];
    var icon_shortcut = c_header.getElementsByClassName('icon_shortcut')[0];
    var shortcut = c_header.getElementsByClassName('shortcut')[0];
    var c_main = document.getElementsByClassName('jd_c_main')[0];
    var oriPaddingTop = parseInt(c_main.style.paddingTop);
    var changePT = oriPaddingTop + 57;
    // console.log(oriPaddingTop, changePT);

    mjd.tap(icon_shortcut, function (e) {
        if (shortcut.style.display == 'table'){
            shortcut.style.display = 'none';
            if (document.title == '京东商品分类'){
                c_main.style.paddingTop = oriPaddingTop +'px';
            }
        }else if(shortcut.style.display == 'none'){
            shortcut.style.display = 'table';
            if (document.title == '京东商品分类'){
                c_main.style.paddingTop = changePT +'px';
            }
        }
        // console.log(oriPaddingTop, changePT);
    });
}