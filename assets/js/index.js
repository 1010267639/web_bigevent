$(function() {
    // 调用这个函数获取用户信息
    getUserInfo()
    let layer = layui.layer
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function(index) {

            localStorage.removeItem('token')

            location.href = '/login.html'

            layer.close(index)
        })

    })
})

//请求用户信息函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',

        success: function(res) {
            if (res.status !== 0) {
                console.log(layer.msg)
                return layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },

    })
}

//封装了渲染用户信息函数
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    let pic = user.user_pic
    if (pic !== null) {
        $('.layui-nav-img').attr('src', pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }



}