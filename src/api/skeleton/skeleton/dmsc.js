import request from '@/utils/request'
const DMSC_URL = ''

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: DMSC_URL + '/dmsc/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: DMSC_URL + '/dmsc/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: DMSC_URL + '/dmsc/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: DMSC_URL + '/dmsc/get',
    method: 'get',
    params: params
  })
}
