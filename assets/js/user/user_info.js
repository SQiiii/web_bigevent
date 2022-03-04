$(function () {
  var form = layui.form

  form.verify({
    nickname: function (val) {
      if (val.length > 6) {
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })

  var layer = layui.layer
  initUserInfo()

  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }
        console.log(res);
        // 调用 form.val() 快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    initUserInfo();
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 发起 ajax 数据请求
    $.ajax({
      url: '/my/userinfo',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('数据提交失败')
        }
        // initUserInfo()
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
        return layer.msg('用户信息更新成功');
      }
    })
  })
})

