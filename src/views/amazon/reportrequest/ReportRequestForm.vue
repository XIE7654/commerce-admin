<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="本地报表请求唯一编号，用于任务幂等与关联日志" prop="requestNo">
        <el-input v-model="formData.requestNo" placeholder="请输入本地报表请求唯一编号，用于任务幂等与关联日志" />
      </el-form-item>
      <el-form-item label="关联 amazon_shop.id" prop="shopId">
        <el-input v-model="formData.shopId" placeholder="请输入关联 amazon_shop.id" />
      </el-form-item>
      <el-form-item label="请求站点国家代码，例如 US" prop="countryCode">
        <el-input v-model="formData.countryCode" placeholder="请输入请求站点国家代码，例如 US" />
      </el-form-item>
      <el-form-item label="Amazon Marketplace ID 列表，Reports API 最多支持 25 个" prop="marketplaceIds">
        <el-input v-model="formData.marketplaceIds" placeholder="请输入Amazon Marketplace ID 列表，Reports API 最多支持 25 个" />
      </el-form-item>
      <el-form-item label="Amazon 报表类型，例如 GET_MERCHANT_LISTINGS_ALL_DATA" prop="reportType">
        <el-select v-model="formData.reportType" placeholder="请选择Amazon 报表类型，例如 GET_MERCHANT_LISTINGS_ALL_DATA">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="报表附加选项，随报表类型变化" prop="reportOptions">
        <el-input v-model="formData.reportOptions" placeholder="请输入报表附加选项，随报表类型变化" />
      </el-form-item>
      <el-form-item label="报表数据开始时间" prop="dataStartTime">
        <el-date-picker
          v-model="formData.dataStartTime"
          type="date"
          value-format="x"
          placeholder="选择报表数据开始时间"
        />
      </el-form-item>
      <el-form-item label="报表数据结束时间" prop="dataEndTime">
        <el-date-picker
          v-model="formData.dataEndTime"
          type="date"
          value-format="x"
          placeholder="选择报表数据结束时间"
        />
      </el-form-item>
      <el-form-item label="Amazon reportId；在店铺维度唯一" prop="amazonReportId">
        <el-input v-model="formData.amazonReportId" placeholder="请输入Amazon reportId；在店铺维度唯一" />
      </el-form-item>
      <el-form-item label="创建该报表的 Amazon 计划编号；手工请求为空" prop="amazonReportScheduleId">
        <el-input v-model="formData.amazonReportScheduleId" placeholder="请输入创建该报表的 Amazon 计划编号；手工请求为空" />
      </el-form-item>
      <el-form-item label="Amazon 状态：IN_QUEUE、IN_PROGRESS、DONE、CANCELLED、FATAL" prop="amazonProcessingStatus">
        <el-radio-group v-model="formData.amazonProcessingStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Amazon 创建报表时间" prop="amazonCreatedTime">
        <el-date-picker
          v-model="formData.amazonCreatedTime"
          type="date"
          value-format="x"
          placeholder="选择Amazon 创建报表时间"
        />
      </el-form-item>
      <el-form-item label="Amazon 开始处理时间" prop="processingStartTime">
        <el-date-picker
          v-model="formData.processingStartTime"
          type="date"
          value-format="x"
          placeholder="选择Amazon 开始处理时间"
        />
      </el-form-item>
      <el-form-item label="Amazon 完成处理时间" prop="processingEndTime">
        <el-date-picker
          v-model="formData.processingEndTime"
          type="date"
          value-format="x"
          placeholder="选择Amazon 完成处理时间"
        />
      </el-form-item>
      <el-form-item label="Amazon reportDocumentId" prop="reportDocumentId">
        <el-input v-model="formData.reportDocumentId" placeholder="请输入Amazon reportDocumentId" />
      </el-form-item>
      <el-form-item label="下载文件压缩算法，例如 GZIP" prop="compressionAlgorithm">
        <el-input v-model="formData.compressionAlgorithm" placeholder="请输入下载文件压缩算法，例如 GZIP" />
      </el-form-item>
      <el-form-item label="已下载并归档的文件编号，对应 infra_file.id" prop="fileId">
        <el-input v-model="formData.fileId" placeholder="请输入已下载并归档的文件编号，对应 infra_file.id" />
      </el-form-item>
      <el-form-item label="报表文件下载完成时间" prop="downloadTime">
        <el-date-picker
          v-model="formData.downloadTime"
          type="date"
          value-format="x"
          placeholder="选择报表文件下载完成时间"
        />
      </el-form-item>
      <el-form-item label="任务状态：0-待提交，1-等待Amazon处理，2-待下载，3-成功，4-重试等待，5-失败，6-已取消" prop="taskStatus">
        <el-radio-group v-model="formData.taskStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="当前执行阶段：0-提交，1-查询状态，2-下载文件" prop="executeStage">
        <el-input v-model="formData.executeStage" placeholder="请输入当前执行阶段：0-提交，1-查询状态，2-下载文件" />
      </el-form-item>
      <el-form-item label="当前阶段已重试次数" prop="retryCount">
        <el-input v-model="formData.retryCount" placeholder="请输入当前阶段已重试次数" />
      </el-form-item>
      <el-form-item label="当前阶段最大重试次数" prop="maxRetryCount">
        <el-input v-model="formData.maxRetryCount" placeholder="请输入当前阶段最大重试次数" />
      </el-form-item>
      <el-form-item label="下次可执行时间；用于退避重试和轮询调度" prop="nextRetryTime">
        <el-date-picker
          v-model="formData.nextRetryTime"
          type="date"
          value-format="x"
          placeholder="选择下次可执行时间；用于退避重试和轮询调度"
        />
      </el-form-item>
      <el-form-item label="最近一次调用 Amazon 时间" prop="lastRequestTime">
        <el-date-picker
          v-model="formData.lastRequestTime"
          type="date"
          value-format="x"
          placeholder="选择最近一次调用 Amazon 时间"
        />
      </el-form-item>
      <el-form-item label="最近一次失败错误码" prop="lastErrorCode">
        <el-input v-model="formData.lastErrorCode" placeholder="请输入最近一次失败错误码" />
      </el-form-item>
      <el-form-item label="最近一次失败原因" prop="lastErrorMessage">
        <el-input v-model="formData.lastErrorMessage" placeholder="请输入最近一次失败原因" />
      </el-form-item>
      <el-form-item label="任务成功、失败或取消的最终完成时间" prop="completedTime">
        <el-date-picker
          v-model="formData.completedTime"
          type="date"
          value-format="x"
          placeholder="选择任务成功、失败或取消的最终完成时间"
        />
      </el-form-item>
      <el-form-item label="乐观锁版本，防止多个任务执行器重复处理" prop="lockVersion">
        <el-input v-model="formData.lockVersion" placeholder="请输入乐观锁版本，防止多个任务执行器重复处理" />
      </el-form-item>
      <el-form-item label="任务执行租约到期时间；超时后允许其他执行器接管" prop="lockExpireTime">
        <el-date-picker
          v-model="formData.lockExpireTime"
          type="date"
          value-format="x"
          placeholder="选择任务执行租约到期时间；超时后允许其他执行器接管"
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
import { ReportRequestApi, ReportRequest } from '@/api/amazon/reportrequest'

/** Amazon 报表请求及异步处理任务 表单 */
defineOptions({ name: 'ReportRequestForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  requestNo: undefined,
  shopId: undefined,
  countryCode: undefined,
  marketplaceIds: undefined,
  reportType: undefined,
  reportOptions: undefined,
  dataStartTime: undefined,
  dataEndTime: undefined,
  amazonReportId: undefined,
  amazonReportScheduleId: undefined,
  amazonProcessingStatus: undefined,
  amazonCreatedTime: undefined,
  processingStartTime: undefined,
  processingEndTime: undefined,
  reportDocumentId: undefined,
  compressionAlgorithm: undefined,
  fileId: undefined,
  downloadTime: undefined,
  taskStatus: undefined,
  executeStage: undefined,
  retryCount: undefined,
  maxRetryCount: undefined,
  nextRetryTime: undefined,
  lastRequestTime: undefined,
  lastErrorCode: undefined,
  lastErrorMessage: undefined,
  completedTime: undefined,
  lockVersion: undefined,
  lockExpireTime: undefined
})
const formRules = reactive({
  requestNo: [{ required: true, message: '本地报表请求唯一编号，用于任务幂等与关联日志不能为空', trigger: 'blur' }],
  shopId: [{ required: true, message: '关联 amazon_shop.id不能为空', trigger: 'blur' }],
  countryCode: [{ required: true, message: '请求站点国家代码，例如 US不能为空', trigger: 'blur' }],
  marketplaceIds: [{ required: true, message: 'Amazon Marketplace ID 列表，Reports API 最多支持 25 个不能为空', trigger: 'blur' }],
  reportType: [{ required: true, message: 'Amazon 报表类型，例如 GET_MERCHANT_LISTINGS_ALL_DATA不能为空', trigger: 'change' }],
  taskStatus: [{ required: true, message: '任务状态：0-待提交，1-等待Amazon处理，2-待下载，3-成功，4-重试等待，5-失败，6-已取消不能为空', trigger: 'blur' }],
  executeStage: [{ required: true, message: '当前执行阶段：0-提交，1-查询状态，2-下载文件不能为空', trigger: 'blur' }],
  retryCount: [{ required: true, message: '当前阶段已重试次数不能为空', trigger: 'blur' }],
  maxRetryCount: [{ required: true, message: '当前阶段最大重试次数不能为空', trigger: 'blur' }],
  lockVersion: [{ required: true, message: '乐观锁版本，防止多个任务执行器重复处理不能为空', trigger: 'blur' }]
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
      formData.value = await ReportRequestApi.getReportRequest(id)
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
    const data = formData.value as unknown as ReportRequest
    if (formType.value === 'create') {
      await ReportRequestApi.createReportRequest(data)
      message.success(t('common.createSuccess'))
    } else {
      await ReportRequestApi.updateReportRequest(data)
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
    requestNo: undefined,
    shopId: undefined,
    countryCode: undefined,
    marketplaceIds: undefined,
    reportType: undefined,
    reportOptions: undefined,
    dataStartTime: undefined,
    dataEndTime: undefined,
    amazonReportId: undefined,
    amazonReportScheduleId: undefined,
    amazonProcessingStatus: undefined,
    amazonCreatedTime: undefined,
    processingStartTime: undefined,
    processingEndTime: undefined,
    reportDocumentId: undefined,
    compressionAlgorithm: undefined,
    fileId: undefined,
    downloadTime: undefined,
    taskStatus: undefined,
    executeStage: undefined,
    retryCount: undefined,
    maxRetryCount: undefined,
    nextRetryTime: undefined,
    lastRequestTime: undefined,
    lastErrorCode: undefined,
    lastErrorMessage: undefined,
    completedTime: undefined,
    lockVersion: undefined,
    lockExpireTime: undefined
  }
  formRef.value?.resetFields()
}
</script>