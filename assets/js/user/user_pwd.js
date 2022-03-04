$(function () {

  var form = layui.form;

  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function (val) {
      if (val === $('[name=oldpwd]').val()) {
        return '新旧密码不能相同'
      }
    },
    rePwd: function (val) {
      if (val !== $('[name=newPwd]').val()) {
        return '两次密码不一致'
      }
    }
  })

  $('.layui-form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault();
    console.log($('[name=oldpwd]').val());
    // 发起 ajax 请求
    $.ajax({
      url: '/my/updatepwd',
      method: 'POST',
      data: {
        oldPwd: $('[name=oldpwd]').val(),
        newPwd: $('[name=newPwd]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('更新密码失败')
        }
        layui.layer.msg('密码更新成功')
        $('.layui-form')[0].reset()
      }
    })
  })

})