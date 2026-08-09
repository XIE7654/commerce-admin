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
      <el-form-item label="Temu 父订单号" prop="parentOrderSn">
        <el-input
          v-model="queryParams.parentOrderSn"
          placeholder="请输入Temu 父订单号"
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
          v-hasPermi="['temu:order-shipping-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['temu:order-shipping-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
            type="danger"
            plain
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
            v-hasPermi="['temu:order-shipping-info:delete']"
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
      <el-table-column label="关联 temu_shop.id" align="center" prop="shopId" />
      <el-table-column label="Temu 父订单号" align="center" prop="parentOrderSn" />
      <el-table-column label="收件人姓名" align="center" prop="receiptName" />
      <el-table-column label="附加收件人姓名" align="center" prop="receiptAdditionalName" />
      <el-table-column label="收件人名字" align="center" prop="firstName" />
      <el-table-column label="收件人姓氏" align="center" prop="lastName" />
      <el-table-column label="附加收件人名字" align="center" prop="additionalFirstName" />
      <el-table-column label="附加收件人姓氏" align="center" prop="additionalLastName" />
      <el-table-column label="收件邮箱" align="center" prop="mail" />
      <el-table-column label="收件手机号" align="center" prop="mobile" />
      <el-table-column label="备用手机号" align="center" prop="backupMobile" />
      <el-table-column label="一级行政区名称，例如国家" align="center" prop="regionName1" />
      <el-table-column label="二级行政区名称，例如州省" align="center" prop="regionName2" />
      <el-table-column label="三级行政区名称，例如城市" align="center" prop="regionName3" />
      <el-table-column label="四级行政区名称" align="center" prop="regionName4" />
      <el-table-column label="邮政编码" align="center" prop="postCode" />
      <el-table-column label="地址第一行" align="center" prop="addressLine1" />
      <el-table-column label="地址第二行" align="center" prop="addressLine2" />
      <el-table-column label="地址第三行" align="center" prop="addressLine3" />
      <el-table-column label="完整收货地址" align="center" prop="addressLineAll" />
      <el-table-column label="Temu 地址警告信息" align="center" prop="warning" />
      <el-table-column
        label="最近从 Temu 同步时间"
        align="center"
        prop="lastSyncTime"
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
            v-hasPermi="['temu:order-shipping-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['temu:order-shipping-info:delete']"
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
  <OrderShippingInfoForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OrderShippingInfoApi, OrderShippingInfo } from '@/api/temu/ordershippinginfo'
import OrderShippingInfoForm from './OrderShippingInfoForm.vue'

/** Temu 父订单收货信息 列表 */
defineOptions({ name: 'TemuOrderShippingInfo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OrderShippingInfo[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  parentOrderSn: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderShippingInfoApi.getOrderShippingInfoPage(queryParams)
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
    await OrderShippingInfoApi.deleteOrderShippingInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除Temu 父订单收货信息 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await OrderShippingInfoApi.deleteOrderShippingInfoList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: OrderShippingInfo[]) => {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await OrderShippingInfoApi.exportOrderShippingInfo(queryParams)
    download.excel(data, 'Temu 父订单收货信息.xls')
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