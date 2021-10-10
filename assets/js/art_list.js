$(function () {
    var laypage = layui.laypage

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new DataTransfer(data)

        var y = padzero(dt.getFullYear())
        var m = padzero(dt.getMonth() + 1)
        var d = padzero(dt.getData())

        var hh = padzero(dt.getHours())
        var mm = padzero(dt.getMinutes())
        var ss = padzero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + '-' + mm + '-' + ss
    }
    //定义补零函数
    function padzero() {
        return n > 9 ? n : '0' + n 
    }

    //定义一个查询的参数对象将来请求数据的时候需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1,
        pagesize: 2,//每页显示几条数据
        cate_id: '', // 文章分类id
        state:'' //文章发布状态
    }
    initTable()
    initCate()
    //获取文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('失败')
                }
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类
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

    //筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新筛选条件重新渲染表格数据
        initTable()
    })

    //定义分页方法
    function renderPage(total) {
        //使用此方法渲染页数
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,//默认选择的分页
            //分页切换出发函数 1.点击分页时会触发  2.只要调用laypage.render函数就会触发
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits:[2,3,5,10],
            jump: function (obj,first) {
                //最新页码值赋值给q
                q.pagenum = obj.curr
                //最新条目数赋值给q
                q.pagesize = obj.limit
                // 出现死循环 renderpage函数和initTable函数互调
                // initTable()
                // 使用first的值来判断通过那种方式触发的jump回调函数 值为true责是render触发 值为undefined责是点击分页触发
                if (!first) {
                    initTable()
                }

            }
        })
    }

    //通过代理方式对删除添加事件
    $('body').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer,msg('删除失败')
                    }
                    layui.layer.msg('删除成功')
                    //当数据删除后判断当前页是否还有数据，如果没有页数减一
                    if (len === 1) {
                        //如果len==1表示删除这条数据后页面就没有剩余数据了
                        //页码值最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1
                    }
                    initTable()

                }
            }) 
            layer.close(index);
          });
    })
})