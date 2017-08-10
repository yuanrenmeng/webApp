/**
 * Created by dyf on 2017/5/15.
 */
window.onload = function () {
    shortcutDisplay();
    
    changeCheckBoxState();

    deleteGoods();
}

/** 选中切换 */
function changeCheckBoxState() {
    // 1.拿到标签数组
    var checkboxs = document.getElementsByClassName('cart_checkbox');
    // 2.为每个元素添加tap事件回调
    for (var i = 0; i < checkboxs.length; i++){
        mjd.tap(checkboxs[i], function (e) {
            var checkbox = e.target;
            if (checkbox.hasAttribute('checked')){
                checkbox.removeAttribute('checked');
            }else {
                checkbox.setAttribute('checked', '');
            }
        })
    }
    
}
/** 垃圾篓点击 */
function deleteGoods() {
    // 1.拿到标签
    var rubbishBoxs = document.getElementsByClassName('deal_right'); // 马桶们
    var panelbox = document.getElementsByClassName('panel')[0]; // 弹出框整体
    var panelContent = panelbox.getElementsByClassName('panel_content')[0]; // 弹出框

    // 2.为标签添加tap事件
    var up; // 垃圾桶盖子,没必要每次for循环都创建新对象
    for (var i = 0; i < rubbishBoxs.length; i++){
        // (function (index) {
        //     console.log(rubbishBoxs[index].firstElementChild, 'xxxxxxxxx');
        // })(i);
        mjd.tap(rubbishBoxs[i], function (e) {
            // console.log(e.target.parentNode, 'sesesesese');
            // 2.1 垃圾桶盖子翻开(过渡移动旋转)
            // 2.1.1 拿到马桶盖
            up = e.target.parentNode.firstElementChild;
            // 2.1.2 设置过渡
            up.style.transition = 'all .2s ease';
            up.style.webkitTransition = 'all .2s ease';

            // 2.1.3 旋转马桶盖
            up.style.transform = 'rotate(30deg)'; // 顺时针为正 ,逆时针为负
            up.style.webkitTransform = 'rotate(30deg)';
            up.style.transformOrigin = 'right 3px';
            up.style.webkitransformOrigin = 'right 3px';


            // 2.2 弹出提示(display)
            panelbox.style.display = 'block'; // 提示框出现
            // 动画效果
            panelContent.className = 'panel_content yf_jump';
        })
    }

    // 3.提示框内按钮们的回调
    var cancelBtn = panelContent.getElementsByClassName('bottom_left')[0]; // 取消按钮
    var acceptBtn = panelContent.getElementsByClassName('bottom_right')[0]; // 接收按钮

    // 2.响应事件
    mjd.tap(cancelBtn, function (e) {
        panelbox.style.display = 'none';
        // 垃圾箱归位
        up.style.transform = 'none';
        up.style.webkitTransform = 'none';
    });
    mjd.tap(acceptBtn, function (e) {
        panelbox.style.display = 'none';
        // 垃圾箱归位
        up.style.transform = 'none';
        up.style.webkitTransform = 'none';
        // 删除该cell
        for(var tempCell = up.parentNode; tempCell.className != 'jd_cart_list'; tempCell = tempCell.parentNode){
            // console.log(tempCell);
            if (tempCell.className == 'cart_cell'){
                console.log(tempCell);
                tempCell.parentNode.removeChild(tempCell);
                break;
            }
        }

    });
}
