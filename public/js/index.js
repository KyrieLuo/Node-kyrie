layui.use(["element", "laypage"], () => {
  let element = layui.element
  let laypage = layui.laypage
  const $ = layui.$
  
  element.tabDelete('demo', 'xxx')

  laypage.render({
    elem: "laypage", // 目标元素 id为laypage的div
    count: $("#laypage").data("maxnum"),
    limit: 2, //每页显示数
    groups: 3,
    curr: location.pathname.replace("/page/", ""),
    jump(obj, f){
      const $pre = $(".layui-laypage-prev"),
           $next = $(".layui-laypage-next"),
          $pages = $("#laypage a")
      $pages.each((i, v) => {
        let pageValue = `/page/${$(v).data("page")}`
        v.href = pageValue
        // 限制上下页按钮的边界跳转。。。
        if (!$pre.data('page')) {
          $pre.attr('href', 'javascript:;')
        }

        // if ($next.data('page') === $pages.length) {
        //   $next.attr('href', 'javascript:;')
        // }
      })
    }
  })
})
