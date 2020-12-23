import request from '@/utils/request'
import { SAAS_URL } from '@/api/baseUrl'

const BASE_MAPPING = '/saas/tenant'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/query',
    method: 'post',
    data: params
  })
}

/**
 * 查询未审核列表数据
 * @param {*} params
 */
export function queryWaitPageList(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/query/wait',
    method: 'post',
    data: params
  })
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/remove',
    method: 'post',
    isLoading: true,
    params
  })
}

/**
 * 创建租户空间
 * @param {*} params
 */
export function schemaCreate(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/schema/create',
    method: 'post',
    isLoading: true,
    params
  })
}

/**
 * 删除租户空间
 * @param {*} params
 */
export function schemaDrop(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/schema/drop',
    method: 'post',
    isLoading: true,
    params
  })
}

/**
 * 企业注册
 * @param {*} data
 */
export function register(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/register',
    method: 'post',
    isLoading: true,
    data
  })
}

/**
 * 保存数据
 * @param {*} data
 */
export function save(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/save',
    method: 'post',
    isLoading: true,
    data
  })
}

/**
 * 企业审核
 * @param {*} data
 */
export function approve(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/approve',
    method: 'post',
    isLoading: true,
    data
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/get',
    method: 'get',
    params
  })
}
/**
 * 获取设置关联的数据
 * @param {*} data
 */
export function getTenant(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/find/tenant',
    method: 'post',
    data: data
  })
}
/**
 * 保存设置关联的数据
 * @param {*} data
 */
export function saveRelation(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/save/user/relation',
    method: 'post',
    data: data
  })
}
/**
 * 保存设置关联的数据
 * @param {*} data
 */
export function approveBatch(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/approve/batch',
    method: 'post',
    params: params
  })
}
