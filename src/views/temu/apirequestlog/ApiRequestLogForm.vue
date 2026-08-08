<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="本次调用唯一请求编号" prop="requestId">
        <el-input v-model="formData.requestId" placeholder="请输入本次调用唯一请求编号" />
      </el-form-item>
      <el-form-item label="链路追踪编号" prop="traceId">
        <el-input v-model="formData.traceId" placeholder="请输入链路追踪编号" />
      </el-form-item>
      <el-form-item label="Temu 店铺编号" prop="shopId">
        <el-input v-model="formData.shopId" placeholder="请输入Temu 店铺编号" />
      </el-form-item>
      <el-form-item label="Temu 站点代码，例如 US、DE、JP" prop="site">
        <el-input v-model="formData.site" placeholder="请输入Temu 站点代码，例如 US、DE、JP" />
      </el-form-item>
      <el-form-item label="API 分类，例如 product、order" prop="apiCategory">
        <el-input v-model="formData.apiCategory" placeholder="请输入API 分类，例如 product、order" />
      </el-form-item>
      <el-form-item label="Temu OpenAPI 接口 type" prop="operationName">
        <el-input v-model="formData.operationName" placeholder="请输入Temu OpenAPI 接口 type" />
      </el-form-item>
      <el-form-item label="HTTP 请求方式" prop="requestMethod">
        <el-input v-model="formData.requestMethod" placeholder="请输入HTTP 请求方式" />
      </el-form-item>
      <el-form-item label="脱敏后的完整请求 URL" prop="requestUrl">
        <el-input v-model="formData.requestUrl" placeholder="请输入脱敏后的完整请求 URL" />
      </el-form-item>
      <el-form-item label="请求路径" prop="requestPath">
        <el-input v-model="formData.requestPath" placeholder="请输入请求路径" />
      </el-form-item>
      <el-form-item label="响应归档文件编号，对应 infra_file.id" prop="fileId">
        <el-input v-model="formData.fileId" placeholder="请输入响应归档文件编号，对应 infra_file.id" />
      </el-form-item>
      <el-form-item label="脱敏后的查询参数或请求体" prop="requestParams">
        <el-input v-model="formData.requestParams" placeholder="请输入脱敏后的查询参数或请求体" />
      </el-form-item>
      <el-form-item label="脱敏后的请求头" prop="requestHeaders">
        <el-input v-model="formData.requestHeaders" placeholder="请输入脱敏后的请求头" />
      </el-form-item>
      <el-form-item label="原始请求体 SHA-256" prop="requestBodyHash">
        <el-input v-model="formData.requestBodyHash" placeholder="请输入原始请求体 SHA-256" />
      </el-form-item>
      <el-form-item label="HTTP 状态码；网络异常时为空" prop="httpStatusCode">
        <el-input v-model="formData.httpStatusCode" placeholder="请输入HTTP 状态码；网络异常时为空" />
      </el-form-item>
      <el-form-item label="调用结果：0-处理中，1-成功，2-失败" prop="resultStatus">
        <el-radio-group v-model="formData.resultStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Temu 或应用错误码" prop="errorCode">
        <el-input v-model="formData.errorCode" placeholder="请输入Temu 或应用错误码" />
      </el-form-item>
      <el-form-item label="脱敏后的错误信息" prop="errorMessage">
        <el-input v-model="formData.errorMessage" placeholder="请输入脱敏后的错误信息" />
      </el-form-item>
      <el-form-item label="Temu 返回的请求编号" prop="temuRequestId">
        <el-input v-model="formData.temuRequestId" placeholder="请输入Temu 返回的请求编号" />
      </el-form-item>
      <el-form-item label="Temu 返回的速率限制" prop="rateLimit">
        <el-input v-model="formData.rateLimit" placeholder="请输入Temu 返回的速率限制" />
      </el-form-item>
      <el-form-item label="本次调用已重试次数" prop="retryCount">
        <el-input v-model="formData.retryCount" placeholder="请输入本次调用已重试次数" />
      </el-form-item>
      <el-form-item label="请求总耗时，单位毫秒" prop="durationMs">
        <el-input v-model="formData.durationMs" placeholder="请输入请求总耗时，单位毫秒" />
      </el-form-item>
      <el-form-item label="开始请求时间" prop="requestedAt">
        <el-date-picker
          v-model="formData.requestedAt"
          type="date"
          value-format="x"
          placeholder="选择开始请求时间"
        />
      </el-form-item>
      <el-form-item label="请求完成时间" prop="completedAt">
        <el-date-picker
          v-model="formData.completedAt"
          type="date"
          value-format="x"
          placeholder="选择请求完成时间"
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
import { ApiRequestLogApi, ApiRequestLog } from '@/api/temu/apirequestlog'

/** Temu OpenAPI 请求调用日志 表单 */
defineOptions({ name: 'ApiRequestLogForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  requestId: undefined,
  traceId: undefined,
  shopId: undefined,
  site: undefined,
  apiCategory: undefined,
  operationName: undefined,
  requestMethod: undefined,
  requestUrl: undefined,
  requestPath: undefined,
  fileId: undefined,
  requestParams: undefined,
  requestHeaders: undefined,
  requestBodyHash: undefined,
  httpStatusCode: undefined,
  resultStatus: undefined,
  errorCode: undefined,
  errorMessage: undefined,
  temuRequestId: undefined,
  rateLimit: undefined,
  retryCount: undefined,
  durationMs: undefined,
  requestedAt: undefined,
  completedAt: undefined
})
const formRules = reactive({
  requestId: [{ required: true, message: '本次调用唯一请求编号不能为空', trigger: 'blur' }],
  apiCategory: [{ required: true, message: 'API 分类，例如 product、order不能为空', trigger: 'blur' }],
  operationName: [{ required: true, message: 'Temu OpenAPI 接口 type不能为空', trigger: 'blur' }],
  requestMethod: [{ required: true, message: 'HTTP 请求方式不能为空', trigger: 'blur' }],
  resultStatus: [{ required: true, message: '调用结果：0-处理中，1-成功，2-失败不能为空', trigger: 'blur' }],
  retryCount: [{ required: true, message: '本次调用已重试次数不能为空', trigger: 'blur' }],
  requestedAt: [{ required: true, message: '开始请求时间不能为空', trigger: 'blur' }]
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
      formData.value = await ApiRequestLogApi.getApiRequestLog(id)
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
    const data = formData.value as unknown as ApiRequestLog
    if (formType.value === 'create') {
      await ApiRequestLogApi.createApiRequestLog(data)
      message.success(t('common.createSuccess'))
    } else {
      await ApiRequestLogApi.updateApiRequestLog(data)
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
    requestId: undefined,
    traceId: undefined,
    shopId: undefined,
    site: undefined,
    apiCategory: undefined,
    operationName: undefined,
    requestMethod: undefined,
    requestUrl: undefined,
    requestPath: undefined,
    fileId: undefined,
    requestParams: undefined,
    requestHeaders: undefined,
    requestBodyHash: undefined,
    httpStatusCode: undefined,
    resultStatus: undefined,
    errorCode: undefined,
    errorMessage: undefined,
    temuRequestId: undefined,
    rateLimit: undefined,
    retryCount: undefined,
    durationMs: undefined,
    requestedAt: undefined,
    completedAt: undefined
  }
  formRef.value?.resetFields()
}
</script>