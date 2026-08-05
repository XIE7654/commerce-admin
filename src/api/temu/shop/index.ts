import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Temu 店铺信息 */
export interface Shop {
          id: number; // 主键编号
          shopType?: number; // 店铺类型：1-全托管，2-半托管，3-本土店铺
          site?: string; // Temu 站点代码，例如 US、DE、JP
          shopName?: string; // 店铺名称
          authToken?: string; // Temu 授权 Token
  }

// Temu 店铺 API
export const ShopApi = {
  // 查询Temu 店铺分页
  getShopPage: async (params: any) => {
    return await request.get({ url: `/temu/shop/page`, params })
  },

  // 查询Temu 店铺详情
  getShop: async (id: number) => {
    return await request.get({ url: `/temu/shop/get?id=` + id })
  },

  // 新增Temu 店铺
  createShop: async (data: Shop) => {
    return await request.post({ url: `/temu/shop/create`, data })
  },

  // 修改Temu 店铺
  updateShop: async (data: Shop) => {
    return await request.put({ url: `/temu/shop/update`, data })
  },

  // 删除Temu 店铺
  deleteShop: async (id: number) => {
    return await request.delete({ url: `/temu/shop/delete?id=` + id })
  },

  /** 批量删除Temu 店铺 */
  deleteShopList: async (ids: number[]) => {
    return await request.delete({ url: `/temu/shop/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Temu 店铺 Excel
  exportShop: async (params) => {
    return await request.download({ url: `/temu/shop/export-excel`, params })
  }
}