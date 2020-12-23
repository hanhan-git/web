import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL() + '/bpm/demo/url/form/get',
    method: 'get',
    params
  })
}
