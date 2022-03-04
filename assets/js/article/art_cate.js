$(function () {
  var layer = layui.layer
  var form = layui.form;
  initArtCateList()
  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  var indexAdd = null;
  // 为添加类别按钮绑定点击事件
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })


  // 通过代理形式，为 form表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/addcates',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败')
        }
        initArtCateList();
        layer.msg('新增分类成功')
        layer.close(indexAdd)
      }
    })
  })

  var indexEdit = null;
  $('tbody').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    // console.log($(this).attr('data-id'));
    var id = $(this).attr('data-id');
    // 发起请求，获取对应的数据
    $.ajax({
      url: '/my/article/cates/' + id,
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类信息失败')
        }
        // 已有信息的加载
        form.val('form-edit', res.data)

      }
    })

  })

  // 提交更新的文章分类
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败')
        }
        layer.msg('更新分类数据成功')
        initArtCateList();
        layer.close(indexEdit)
      }
    })
  })

  // 删除文章分类
  $('tbody').on('click', '.btn-del', function () {

    var id = $(this).attr('data-id')
    // console.log(id);
    // 提示用户是否要删除
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('分类删除失败')
          }
          layer.msg('删除分类成功！')
          initArtCateList();
          layer.close(index)
        }
      })

      layer.close(index);
    });
  })



})