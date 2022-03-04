$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，待请求的数据时，需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 1,  //每页显示几条数据，默认每页显示2条
    cate_id: '',  //文章分类的ID
    state: '' // 文章的发布状态
  }
  initTable()
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      url: '/my/article/list',
      method: 'GET',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染数据
        // console.log(res);
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }
  initCate()
  // 获取分类的方法
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取数据失败')
        }
        // 调用模板引擎
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr);
        // layui的渲染机制
        form.render()
      }
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中的数据
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    console.log(cate_id + ' ' + state);
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox',  //分页容器的id
      count: total, //总数据条数
      limit: q.pagesize,  //每页显示多少条
      curr: q.pagenum,  //默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [1, 2, 3, 5, 10],
      // 分页发生切换时，触发 jump 回调
      // 触发 jump 回调的方式有两种
      // 1、点击页码时，触发 jump 回调
      // 2、只要调用了 laypage.render() 方法就会触发jupm回调，从而出现死循环
      jump: function (obj, first) {
        // 可通过 first 的值判断是通过哪种方式触发的回调，若first 为 undefined 则为第一种方式

        // 把最新的页码值赋值给q 从而得到相应分页的数据
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        // 根据最新的q 请求对应的数据，并渲染表格 不可直接放入 会发生死循环
        // initTable()
        if (!first) {
          initTable()
        }

      }
    })
  }

  // 通过代理形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-del', function () {
    // 获取页面中删除按钮的个数
    var len = $('.btn-del').length
    var id = $(this).attr('data-id');
    // console.log(len);
    // 询问用户是否要删除数据
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        url: '/my/article/delete/' + id,
        method: 'GET',
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg('删除文章成功！')
          // 删除后，判断当前页是否还有数据
          // 若无，则页码值 -1 再重新调用 initTable()方法
          // 可通过页面中存在的删除按钮的个数
          if (len === 1) {
            // 如果页面中的删除按钮的个数为1 ，则证明删完后，页面中没有其他剩余数据
            // 页码值最少为1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    })

  })




})