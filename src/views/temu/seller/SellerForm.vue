<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="API 权限范围列表" prop="apiScopeList">
        <el-input v-model="formData.apiScopeList" placeholder="请输入API 权限范围列表" />
      </el-form-item>
      <el-form-item label="接口完整响应快照，便于兼容后续字段" prop="responseJson">
        <el-input v-model="formData.responseJson" placeholder="请输入接口完整响应快照，便于兼容后续字段" />
      </el-form-item>
      <el-form-item label="最近一次同步授权信息时间" prop="lastSyncTime">
        <el-date-picker
          v-model="formData.lastSyncTime"
          type="date"
          value-format="x"
          placeholder="选择最近一次同步授权信息时间"
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
import { SellerApi, Seller } from '@/api/temu/seller'

/** Temu 卖家商城授权信息 表单 */
defineOptions({ name: 'SellerForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  apiScopeList: undefined,
  responseJson: undefined,
  lastSyncTime: undefined
})
const formRules = reactive({
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
      formData.value = await SellerApi.getSeller(id)
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
    const data = formData.value as unknown as Seller
    if (formType.value === 'create') {
      await SellerApi.createSeller(data)
      message.success(t('common.createSuccess'))
    } else {
      await SellerApi.updateSeller(data)
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
    apiScopeList: undefined,
    responseJson: undefined,
    lastSyncTime: undefined
  }
  formRef.value?.resetFields()
}
</script>