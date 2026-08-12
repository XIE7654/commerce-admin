import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** Temu 订单信息 */
export interface Order {
  id: number // 主键编号
  shopId?: number // 关联 temu_shop.id
  parentOrderSn?: string // Temu 父订单号
  orderSn?: string // Temu 子订单号
  siteId: number // Temu 站点编号
  regionId: number // Temu 区域编号
  parentOrderStatus: number // 父订单状态
  orderStatus: number // 子订单状态
  parentOrderPaymentType: string // 父订单支付类型
  orderPaymentType: string // 子订单支付类型
  fulfillmentType: string // 履约方式
  goodsId: number // Temu 商品编号
  skuId: number // Temu SKU 编号
  goodsName: string // 商品名称
  originalGoodsName: string // 原始商品名称
  spec: string // 商品规格
  originalSpecName: string // 原始商品规格
  thumbUrl: string // 商品缩略图
  quantity: number // 下单数量
  canceledQuantityBeforeShipment: number // 发货前取消数量
  originalOrderQuantity: number // 原始下单数量
  shippingMethod: number // 父订单发货方式
  shipmentConsolidatedByMainMall: boolean // 是否由主商城合单发货
  hasShippingFee: boolean // 是否含运费
  parentOrderTime: string | Dayjs // 父订单创建时间
  parentConfirmTime: string | Dayjs // 父订单确认时间
  orderCreateTime: string | Dayjs // 子订单创建时间
  orderShippingTime: string | Dayjs // 要求发货时间
  expectShipLatestTime: string | Dayjs // 最晚预计发货时间
  latestDeliveryTime: string | Dayjs // 最晚送达时间
  temuUpdateTime: string | Dayjs // Temu 订单最后更新时间
  parentOrderLabels: string // 父订单标签 JSON
  orderLabels: string // 子订单标签 JSON
  parentFulfillmentWarnings: string // 父订单履约预警 JSON
  fulfillmentWarnings: string // 子订单履约预警 JSON
  packageAbnormalTypes: string // 包裹异常类型 JSON
  productList: string // 商品映射列表 JSON
  lastSyncTime: string | Dayjs // 最近同步时间
}

export interface OrderSyncReqVO {
  shopId: number
  site: string
  accessToken: string
  parentOrderStatus: number
  regionId: number
  pageNumber: number
  pageSize: number
}

/** 按本地订单主键同步父订单详情或收货信息的请求参数。 */
export interface OrderDetailSyncReqVO {
  orderId: number
}

// Temu 订单 API
export const OrderApi = {
  // 查询Temu 订单分页
  getOrderPage: async (params: any) => {
    return await request.get({ url: `/temu/order/page`, params })
  },

  getOrder: async (id: number) => {
    return await request.get({ url: `/temu/order/get?id=` + id })
  },

  createOrder: async (data: Order) => {
    return await request.post({ url: `/temu/order/create`, data })
  },

  updateOrder: async (data: Order) => {
    return await request.put({ url: `/temu/order/update`, data })
  },

  // 从 Temu 拉取订单并同步到本地订单表
  syncOrders: async (data: OrderSyncReqVO) => {
    return await request.post({ url: `/temu/order/sync`, data })
  },

  // 同步全部可用 Temu 店铺的订单
  syncAllAvailableShopOrders: async () => {
    return await request.post({ url: `/temu/order/sync-all` })
  },

  // 同步指定订单的父订单详情
  syncOrderDetail: async (data: OrderDetailSyncReqVO) => {
    return await request.post({ url: `/temu/order-management/orders/detail/sync`, data })
  },

  // 同步指定订单的收货信息
  syncOrderShippingInfo: async (data: OrderDetailSyncReqVO) => {
    return await request.post({ url: `/temu/order-management/orders/shipping-info/sync`, data })
  },

  // 导出Temu 订单 Excel
  exportOrder: async (params) => {
    return await request.download({ url: `/temu/order/export-excel`, params })
  }
}
