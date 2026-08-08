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
      <el-form-item label="Temu 店铺编号" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入Temu 店铺编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Temu 站点代码，例如 US、DE、JP" prop="site">
        <el-input
          v-model="queryParams.site"
          placeholder="请输入Temu 站点代码，例如 US、DE、JP"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="API 分类，例如 product、order" prop="apiCategory">
        <el-input
          v-model="queryParams.apiCategory"
          placeholder="请输入API 分类，例如 product、order"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Temu OpenAPI 接口 type" prop="operationName">
        <el-input
          v-model="queryParams.operationName"
          placeholder="请输入Temu OpenAPI 接口 type"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="HTTP 请求方式" prop="requestMethod">
        <el-input
          v-model="queryParams.requestMethod"
          placeholder="请输入HTTP 请求方式"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="脱敏后的完整请求 URL" prop="requestUrl">
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
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['temu:api-request-log:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['temu:api-request-log:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
            type="danger"
            plain
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
            v-hasPermi="['temu:api-request-log:delete']"
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
      <el-table-column label="本次调用唯一请求编号" align="center" prop="requestId" />
      <el-table-column label="链路追踪编号" align="center" prop="traceId" />
      <el-table-column label="Temu 店铺编号" align="center" prop="shopId" />
      <el-table-column label="Temu 站点代码，例如 US、DE、JP" align="center" prop="site" />
      <el-table-column label="API 分类，例如 product、order" align="center" prop="apiCategory" />
      <el-table-column label="Temu OpenAPI 接口 type" align="center" prop="operationName" />
      <el-table-column label="HTTP 请求方式" align="center" prop="requestMethod" />
      <el-table-column label="脱敏后的完整请求 URL" align="center" prop="requestUrl" />
      <el-table-column label="请求路径" align="center" prop="requestPath" />
      <el-table-column label="响应归档文件编号，对应 infra_file.id" align="center" prop="fileId" />
      <el-table-column label="脱敏后的查询参数或请求体" align="center" prop="requestParams" />
      <el-table-column label="脱敏后的请求头" align="center" prop="requestHeaders" />
      <el-table-column label="原始请求体 SHA-256" align="center" prop="requestBodyHash" />
      <el-table-column label="HTTP 状态码；网络异常时为空" align="center" prop="httpStatusCode" />
      <el-table-column label="调用结果：0-处理中，1-成功，2-失败" align="center" prop="resultStatus" />
      <el-table-column label="Temu 或应用错误码" align="center" prop="errorCode" />
      <el-table-column label="脱敏后的错误信息" align="center" prop="errorMessage" />
      <el-table-column label="Temu 返回的请求编号" align="center" prop="temuRequestId" />
      <el-table-column label="Temu 返回的速率限制" align="center" prop="rateLimit" />
      <el-table-column label="本次调用已重试次数" align="center" prop="retryCount" />
      <el-table-column label="请求总耗时，单位毫秒" align="center" prop="durationMs" />
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
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['temu:api-request-log:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['temu:api-request-log:delete']"
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
  <ApiRequestLogForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ApiRequestLogApi, ApiRequestLog } from '@/api/temu/apirequestlog'
import ApiRequestLogForm from './ApiRequestLogForm.vue'

/** Temu OpenAPI 请求调用日志 列表 */
defineOptions({ name: 'TemuApiRequestLog' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ApiRequestLogApi.deleteApiRequestLog(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除Temu OpenAPI 请求调用日志 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await ApiRequestLogApi.deleteApiRequestLogList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: ApiRequestLog[]) => {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ApiRequestLogApi.exportApiRequestLog(queryParams)
    download.excel(data, 'Temu OpenAPI 请求调用日志.xls')
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