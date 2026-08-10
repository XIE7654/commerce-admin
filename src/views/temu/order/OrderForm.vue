<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="关联 temu_shop.id" prop="shopId">
        <el-input v-model="formData.shopId" placeholder="请输入关联 temu_shop.id" />
      </el-form-item>
      <el-form-item label="Temu 父订单号" prop="parentOrderSn">
        <el-input v-model="formData.parentOrderSn" placeholder="请输入Temu 父订单号" />
      </el-form-item>
      <el-form-item label="Temu 子订单号" prop="orderSn">
        <el-input v-model="formData.orderSn" placeholder="请输入Temu 子订单号" />
      </el-form-item>
      <el-form-item label="Temu 站点编号" prop="siteId">
        <el-input v-model="formData.siteId" placeholder="请输入Temu 站点编号" />
      </el-form-item>
      <el-form-item label="Temu 区域编号" prop="regionId">
        <el-input v-model="formData.regionId" placeholder="请输入Temu 区域编号" />
      </el-form-item>
      <el-form-item label="父订单状态" prop="parentOrderStatus">
        <el-radio-group v-model="formData.parentOrderStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="子订单状态" prop="orderStatus">
        <el-radio-group v-model="formData.orderStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父订单支付类型" prop="parentOrderPaymentType">
        <el-select v-model="formData.parentOrderPaymentType" placeholder="请选择父订单支付类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="子订单支付类型" prop="orderPaymentType">
        <el-select v-model="formData.orderPaymentType" placeholder="请选择子订单支付类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="履约方式" prop="fulfillmentType">
        <el-select v-model="formData.fulfillmentType" placeholder="请选择履约方式">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Temu 商品编号" prop="goodsId">
        <el-input v-model="formData.goodsId" placeholder="请输入Temu 商品编号" />
      </el-form-item>
      <el-form-item label="Temu SKU 编号" prop="skuId">
        <el-input v-model="formData.skuId" placeholder="请输入Temu SKU 编号" />
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="原始商品名称" prop="originalGoodsName">
        <el-input v-model="formData.originalGoodsName" placeholder="请输入原始商品名称" />
      </el-form-item>
      <el-form-item label="商品规格" prop="spec">
        <el-input v-model="formData.spec" placeholder="请输入商品规格" />
      </el-form-item>
      <el-form-item label="原始商品规格" prop="originalSpecName">
        <el-input v-model="formData.originalSpecName" placeholder="请输入原始商品规格" />
      </el-form-item>
      <el-form-item label="商品缩略图" prop="thumbUrl">
        <el-input v-model="formData.thumbUrl" placeholder="请输入商品缩略图" />
      </el-form-item>
      <el-form-item label="下单数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入下单数量" />
      </el-form-item>
      <el-form-item label="发货前取消数量" prop="canceledQuantityBeforeShipment">
        <el-input v-model="formData.canceledQuantityBeforeShipment" placeholder="请输入发货前取消数量" />
      </el-form-item>
      <el-form-item label="原始下单数量" prop="originalOrderQuantity">
        <el-input v-model="formData.originalOrderQuantity" placeholder="请输入原始下单数量" />
      </el-form-item>
      <el-form-item label="父订单发货方式" prop="shippingMethod">
        <el-input v-model="formData.shippingMethod" placeholder="请输入父订单发货方式" />
      </el-form-item>
      <el-form-item label="是否由主商城合单发货" prop="shipmentConsolidatedByMainMall">
        <el-radio-group v-model="formData.shipmentConsolidatedByMainMall">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否含运费" prop="hasShippingFee">
        <el-radio-group v-model="formData.hasShippingFee">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父订单创建时间" prop="parentOrderTime">
        <el-date-picker
          v-model="formData.parentOrderTime"
          type="date"
          value-format="x"
          placeholder="选择父订单创建时间"
        />
      </el-form-item>
      <el-form-item label="父订单确认时间" prop="parentConfirmTime">
        <el-date-picker
          v-model="formData.parentConfirmTime"
          type="date"
          value-format="x"
          placeholder="选择父订单确认时间"
        />
      </el-form-item>
      <el-form-item label="子订单创建时间" prop="orderCreateTime">
        <el-date-picker
          v-model="formData.orderCreateTime"
          type="date"
          value-format="x"
          placeholder="选择子订单创建时间"
        />
      </el-form-item>
      <el-form-item label="要求发货时间" prop="orderShippingTime">
        <el-date-picker
          v-model="formData.orderShippingTime"
          type="date"
          value-format="x"
          placeholder="选择要求发货时间"
        />
      </el-form-item>
      <el-form-item label="最晚预计发货时间" prop="expectShipLatestTime">
        <el-date-picker
          v-model="formData.expectShipLatestTime"
          type="date"
          value-format="x"
          placeholder="选择最晚预计发货时间"
        />
      </el-form-item>
      <el-form-item label="最晚送达时间" prop="latestDeliveryTime">
        <el-date-picker
          v-model="formData.latestDeliveryTime"
          type="date"
          value-format="x"
          placeholder="选择最晚送达时间"
        />
      </el-form-item>
      <el-form-item label="Temu 订单最后更新时间" prop="temuUpdateTime">
        <el-date-picker
          v-model="formData.temuUpdateTime"
          type="date"
          value-format="x"
          placeholder="选择Temu 订单最后更新时间"
        />
      </el-form-item>
      <el-form-item label="父订单标签 JSON" prop="parentOrderLabels">
        <el-input v-model="formData.parentOrderLabels" placeholder="请输入父订单标签 JSON" />
      </el-form-item>
      <el-form-item label="子订单标签 JSON" prop="orderLabels">
        <el-input v-model="formData.orderLabels" placeholder="请输入子订单标签 JSON" />
      </el-form-item>
      <el-form-item label="父订单履约预警 JSON" prop="parentFulfillmentWarnings">
        <el-input v-model="formData.parentFulfillmentWarnings" placeholder="请输入父订单履约预警 JSON" />
      </el-form-item>
      <el-form-item label="子订单履约预警 JSON" prop="fulfillmentWarnings">
        <el-input v-model="formData.fulfillmentWarnings" placeholder="请输入子订单履约预警 JSON" />
      </el-form-item>
      <el-form-item label="包裹异常类型 JSON" prop="packageAbnormalTypes">
        <el-input v-model="formData.packageAbnormalTypes" placeholder="请输入包裹异常类型 JSON" />
      </el-form-item>
      <el-form-item label="商品映射列表 JSON" prop="productList">
        <el-input v-model="formData.productList" placeholder="请输入商品映射列表 JSON" />
      </el-form-item>
      <el-form-item label="最近同步时间" prop="lastSyncTime">
        <el-date-picker
          v-model="formData.lastSyncTime"
          type="date"
          value-format="x"
          placeholder="选择最近同步时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OrderApi, Order } from '@/api/temu/order'

/** Temu 订单 表单 */
defineOptions({ name: 'OrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  shopId: undefined,
  parentOrderSn: undefined,
  orderSn: undefined,
  siteId: undefined,
  regionId: undefined,
  parentOrderStatus: undefined,
  orderStatus: undefined,
  parentOrderPaymentType: undefined,
  orderPaymentType: undefined,
  fulfillmentType: undefined,
  goodsId: undefined,
  skuId: undefined,
  goodsName: undefined,
  originalGoodsName: undefined,
  spec: undefined,
  originalSpecName: undefined,
  thumbUrl: undefined,
  quantity: undefined,
  canceledQuantityBeforeShipment: undefined,
  originalOrderQuantity: undefined,
  shippingMethod: undefined,
  shipmentConsolidatedByMainMall: undefined,
  hasShippingFee: undefined,
  parentOrderTime: undefined,
  parentConfirmTime: undefined,
  orderCreateTime: undefined,
  orderShippingTime: undefined,
  expectShipLatestTime: undefined,
  latestDeliveryTime: undefined,
  temuUpdateTime: undefined,
  parentOrderLabels: undefined,
  orderLabels: undefined,
  parentFulfillmentWarnings: undefined,
  fulfillmentWarnings: undefined,
  packageAbnormalTypes: undefined,
  productList: undefined,
  lastSyncTime: undefined
})
const formRules = reactive({
  shopId: [{ required: true, message: '关联 temu_shop.id不能为空', trigger: 'blur' }],
  parentOrderSn: [{ required: true, message: 'Temu 父订单号不能为空', trigger: 'blur' }],
  orderSn: [{ required: true, message: 'Temu 子订单号不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await OrderApi.getOrder(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as Order
    if (formType.value === 'create') {
      await OrderApi.createOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await OrderApi.updateOrder(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    shopId: undefined,
    parentOrderSn: undefined,
    orderSn: undefined,
    siteId: undefined,
    regionId: undefined,
    parentOrderStatus: undefined,
    orderStatus: undefined,
    parentOrderPaymentType: undefined,
    orderPaymentType: undefined,
    fulfillmentType: undefined,
    goodsId: undefined,
    skuId: undefined,
    goodsName: undefined,
    originalGoodsName: undefined,
    spec: undefined,
    originalSpecName: undefined,
    thumbUrl: undefined,
    quantity: undefined,
    canceledQuantityBeforeShipment: undefined,
    originalOrderQuantity: undefined,
    shippingMethod: undefined,
    shipmentConsolidatedByMainMall: undefined,
    hasShippingFee: undefined,
    parentOrderTime: undefined,
    parentConfirmTime: undefined,
    orderCreateTime: undefined,
    orderShippingTime: undefined,
    expectShipLatestTime: undefined,
    latestDeliveryTime: undefined,
    temuUpdateTime: undefined,
    parentOrderLabels: undefined,
    orderLabels: undefined,
    parentFulfillmentWarnings: undefined,
    fulfillmentWarnings: undefined,
    packageAbnormalTypes: undefined,
    productList: undefined,
    lastSyncTime: undefined
  }
  formRef.value?.resetFields()
}
</script>
