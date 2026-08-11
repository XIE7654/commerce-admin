import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Amazon 报表请求及异步处理任务信息 */
export interface ReportRequest {
          id: number; // 主键编号
          requestNo?: string; // 本地报表请求唯一编号，用于任务幂等与关联日志
          shopId?: number; // 关联 amazon_shop.id
          countryCode?: string; // 请求站点国家代码，例如 US
          marketplaceIds?: string; // Amazon Marketplace ID 列表，Reports API 最多支持 25 个
          reportType?: string; // Amazon 报表类型，例如 GET_MERCHANT_LISTINGS_ALL_DATA
          reportOptions: string; // 报表附加选项，随报表类型变化
          dataStartTime: string | Dayjs; // 报表数据开始时间
          dataEndTime: string | Dayjs; // 报表数据结束时间
          amazonReportId: string; // Amazon reportId；在店铺维度唯一
          amazonReportScheduleId: string; // 创建该报表的 Amazon 计划编号；手工请求为空
          amazonProcessingStatus: string; // Amazon 状态：IN_QUEUE、IN_PROGRESS、DONE、CANCELLED、FATAL
          amazonCreatedTime: string | Dayjs; // Amazon 创建报表时间
          processingStartTime: string | Dayjs; // Amazon 开始处理时间
          processingEndTime: string | Dayjs; // Amazon 完成处理时间
          reportDocumentId: string; // Amazon reportDocumentId
          compressionAlgorithm: string; // 下载文件压缩算法，例如 GZIP
          fileId: number; // 已下载并归档的文件编号，对应 infra_file.id
          downloadTime: string | Dayjs; // 报表文件下载完成时间
          taskStatus?: number; // 任务状态：0-待提交，1-等待Amazon处理，2-待下载，3-成功，4-重试等待，5-失败，6-已取消
          executeStage?: number; // 当前执行阶段：0-提交，1-查询状态，2-下载文件
          retryCount?: number; // 当前阶段已重试次数
          maxRetryCount?: number; // 当前阶段最大重试次数
          nextRetryTime: string | Dayjs; // 下次可执行时间；用于退避重试和轮询调度
          lastRequestTime: string | Dayjs; // 最近一次调用 Amazon 时间
          lastErrorCode: string; // 最近一次失败错误码
          lastErrorMessage: string; // 最近一次失败原因
          completedTime: string | Dayjs; // 任务成功、失败或取消的最终完成时间
          lockVersion?: number; // 乐观锁版本，防止多个任务执行器重复处理
          lockExpireTime: string | Dayjs; // 任务执行租约到期时间；超时后允许其他执行器接管
  }

// Amazon 报表请求及异步处理任务 API
export const ReportRequestApi = {
  // 查询Amazon 报表请求及异步处理任务分页
  getReportRequestPage: async (params: any) => {
    return await request.get({ url: `/amazon/report-request/page`, params })
  },

  // 查询Amazon 报表请求及异步处理任务详情
  getReportRequest: async (id: number) => {
    return await request.get({ url: `/amazon/report-request/get?id=` + id })
  },

  // 新增Amazon 报表请求及异步处理任务
  createReportRequest: async (data: ReportRequest) => {
    return await request.post({ url: `/amazon/report-request/create`, data })
  },

  // 修改Amazon 报表请求及异步处理任务
  updateReportRequest: async (data: ReportRequest) => {
    return await request.put({ url: `/amazon/report-request/update`, data })
  },

  // 删除Amazon 报表请求及异步处理任务
  deleteReportRequest: async (id: number) => {
    return await request.delete({ url: `/amazon/report-request/delete?id=` + id })
  },

  /** 批量删除Amazon 报表请求及异步处理任务 */
  deleteReportRequestList: async (ids: number[]) => {
    return await request.delete({ url: `/amazon/report-request/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Amazon 报表请求及异步处理任务 Excel
  exportReportRequest: async (params) => {
    return await request.download({ url: `/amazon/report-request/export-excel`, params })
  }
}