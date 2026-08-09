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
      <el-form-item label="收件人姓名" prop="receiptName">
        <el-input v-model="formData.receiptName" placeholder="请输入收件人姓名" />
      </el-form-item>
      <el-form-item label="附加收件人姓名" prop="receiptAdditionalName">
        <el-input v-model="formData.receiptAdditionalName" placeholder="请输入附加收件人姓名" />
      </el-form-item>
      <el-form-item label="收件人名字" prop="firstName">
        <el-input v-model="formData.firstName" placeholder="请输入收件人名字" />
      </el-form-item>
      <el-form-item label="收件人姓氏" prop="lastName">
        <el-input v-model="formData.lastName" placeholder="请输入收件人姓氏" />
      </el-form-item>
      <el-form-item label="附加收件人名字" prop="additionalFirstName">
        <el-input v-model="formData.additionalFirstName" placeholder="请输入附加收件人名字" />
      </el-form-item>
      <el-form-item label="附加收件人姓氏" prop="additionalLastName">
        <el-input v-model="formData.additionalLastName" placeholder="请输入附加收件人姓氏" />
      </el-form-item>
      <el-form-item label="收件邮箱" prop="mail">
        <el-input v-model="formData.mail" placeholder="请输入收件邮箱" />
      </el-form-item>
      <el-form-item label="收件手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入收件手机号" />
      </el-form-item>
      <el-form-item label="备用手机号" prop="backupMobile">
        <el-input v-model="formData.backupMobile" placeholder="请输入备用手机号" />
      </el-form-item>
      <el-form-item label="一级行政区名称，例如国家" prop="regionName1">
        <el-input v-model="formData.regionName1" placeholder="请输入一级行政区名称，例如国家" />
      </el-form-item>
      <el-form-item label="二级行政区名称，例如州省" prop="regionName2">
        <el-input v-model="formData.regionName2" placeholder="请输入二级行政区名称，例如州省" />
      </el-form-item>
      <el-form-item label="三级行政区名称，例如城市" prop="regionName3">
        <el-input v-model="formData.regionName3" placeholder="请输入三级行政区名称，例如城市" />
      </el-form-item>
      <el-form-item label="四级行政区名称" prop="regionName4">
        <el-input v-model="formData.regionName4" placeholder="请输入四级行政区名称" />
      </el-form-item>
      <el-form-item label="邮政编码" prop="postCode">
        <el-input v-model="formData.postCode" placeholder="请输入邮政编码" />
      </el-form-item>
      <el-form-item label="地址第一行" prop="addressLine1">
        <el-input v-model="formData.addressLine1" placeholder="请输入地址第一行" />
      </el-form-item>
      <el-form-item label="地址第二行" prop="addressLine2">
        <el-input v-model="formData.addressLine2" placeholder="请输入地址第二行" />
      </el-form-item>
      <el-form-item label="地址第三行" prop="addressLine3">
        <el-input v-model="formData.addressLine3" placeholder="请输入地址第三行" />
      </el-form-item>
      <el-form-item label="完整收货地址" prop="addressLineAll">
        <el-input v-model="formData.addressLineAll" placeholder="请输入完整收货地址" />
      </el-form-item>
      <el-form-item label="Temu 地址警告信息" prop="warning">
        <el-input v-model="formData.warning" placeholder="请输入Temu 地址警告信息" />
      </el-form-item>
      <el-form-item label="最近从 Temu 同步时间" prop="lastSyncTime">
        <el-date-picker
          v-model="formData.lastSyncTime"
          type="date"
          value-format="x"
          placeholder="选择最近从 Temu 同步时间"
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
import { OrderShippingInfoApi, OrderShippingInfo } from '@/api/temu/ordershippinginfo'

/** Temu 父订单收货信息 表单 */
defineOptions({ name: 'OrderShippingInfoForm' })

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
  receiptName: undefined,
  receiptAdditionalName: undefined,
  firstName: undefined,
  lastName: undefined,
  additionalFirstName: undefined,
  additionalLastName: undefined,
  mail: undefined,
  mobile: undefined,
  backupMobile: undefined,
  regionName1: undefined,
  regionName2: undefined,
  regionName3: undefined,
  regionName4: undefined,
  postCode: undefined,
  addressLine1: undefined,
  addressLine2: undefined,
  addressLine3: undefined,
  addressLineAll: undefined,
  warning: undefined,
  lastSyncTime: undefined
})
const formRules = reactive({
  shopId: [{ required: true, message: '关联 temu_shop.id不能为空', trigger: 'blur' }],
  parentOrderSn: [{ required: true, message: 'Temu 父订单号不能为空', trigger: 'blur' }],
  lastSyncTime: [{ required: true, message: '最近从 Temu 同步时间不能为空', trigger: 'blur' }]
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
      formData.value = await OrderShippingInfoApi.getOrderShippingInfo(id)
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
    const data = formData.value as unknown as OrderShippingInfo
    if (formType.value === 'create') {
      await OrderShippingInfoApi.createOrderShippingInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await OrderShippingInfoApi.updateOrderShippingInfo(data)
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
    receiptName: undefined,
    receiptAdditionalName: undefined,
    firstName: undefined,
    lastName: undefined,
    additionalFirstName: undefined,
    additionalLastName: undefined,
    mail: undefined,
    mobile: undefined,
    backupMobile: undefined,
    regionName1: undefined,
    regionName2: undefined,
    regionName3: undefined,
    regionName4: undefined,
    postCode: undefined,
    addressLine1: undefined,
    addressLine2: undefined,
    addressLine3: undefined,
    addressLineAll: undefined,
    warning: undefined,
    lastSyncTime: undefined
  }
  formRef.value?.resetFields()
}
</script>