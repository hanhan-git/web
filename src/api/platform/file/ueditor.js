import { getToken } from '@/utils/auth'
import { BASE_API } from '@/api/baseUrl'

/**
 * 返回ueditor地址
 */
export function serverUrl() {
  return BASE_API() + `/platform/v3/file/ueditor/action?access_token=` + getToken()
}
