/**
 * 按钮统一处理
 */
import BUTTONS from '@/constants/buttons'

/**
 * 获取按钮的icon
 * @param {*} key
 */
export function getButtonIcon(key) {
  return BUTTONS[key] ? BUTTONS[key].icon : null
}

/**
 * 获取按钮类型
 */
export function getButtonType(key) {
  return BUTTONS[key] ? BUTTONS[key].type : 'primary'
}
