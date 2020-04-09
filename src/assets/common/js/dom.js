export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
// 获取元素到顶部距离-通用方法
export function getPositionTop(node) {
  var top = node.offsetTop
  var parent = node.offsetParent
  while (parent != null) {
    top += parent.offsetTop
    parent = parent.offsetParent
  }
  return top // 所有的父元素top和
};

// 根据className获取元素的父级元素
export function getParentByClassName(node, className) {
  var parent = node.parentNode
  console.log(parent.className.includes(className))
  while (!parent.className.includes(className)) {
    console.log(123)
    parent = parent.parentNode
  }
  return parent // 获取祖先元素
};
