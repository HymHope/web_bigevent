$(function () {
    getUserInfo()
    
    //退出登录
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //清除本地token 
            localStorage.removeItem('token')
            //跳转页面
            location.href = '/login.html'
            layer.close(index);
          });
    })
})

//获取用户信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //渲染用户头像
            renderAvatar(res.data)
            
        },
        //成功还是失败都会调用complete函数
        // complete: function (res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}
//渲染用户头像
function renderAvatar(user) {
    //获取用户名
    var name = user.nickname || user.username
    //渲染用户名
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}