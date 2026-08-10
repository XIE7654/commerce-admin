import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Listing信息表信息 */
export interface ListingMarketplace {
          id: number; // 主键编号
          listingId?: number; // 关联 amazon_listing.id
          marketplaceId?: string; // Amazon Marketplace ID
          asin: string; // Amazon 标准识别号
          productType: string; // Amazon 商品类型
          conditionType: string; // 商品状况类型
          itemName: string; // Amazon 商品名称
          amazonCreatedTime: string | Dayjs; // Amazon Listing 创建时间
          amazonUpdatedTime: string | Dayjs; // Amazon Listing 更新时间
          lastSyncTime: string | Dayjs; // 最后同步时间
  }

// Listing信息表 API
export const ListingMarketplaceApi = {
  // 查询Listing信息表分页
  getListingMarketplacePage: async (params: any) => {
    return await request.get({ url: `/amazon/listing-marketplace/page`, params })
  },

  // 查询Listing信息表详情
  getListingMarketplace: async (id: number) => {
    return await request.get({ url: `/amazon/listing-marketplace/get?id=` + id })
  },

  // 新增Listing信息表
  createListingMarketplace: async (data: ListingMarketplace) => {
    return await request.post({ url: `/amazon/listing-marketplace/create`, data })
  },

  // 修改Listing信息表
  updateListingMarketplace: async (data: ListingMarketplace) => {
    return await request.put({ url: `/amazon/listing-marketplace/update`, data })
  },

  // 删除Listing信息表
  deleteListingMarketplace: async (id: number) => {
    return await request.delete({ url: `/amazon/listing-marketplace/delete?id=` + id })
  },

  /** 批量删除Listing信息表 */
  deleteListingMarketplaceList: async (ids: number[]) => {
    return await request.delete({ url: `/amazon/listing-marketplace/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Listing信息表 Excel
  exportListingMarketplace: async (params) => {
    return await request.download({ url: `/amazon/listing-marketplace/export-excel`, params })
  }
}