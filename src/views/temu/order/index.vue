<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="关联 temu_shop.id" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入关联 temu_shop.id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="关联 temu_seller.id，由店铺授权关系确定" prop="sellerId">
        <el-input
          v-model="queryParams.sellerId"
          placeholder="请输入关联 temu_seller.id，由店铺授权关系确定"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Temu 父订单号" prop="parentOrderSn">
        <el-input
          v-model="queryParams.parentOrderSn"
          placeholder="请输入Temu 父订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Temu 子订单号" prop="orderSn">
        <el-input
          v-model="queryParams.orderSn"
          placeholder="请输入Temu 子订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Temu 站点编号" prop="siteId">
        <el-input
          v-model="queryParams.siteId"
          placeholder="请输入Temu 站点编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Temu 区域编号" prop="regionId">
        <el-input
          v-model="queryParams.regionId"
          placeholder="请输入Temu 区域编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="父订单状态" prop="parentOrderStatus">
        <el-select
          v-model="queryParams.parentOrderStatus"
          placeholder="请选择父订单状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="子订单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="请选择子订单状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="最近同步时间" prop="lastSyncTime">
        <el-date-picker
          v-model="queryParams.lastSyncTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          :loading="syncLoading"
          @click="handleSync"
          v-hasPermi="['temu:order-management:query']"
        >
          <Icon icon="ep:refresh" class="mr-5px" /> 同步
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['temu:order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
        row-key="id"
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
    >
      <el-table-column label="主键编号" align="center" prop="id" />
      <el-table-column label="关联 temu_shop.id" align="center" prop="shopId" />
      <el-table-column label="关联 temu_seller.id，由店铺授权关系确定" align="center" prop="sellerId" />
      <el-table-column label="Temu 父订单号" align="center" prop="parentOrderSn" />
      <el-table-column label="Temu 子订单号" align="center" prop="orderSn" />
      <el-table-column label="Temu 站点编号" align="center" prop="siteId" />
      <el-table-column label="Temu 区域编号" align="center" prop="regionId" />
      <el-table-column label="父订单状态" align="center" prop="parentOrderStatus" />
      <el-table-column label="子订单状态" align="center" prop="orderStatus" />
      <el-table-column label="父订单支付类型" align="center" prop="parentOrderPaymentType" />
      <el-table-column label="子订单支付类型" align="center" prop="orderPaymentType" />
      <el-table-column label="履约方式" align="center" prop="fulfillmentType" />
      <el-table-column label="Temu 商品编号" align="center" prop="goodsId" />
      <el-table-column label="Temu SKU 编号" align="center" prop="skuId" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="原始商品名称" align="center" prop="originalGoodsName" />
      <el-table-column label="商品规格" align="center" prop="spec" />
      <el-table-column label="原始商品规格" align="center" prop="originalSpecName" />
      <el-table-column label="商品缩略图" align="center" prop="thumbUrl" />
      <el-table-column label="下单数量" align="center" prop="quantity" />
      <el-table-column label="发货前取消数量" align="center" prop="canceledQuantityBeforeShipment" />
      <el-table-column label="原始下单数量" align="center" prop="originalOrderQuantity" />
      <el-table-column label="父订单发货方式" align="center" prop="shippingMethod" />
      <el-table-column label="是否由主商城合单发货" align="center" prop="shipmentConsolidatedByMainMall" />
      <el-table-column label="是否含运费" align="center" prop="hasShippingFee" />
      <el-table-column
        label="父订单创建时间"
        align="center"
        prop="parentOrderTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="父订单确认时间"
        align="center"
        prop="parentConfirmTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="子订单创建时间"
        align="center"
        prop="orderCreateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="要求发货时间"
        align="center"
        prop="orderShippingTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="最晚预计发货时间"
        align="center"
        prop="expectShipLatestTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="最晚送达时间"
        align="center"
        prop="latestDeliveryTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="Temu 订单最后更新时间"
        align="center"
        prop="temuUpdateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="父订单标签 JSON" align="center" prop="parentOrderLabels" />
      <el-table-column label="子订单标签 JSON" align="center" prop="orderLabels" />
      <el-table-column label="父订单履约预警 JSON" align="center" prop="parentFulfillmentWarnings" />
      <el-table-column label="子订单履约预警 JSON" align="center" prop="fulfillmentWarnings" />
      <el-table-column label="包裹异常类型 JSON" align="center" prop="packageAbnormalTypes" />
      <el-table-column label="商品映射列表 JSON" align="center" prop="productList" />
      <el-table-column
        label="最近同步时间"
        align="center"
        prop="lastSyncTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OrderApi, Order } from '@/api/temu/order'
import { ShopApi } from '@/api/temu/shop'

/** Temu 订单 列表 */
defineOptions({ name: 'TemuOrder' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref<Order[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shopId: undefined,
  sellerId: undefined,
  parentOrderSn: undefined,
  orderSn: undefined,
  siteId: undefined,
  regionId: undefined,
  parentOrderStatus: undefined,
  orderStatus: undefined,
  goodsName: undefined,
  lastSyncTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const syncLoading = ref(false)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderApi.getOrderPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 从 Temu 拉取当前筛选条件下的订单并同步到本地。 */
const handleSync = async () => {
  const { shopId, parentOrderStatus, regionId } = queryParams
  if (shopId === undefined || parentOrderStatus === undefined || regionId === undefined) {
    message.warning('请先填写店铺编号、父订单状态和区域编号')
    return
  }
  syncLoading.value = true
  try {
    const shop = await ShopApi.getShop(Number(shopId))
    await OrderApi.syncOrders({
      shopId: Number(shopId),
      site: shop.site,
      accessToken: shop.authToken,
      parentOrderStatus: Number(parentOrderStatus),
      regionId: Number(regionId),
      pageNumber: 1,
      pageSize: 100
    })
    message.success('订单同步成功')
    await getList()
  } finally {
    syncLoading.value = false
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await OrderApi.exportOrder(queryParams)
    download.excel(data, 'Temu 订单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
