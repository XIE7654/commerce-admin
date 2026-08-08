<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="店铺类型" prop="shopType">
        <el-select v-model="formData.shopType" placeholder="请选择店铺类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="站点" prop="site">
        <el-input v-model="formData.site" placeholder="请输入站点" />
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="formData.shopName" placeholder="请输入店铺名称" />
      </el-form-item>
      <el-form-item label="Temu 授权 Token" prop="authToken">
        <el-input v-model="formData.authToken" placeholder="请输入Temu 授权 Token" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ShopApi, Shop } from '@/api/temu/shop'

/** Temu 店铺 表单 */
defineOptions({ name: 'ShopForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  shopType: undefined,
  site: undefined,
  shopName: undefined,
  authToken: undefined
})
const formRules = reactive({
  shopType: [{ required: true, message: '店铺类型不能为空', trigger: 'change' }],
  site: [{ required: true, message: '站点不能为空', trigger: 'blur' }],
  shopName: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
  authToken: [{ required: true, message: 'Temu 授权 Token不能为空', trigger: 'blur' }]
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
      formData.value = await ShopApi.getShop(id)
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
    const data = formData.value as unknown as Shop
    if (formType.value === 'create') {
      await ShopApi.createShop(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShopApi.updateShop(data)
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
    shopType: undefined,
    site: undefined,
    shopName: undefined,
    authToken: undefined
  }
  formRef.value?.resetFields()
}
</script>
