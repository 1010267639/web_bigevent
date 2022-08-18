$(function() {

    let layer = layui.layer
    let form = layui.form
    var laypage = layui.laypage

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)


        const y = dt.getFullYear()

        const m = padZero(dt.getMonth())

        const d = padZero(dt.getDate())


        const hh = padZero(dt.getHours())

        const mm = padZero(dt.getMinutes())

        const ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

    }

    function padZero(n) {
        return n > 9 ? n : 0 + n
    }
    //定义一个查询的参数对象
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的发布状态
    }

    initTabie()
        // 获取文章列表数据的方法

    function initTabie() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                    //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // initTabie()
    //     // 获取文章列表数据的方法
    // function initTabie() {
    //     let res = {
    //         "status": 0,
    //         "message": "获取文章列表成功！",
    //         "data": [{
    //                 "Id": 1,
    //                 "title": "abab",
    //                 "pub_date": "2020-01-03 12:19:57.690",
    //                 "state": "已发布",
    //                 "cate_name": "最新"
    //             },
    //             {
    //                 "Id": 2,
    //                 "title": "666",
    //                 "pub_date": "2020-01-03 12:20:19.817",
    //                 "state": "已发布",
    //                 "cate_name": "股市"
    //             }
    //         ],
    //         "total": 5
    //     }
    //     var htmlStr = template('tpl-table', res)
    //     $('tbody').html(htmlStr)


    // }



    initCate()
        // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                layer.msg('获取分类数据成功')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTabie()
    })



    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    //do something
                    initTabie()

                }
            },

        })

    }




    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
            // console.log(len)
            // 获取到文章的 id
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了,则让页码值 -1 之后,
                        // 再重新调用 initTable 方法
                        // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTabie()
                }
            })

            layer.close(index)
        })
    })

})