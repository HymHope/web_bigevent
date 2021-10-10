$(function () {
    var layer = layui.layer
    var form = layui.form
    initArticalList()

    //获取文章分类列表
    function initArticalList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //添加类别

    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',content: $('#dialog-add').html()
          });    
    })
    //通过代理的形式 为form-add 表单绑定submit事件 选择已存在的标签 此时form-add还不存在
    $('body').on('submit','#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArticalList()
                layer.msg('新增成功')
                layer.close(indexAdd)
            }
            
        })
    })

    //通过代理形式为btn-edit按钮绑定事件
    var indexEdit = null 
    $('tbody').on('click', '#btn-edit',function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',content: $('#dialog-edit').html()
        });
        //为其设置id属性
        var id = $(this).attr('data-id')
        //发起请求获取对应分类数据
        $.ajax({
            method:'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit',res.data)
            }
        })

    })

    //修改分类表单提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成功')
                layer.close(indexEdit)
                initArticalList()
                console.log(res);
            }
        })
    })

    //删除按钮
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index)
                    initArticalList()
                }
            })
          });
    })
})