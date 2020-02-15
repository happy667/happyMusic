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
