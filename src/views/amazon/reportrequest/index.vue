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
      <el-form-item label="关联 amazon_shop.id" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入关联 amazon_shop.id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="请求站点国家代码，例如 US" prop="countryCode">
        <el-input
          v-model="queryParams.countryCode"
          placeholder="请输入请求站点国家代码，例如 US"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Amazon 报表类型，例如 GET_MERCHANT_LISTINGS_ALL_DATA" prop="reportType">
        <el-select
          v-model="queryParams.reportType"
          placeholder="请选择Amazon 报表类型，例如 GET_MERCHANT_LISTINGS_ALL_DATA"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="报表数据开始时间" prop="dataStartTime">
        <el-date-picker
          v-model="queryParams.dataStartTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="Amazon 状态：IN_QUEUE、IN_PROGRESS、DONE、CANCELLED、FATAL" prop="amazonProcessingStatus">
        <el-select
          v-model="queryParams.amazonProcessingStatus"
          placeholder="请选择Amazon 状态：IN_QUEUE、IN_PROGRESS、DONE、CANCELLED、FATAL"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态：0-待提交，1-等待Amazon处理，2-待下载，3-成功，4-重试等待，5-失败，6-已取消" prop="taskStatus">
        <el-select
          v-model="queryParams.taskStatus"
          placeholder="请选择任务状态：0-待提交，1-等待Amazon处理，2-待下载，3-成功，4-重试等待，5-失败，6-已取消"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
          @click="openForm('create')"
          v-hasPermi="['amazon:report-request:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['amazon:report-request:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
            type="danger"
            plain
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
            v-hasPermi="['amazon:report-request:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
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
        @selection-change="handleRowCheckboxChange"
    >
    <el-table-column type="selection" width="55" />
      <el-table-column label="主键编号" align="center" prop="id" />
      <el-table-column label="本地报表请求唯一编号，用于任务幂等与关联日志" align="center" prop="requestNo" />
      <el-table-column label="关联 amazon_shop.id" align="center" prop="shopId" />
      <el-table-column label="请求站点国家代码，例如 US" align="center" prop="countryCode" />
      <el-table-column label="Amazon Marketplace ID 列表，Reports API 最多支持 25 个" align="center" prop="marketplaceIds" />
      <el-table-column label="Amazon 报表类型，例如 GET_MERCHANT_LISTINGS_ALL_DATA" align="center" prop="reportType" />
      <el-table-column label="报表附加选项，随报表类型变化" align="center" prop="reportOptions" />
      <el-table-column
        label="报表数据开始时间"
        align="center"
        prop="dataStartTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="报表数据结束时间"
        align="center"
        prop="dataEndTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="Amazon reportId；在店铺维度唯一" align="center" prop="amazonReportId" />
      <el-table-column label="创建该报表的 Amazon 计划编号；手工请求为空" align="center" prop="amazonReportScheduleId" />
      <el-table-column label="Amazon 状态：IN_QUEUE、IN_PROGRESS、DONE、CANCELLED、FATAL" align="center" prop="amazonProcessingStatus" />
      <el-table-column
        label="Amazon 创建报表时间"
        align="center"
        prop="amazonCreatedTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="Amazon 开始处理时间"
        align="center"
        prop="processingStartTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="Amazon 完成处理时间"
        align="center"
        prop="processingEndTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="Amazon reportDocumentId" align="center" prop="reportDocumentId" />
      <el-table-column label="下载文件压缩算法，例如 GZIP" align="center" prop="compressionAlgorithm" />
      <el-table-column label="已下载并归档的文件编号，对应 infra_file.id" align="center" prop="fileId" />
      <el-table-column
        label="报表文件下载完成时间"
        align="center"
        prop="downloadTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="任务状态：0-待提交，1-等待Amazon处理，2-待下载，3-成功，4-重试等待，5-失败，6-已取消" align="center" prop="taskStatus" />
      <el-table-column label="当前执行阶段：0-提交，1-查询状态，2-下载文件" align="center" prop="executeStage" />
      <el-table-column label="当前阶段已重试次数" align="center" prop="retryCount" />
      <el-table-column label="当前阶段最大重试次数" align="center" prop="maxRetryCount" />
      <el-table-column
        label="下次可执行时间；用于退避重试和轮询调度"
        align="center"
        prop="nextRetryTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="最近一次调用 Amazon 时间"
        align="center"
        prop="lastRequestTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="最近一次失败错误码" align="center" prop="lastErrorCode" />
      <el-table-column label="最近一次失败原因" align="center" prop="lastErrorMessage" />
      <el-table-column
        label="任务成功、失败或取消的最终完成时间"
        align="center"
        prop="completedTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="乐观锁版本，防止多个任务执行器重复处理" align="center" prop="lockVersion" />
      <el-table-column
        label="任务执行租约到期时间；超时后允许其他执行器接管"
        align="center"
        prop="lockExpireTime"
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
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['amazon:report-request:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['amazon:report-request:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ReportRequestForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ReportRequestApi, ReportRequest } from '@/api/amazon/reportrequest'
import ReportRequestForm from './ReportRequestForm.vue'

/** Amazon 报表请求及异步处理任务 列表 */
defineOptions({ name: 'AmazonReportRequest' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ReportRequest[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shopId: undefined,
  countryCode: undefined,
  reportType: undefined,
  dataStartTime: [],
  amazonProcessingStatus: undefined,
  taskStatus: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ReportRequestApi.getReportRequestPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ReportRequestApi.deleteReportRequest(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除Amazon 报表请求及异步处理任务 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await ReportRequestApi.deleteReportRequestList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: ReportRequest[]) => {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ReportRequestApi.exportReportRequest(queryParams)
    download.excel(data, 'Amazon 报表请求及异步处理任务.xls')
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