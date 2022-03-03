$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从 layui 中获取form 对象
  var form = layui.form
  var layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，则 return 一个提示信息即可
      var pwd = $('.reg-box [name=password]').val();
      if (pwd != value) {
        return '两次密码不一致'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 1、阻止默认的提交行为
    e.preventDefault()
    // 2、发起 Ajax 的 POST 请求
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser',
      data,
      function (res) {
        if (res.status != 0) {
          return layer.msg(res.message);
        }
        layer.msg('注册成功,请登录');
      })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('登录失败' + res.message);
        }
        layer.msg('登录成功');
        var token = res.token
        // console.log(token);
        localStorage.setItem('token', token)

        location.href = '/index.html'
      }
    })
  })


})