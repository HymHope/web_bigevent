$(function(){
    //点击去注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //去登陆
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui中获取form对象
    var form = layui.form
    var layer =layui.layer
    form.verify({
        //自定义一个叫 pwd 校验规则
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致
        repwd:function(value){
            //形参是确认密码框的值  需拿到密码框的值来对比
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        var data={ username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data,function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            //模拟人的点击行为
            $('#link_login').click()
        })
    })

    //监听登陆表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单元素  id存放位置
            // data: { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() },
            // data: {
            //     //  username:$('#username').val(),
            //     //  password:$('#password').val()
            // },
            data:$(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登录成功！')

                //将登陆成功得到的token字符串保存到localStorage中
                localStorage.setItem('token',res.token)
                // console.log(res.token);
                location.href='/index.html'
            }
        })
    })

}) 