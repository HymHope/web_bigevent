$(function () {
    // 初始化富文本编辑器
    initEditor()

    //加载文章分类
    initCate() 
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //render 方法再次渲染
                layui.form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
    $image.cropper(options)
    
    //为选择封面按钮添加点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        //根据文件创建相应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        //为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    var art_state = '已发布'
    //为存为草稿绑定事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于form表单快速创建一个formData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        
        
        //将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
             width: 400,
             height: 280
            })
            .toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
        // fd.forEach(function (v, k) {
        //     console.log(k,v);
        // })
        
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意如果像服务器提交的是formData的数据必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('发布文章失败')
                }
                layui.layer.msg('发布成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})