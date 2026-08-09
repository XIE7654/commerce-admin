import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Temu 区域承运商目录信息 */
export interface ShippingCompany {
          id: number; // 主键编号
          site?: string; // Temu 站点代码，例如 US、DE、JP
          regionId?: number; // Temu 区域编号
          logisticsServiceProviderId?: number; // Temu 物流服务商编号
          logisticsServiceProviderName?: string; // 物流服务商名称
          logisticsBrandName: string; // 物流品牌名称
          lastSyncTime?: string | Dayjs; // 最近一次从 Temu 同步的时间
  }

// Temu 区域承运商目录 API
export const ShippingCompanyApi = {
  // 查询Temu 区域承运商目录分页
  getShippingCompanyPage: async (params: any) => {
    return await request.get({ url: `/temu/shipping-company/page`, params })
  },

  // 查询Temu 区域承运商目录详情
  getShippingCompany: async (id: number) => {
    return await request.get({ url: `/temu/shipping-company/get?id=` + id })
  },

  // 新增Temu 区域承运商目录
  createShippingCompany: async (data: ShippingCompany) => {
    return await request.post({ url: `/temu/shipping-company/create`, data })
  },

  // 修改Temu 区域承运商目录
  updateShippingCompany: async (data: ShippingCompany) => {
    return await request.put({ url: `/temu/shipping-company/update`, data })
  },

  // 删除Temu 区域承运商目录
  deleteShippingCompany: async (id: number) => {
    return await request.delete({ url: `/temu/shipping-company/delete?id=` + id })
  },

  /** 批量删除Temu 区域承运商目录 */
  deleteShippingCompanyList: async (ids: number[]) => {
    return await request.delete({ url: `/temu/shipping-company/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Temu 区域承运商目录 Excel
  exportShippingCompany: async (params) => {
    return await request.download({ url: `/temu/shipping-company/export-excel`, params })
  }
}