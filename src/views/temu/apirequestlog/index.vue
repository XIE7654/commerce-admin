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
      <el-form-item label="店铺编号" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入店铺编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="站点代码" prop="site">
        <el-input
          v-model="queryParams.site"
          placeholder="站点代码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="API 分类" prop="apiCategory">
        <el-input
          v-model="queryParams.apiCategory"
          placeholder="请输入API 分类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="接口type" prop="operationName">
        <el-input
          v-model="queryParams.operationName"
          placeholder="OpenAPI 接口 type"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="请求方式" prop="requestMethod">
        <el-input
          v-model="queryParams.requestMethod"
          placeholder="请输入HTTP 请求方式"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="URL" prop="requestUrl">
        <el-input
          v-model="queryParams.requestUrl"
          placeholder="请输入脱敏后的完整请求 URL"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="请求路径" prop="requestPath">
        <el-input
          v-model="queryParams.requestPath"
          placeholder="请输入请求路径"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['temu:api-request-log:export']"
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
      <!--      <el-table-column label="本次调用唯一请求编号" align="center" prop="requestId" />-->
      <!--      <el-table-column label="链路追踪编号" align="center" prop="traceId" />-->
      <el-table-column label="店铺编号" align="center" prop="shopId" />
      <el-table-column label="站点代码" align="center" prop="site" />
      <el-table-column label="API 分类" align="center" prop="apiCategory" />
      <el-table-column label="接口 type" align="center" prop="operationName" />
      <el-table-column label="请求方式" align="center" prop="requestMethod" />
      <!--      <el-table-column label="完整请求 URL" align="center" prop="requestUrl" />-->
      <!--      <el-table-column label="请求路径" align="center" prop="requestPath" />-->
      <el-table-column label="文件编号id" align="center" prop="fileId" />
      <el-table-column label="查询参数或请求体" align="center" prop="requestParams" />
      <el-table-column label="请求头" align="center" prop="requestHeaders" />
      <!--      <el-table-column label="SHA-256" align="center" prop="requestBodyHash" />-->
      <el-table-column label="HTTP 状态码" align="center" prop="httpStatusCode" />
      <el-table-column label="调用结果" align="center" prop="resultStatus" />
      <el-table-column label="或应用错误码" align="center" prop="errorCode" />
      <el-table-column label="脱敏后的错误信息" align="center" prop="errorMessage" />
      <el-table-column label="速率限制" align="center" prop="rateLimit" />
      <el-table-column label="已重试次数" align="center" prop="retryCount" />
      <el-table-column label="请求总耗时" align="center" prop="durationMs" />
      <el-table-column
        label="开始请求时间"
        align="center"
        prop="requestedAt"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="请求完成时间"
        align="center"
        prop="completedAt"
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
      <el-table-column label="请求编号" align="center" prop="temuRequestId" />
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
  <ApiRequestLogForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ApiRequestLogApi, ApiRequestLog } from '@/api/temu/apirequestlog'
import ApiRequestLogForm from './ApiRequestLogForm.vue'

/** OpenAPI 请求调用日志 列表 */
defineOptions({ name: 'TemuApiRequestLog' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref<ApiRequestLog[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shopId: undefined,
  site: undefined,
  apiCategory: undefined,
  operationName: undefined,
  requestMethod: undefined,
  requestUrl: undefined,
  requestPath: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ApiRequestLogApi.getApiRequestLogPage(queryParams)
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

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ApiRequestLogApi.exportApiRequestLog(queryParams)
    download.excel(data, 'OpenAPI 请求调用日志.xls')
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
