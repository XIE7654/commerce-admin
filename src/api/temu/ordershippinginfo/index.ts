import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** Temu 父订单收货信息信息 */
export interface OrderShippingInfo {
          id: number; // 主键编号
          shopId?: number; // 关联 temu_shop.id
          parentOrderSn?: string; // Temu 父订单号
          receiptName: string; // 收件人姓名
          receiptAdditionalName: string; // 附加收件人姓名
          firstName: string; // 收件人名字
          lastName: string; // 收件人姓氏
          additionalFirstName: string; // 附加收件人名字
          additionalLastName: string; // 附加收件人姓氏
          mail: string; // 收件邮箱
          mobile: string; // 收件手机号
          backupMobile: string; // 备用手机号
          regionName1: string; // 一级行政区名称，例如国家
          regionName2: string; // 二级行政区名称，例如州省
          regionName3: string; // 三级行政区名称，例如城市
          regionName4: string; // 四级行政区名称
          postCode: string; // 邮政编码
          addressLine1: string; // 地址第一行
          addressLine2: string; // 地址第二行
          addressLine3: string; // 地址第三行
          addressLineAll: string; // 完整收货地址
          warning: string; // Temu 地址警告信息
          lastSyncTime?: string | Dayjs; // 最近从 Temu 同步时间
  }

// Temu 父订单收货信息 API
export const OrderShippingInfoApi = {
  // 查询Temu 父订单收货信息分页
  getOrderShippingInfoPage: async (params: any) => {
    return await request.get({ url: `/temu/order-shipping-info/page`, params })
  },

  // 查询Temu 父订单收货信息详情
  getOrderShippingInfo: async (id: number) => {
    return await request.get({ url: `/temu/order-shipping-info/get?id=` + id })
  },

  // 新增Temu 父订单收货信息
  createOrderShippingInfo: async (data: OrderShippingInfo) => {
    return await request.post({ url: `/temu/order-shipping-info/create`, data })
  },

  // 修改Temu 父订单收货信息
  updateOrderShippingInfo: async (data: OrderShippingInfo) => {
    return await request.put({ url: `/temu/order-shipping-info/update`, data })
  },

  // 删除Temu 父订单收货信息
  deleteOrderShippingInfo: async (id: number) => {
    return await request.delete({ url: `/temu/order-shipping-info/delete?id=` + id })
  },

  /** 批量删除Temu 父订单收货信息 */
  deleteOrderShippingInfoList: async (ids: number[]) => {
    return await request.delete({ url: `/temu/order-shipping-info/delete-list?ids=${ids.join(',')}` })
  },

  // 导出Temu 父订单收货信息 Excel
  exportOrderShippingInfo: async (params) => {
    return await request.download({ url: `/temu/order-shipping-info/export-excel`, params })
  }
}