import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Temu 卖家商城授权信息信息 */
export interface Seller {
          id?: number; // 主键编号
          shopId: number; // 店铺编号
          shopName?: string; // 店铺名称
          apiScopeList: string; // API 权限范围列表
          responseJson: string; // 接口完整响应快照，便于兼容后续字段
          lastSyncTime: string | Dayjs; // 最近一次同步授权信息时间
  }

// Temu 卖家商城授权信息 API
export const SellerApi = {
  // 查询Temu 卖家商城授权信息分页
  getSellerPage: async (params: any) => {
    return await request.get({ url: `/temu/seller/page`, params })
  },

  // 查询Temu 卖家商城授权信息详情
  getSeller: async (id: number) => {
    return await request.get({ url: `/temu/seller/get?id=` + id })
  },

  // 新增Temu 卖家商城授权信息
  createSeller: async (data: Seller) => {
    return await request.post({ url: `/temu/seller/create`, data })
  },

  // 修改Temu 卖家商城授权信息
  updateSeller: async (data: Seller) => {
    return await request.put({ url: `/temu/seller/update`, data })
  },

  // 删除Temu 卖家商城授权信息
  deleteSeller: async (id: number) => {
    return await request.delete({ url: `/temu/seller/delete?id=` + id })
  },

  /** 批量删除Temu 卖家商城授权信息 */
  deleteSellerList: async (ids: number[]) => {
    return await request.delete({ url: `/temu/seller/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Temu 卖家商城授权信息 Excel
  exportSeller: async (params) => {
    return await request.download({ url: `/temu/seller/export-excel`, params })
  }
}
