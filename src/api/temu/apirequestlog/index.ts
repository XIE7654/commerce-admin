import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Temu OpenAPI 请求调用日志信息 */
export interface ApiRequestLog {
          id: number; // 主键编号
          requestId?: string; // 本次调用唯一请求编号
          traceId: string; // 链路追踪编号
          shopId: number; // Temu 店铺编号
          site: string; // Temu 站点代码，例如 US、DE、JP
          apiCategory?: string; // API 分类，例如 product、order
          operationName?: string; // Temu OpenAPI 接口 type
          requestMethod?: string; // HTTP 请求方式
          requestUrl: string; // 脱敏后的完整请求 URL
          requestPath: string; // 请求路径
          fileId: number; // 响应归档文件编号，对应 infra_file.id
          requestParams: string; // 脱敏后的查询参数或请求体
          requestHeaders: string; // 脱敏后的请求头
          requestBodyHash: string; // 原始请求体 SHA-256
          httpStatusCode: number; // HTTP 状态码；网络异常时为空
          resultStatus?: number; // 调用结果：0-处理中，1-成功，2-失败
          errorCode: string; // Temu 或应用错误码
          errorMessage: string; // 脱敏后的错误信息
          temuRequestId: string; // Temu 返回的请求编号
          rateLimit: string; // Temu 返回的速率限制
          retryCount?: number; // 本次调用已重试次数
          durationMs: number; // 请求总耗时，单位毫秒
          requestedAt?: string | Dayjs; // 开始请求时间
          completedAt: string | Dayjs; // 请求完成时间
  }

// Temu OpenAPI 请求调用日志 API
export const ApiRequestLogApi = {
  // 查询Temu OpenAPI 请求调用日志分页
  getApiRequestLogPage: async (params: any) => {
    return await request.get({ url: `/temu/api-request-log/page`, params })
  },

  // 查询Temu OpenAPI 请求调用日志详情
  getApiRequestLog: async (id: number) => {
    return await request.get({ url: `/temu/api-request-log/get?id=` + id })
  },

  // 新增Temu OpenAPI 请求调用日志
  createApiRequestLog: async (data: ApiRequestLog) => {
    return await request.post({ url: `/temu/api-request-log/create`, data })
  },

  // 修改Temu OpenAPI 请求调用日志
  updateApiRequestLog: async (data: ApiRequestLog) => {
    return await request.put({ url: `/temu/api-request-log/update`, data })
  },

  // 删除Temu OpenAPI 请求调用日志
  deleteApiRequestLog: async (id: number) => {
    return await request.delete({ url: `/temu/api-request-log/delete?id=` + id })
  },

  /** 批量删除Temu OpenAPI 请求调用日志 */
  deleteApiRequestLogList: async (ids: number[]) => {
    return await request.delete({ url: `/temu/api-request-log/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Temu OpenAPI 请求调用日志 Excel
  exportApiRequestLog: async (params) => {
    return await request.download({ url: `/temu/api-request-log/export-excel`, params })
  }
}