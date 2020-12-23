import request from '@/utils/request'
const TASKPAG_URL = '/bpm/demo'

/** /bpm/demo/url/form/query
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: TASKPAG_URL + '/url/form/query',
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
    url: TASKPAG_URL + '/url/form/remove',
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
    url: TASKPAG_URL + '/url/form/save',
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
    url: TASKPAG_URL + '/url/form/get',
    method: 'get',
    params: params
  })
}
