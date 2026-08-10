<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="关联 amazon_listing.id" prop="listingId">
        <el-input v-model="formData.listingId" placeholder="请输入关联 amazon_listing.id" />
      </el-form-item>
      <el-form-item label="Amazon Marketplace ID" prop="marketplaceId">
        <el-input v-model="formData.marketplaceId" placeholder="请输入Amazon Marketplace ID" />
      </el-form-item>
      <el-form-item label="Amazon 标准识别号" prop="asin">
        <el-input v-model="formData.asin" placeholder="请输入Amazon 标准识别号" />
      </el-form-item>
      <el-form-item label="Amazon 商品类型" prop="productType">
        <el-select v-model="formData.productType" placeholder="请选择Amazon 商品类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品状况类型" prop="conditionType">
        <el-select v-model="formData.conditionType" placeholder="请选择商品状况类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Amazon 商品名称" prop="itemName">
        <el-input v-model="formData.itemName" placeholder="请输入Amazon 商品名称" />
      </el-form-item>
      <el-form-item label="Amazon Listing 创建时间" prop="amazonCreatedTime">
        <el-date-picker
          v-model="formData.amazonCreatedTime"
          type="date"
          value-format="x"
          placeholder="选择Amazon Listing 创建时间"
        />
      </el-form-item>
      <el-form-item label="Amazon Listing 更新时间" prop="amazonUpdatedTime">
        <el-date-picker
          v-model="formData.amazonUpdatedTime"
          type="date"
          value-format="x"
          placeholder="选择Amazon Listing 更新时间"
        />
      </el-form-item>
      <el-form-item label="最后同步时间" prop="lastSyncTime">
        <el-date-picker
          v-model="formData.lastSyncTime"
          type="date"
          value-format="x"
          placeholder="选择最后同步时间"
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
import { ListingMarketplaceApi, ListingMarketplace } from '@/api/amazon/listingmarketplace'

/** Listing信息表 表单 */
defineOptions({ name: 'ListingMarketplaceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  listingId: undefined,
  marketplaceId: undefined,
  asin: undefined,
  productType: undefined,
  conditionType: undefined,
  itemName: undefined,
  amazonCreatedTime: undefined,
  amazonUpdatedTime: undefined,
  lastSyncTime: undefined
})
const formRules = reactive({
  listingId: [{ required: true, message: '关联 amazon_listing.id不能为空', trigger: 'blur' }],
  marketplaceId: [{ required: true, message: 'Amazon Marketplace ID不能为空', trigger: 'blur' }]
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
      formData.value = await ListingMarketplaceApi.getListingMarketplace(id)
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
    const data = formData.value as unknown as ListingMarketplace
    if (formType.value === 'create') {
      await ListingMarketplaceApi.createListingMarketplace(data)
      message.success(t('common.createSuccess'))
    } else {
      await ListingMarketplaceApi.updateListingMarketplace(data)
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
    listingId: undefined,
    marketplaceId: undefined,
    asin: undefined,
    productType: undefined,
    conditionType: undefined,
    itemName: undefined,
    amazonCreatedTime: undefined,
    amazonUpdatedTime: undefined,
    lastSyncTime: undefined
  }
  formRef.value?.resetFields()
}
</script>