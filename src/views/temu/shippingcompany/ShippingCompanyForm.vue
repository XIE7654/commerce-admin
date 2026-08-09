<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="Temu 站点代码，例如 US、DE、JP" prop="site">
        <el-input v-model="formData.site" placeholder="请输入Temu 站点代码，例如 US、DE、JP" />
      </el-form-item>
      <el-form-item label="Temu 区域编号" prop="regionId">
        <el-input v-model="formData.regionId" placeholder="请输入Temu 区域编号" />
      </el-form-item>
      <el-form-item label="Temu 物流服务商编号" prop="logisticsServiceProviderId">
        <el-input v-model="formData.logisticsServiceProviderId" placeholder="请输入Temu 物流服务商编号" />
      </el-form-item>
      <el-form-item label="物流服务商名称" prop="logisticsServiceProviderName">
        <el-input v-model="formData.logisticsServiceProviderName" placeholder="请输入物流服务商名称" />
      </el-form-item>
      <el-form-item label="物流品牌名称" prop="logisticsBrandName">
        <el-input v-model="formData.logisticsBrandName" placeholder="请输入物流品牌名称" />
      </el-form-item>
      <el-form-item label="最近一次从 Temu 同步的时间" prop="lastSyncTime">
        <el-date-picker
          v-model="formData.lastSyncTime"
          type="date"
          value-format="x"
          placeholder="选择最近一次从 Temu 同步的时间"
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
import { ShippingCompanyApi, ShippingCompany } from '@/api/temu/shippingcompany'

/** Temu 区域承运商目录 表单 */
defineOptions({ name: 'ShippingCompanyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  site: undefined,
  regionId: undefined,
  logisticsServiceProviderId: undefined,
  logisticsServiceProviderName: undefined,
  logisticsBrandName: undefined,
  lastSyncTime: undefined
})
const formRules = reactive({
  site: [{ required: true, message: 'Temu 站点代码，例如 US、DE、JP不能为空', trigger: 'blur' }],
  regionId: [{ required: true, message: 'Temu 区域编号不能为空', trigger: 'blur' }],
  logisticsServiceProviderId: [{ required: true, message: 'Temu 物流服务商编号不能为空', trigger: 'blur' }],
  logisticsServiceProviderName: [{ required: true, message: '物流服务商名称不能为空', trigger: 'blur' }],
  lastSyncTime: [{ required: true, message: '最近一次从 Temu 同步的时间不能为空', trigger: 'blur' }]
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
      formData.value = await ShippingCompanyApi.getShippingCompany(id)
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
    const data = formData.value as unknown as ShippingCompany
    if (formType.value === 'create') {
      await ShippingCompanyApi.createShippingCompany(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShippingCompanyApi.updateShippingCompany(data)
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
    site: undefined,
    regionId: undefined,
    logisticsServiceProviderId: undefined,
    logisticsServiceProviderName: undefined,
    logisticsBrandName: undefined,
    lastSyncTime: undefined
  }
  formRef.value?.resetFields()
}
</script>