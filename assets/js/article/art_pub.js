$(function () {
  var layer = layui.layer
  var form = layui.form
  // 初始化富文本编辑器
  initEditor()
  // 定义加载文章分类的方法
  initCate()
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类列表失败')
        }
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 对于下列菜单、复选框之类的渲染，必须调用 form.render()
        form.render()
      }
    })
  }

  // 封面的裁剪效果
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)

  $('.btnCoverFile').on('click', function () {
    $('#coverFile').click()
  })

  // 监听 coverFile 的change 事件
  $('#coverFile').on('change', function (e) {
    // 获取文件的列表数组
    var file = e.target.files
    // 判断用户是否选中了文件
    if (file.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(file)
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  var art_state = '已发布'

  // 为草稿按钮绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'

  })

  // 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function (e) {
    // 1、阻止默认行为
    e.preventDefault();
    // 2、基于form表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
    // 3、将文章的发布状态，存到 fb 中
    fd.append('state', art_state);
    // 4.将封面裁剪过后的图片 输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5、将文件对象存储到fd中
        fd.append('cover_img', blob)

        // 6、发起 ajax 请求
        publishArticle(fd)
      })
  })

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      url: '/my/article/add',
      method: 'POST',
      data: fd,
      // 如果想服务器提交的是FormData 格式的数据，必须添加一下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('文章发布失败')
        }
        console.log ('文章发布成功');
        location.href = '/article/art_list.html'
      }
    })
  }
})