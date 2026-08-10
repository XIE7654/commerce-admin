import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Amazon店铺授权信息 */
export interface Shop {
          id: number; // 主键编号
          sellerId: string; // Amazon sellerId
          marketplaceId: string; // 默认 marketplaceId
          shopName?: string; // 店铺名称
          region?: string; // Amazon 区域：NA、EU、FE
          status?: number; // 状态：0-启用，1-禁用
  }

// Amazon店铺授权 API
export const ShopApi = {
  // 查询Amazon店铺授权分页
  getShopPage: async (params: any) => {
    return await request.get({ url: `/amazon/shop/page`, params })
  },

  // 查询Amazon店铺授权详情
  getShop: async (id: number) => {
    return await request.get({ url: `/amazon/shop/get?id=` + id })
  },

  // 新增Amazon店铺授权
  createShop: async (data: Shop) => {
    return await request.post({ url: `/amazon/shop/create`, data })
  },

  // 修改Amazon店铺授权
  updateShop: async (data: Shop) => {
    return await request.put({ url: `/amazon/shop/update`, data })
  },

  // 删除Amazon店铺授权
  deleteShop: async (id: number) => {
    return await request.delete({ url: `/amazon/shop/delete?id=` + id })
  },

  /** 批量删除Amazon店铺授权 */
  deleteShopList: async (ids: number[]) => {
    return await request.delete({ url: `/amazon/shop/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Amazon店铺授权 Excel
  exportShop: async (params) => {
    return await request.download({ url: `/amazon/shop/export-excel`, params })
  }
}