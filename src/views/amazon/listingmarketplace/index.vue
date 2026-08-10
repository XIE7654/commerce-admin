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
      <el-form-item label="关联 amazon_listing.id" prop="listingId">
        <el-input
          v-model="queryParams.listingId"
          placeholder="请输入关联 amazon_listing.id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Amazon Marketplace ID" prop="marketplaceId">
        <el-input
          v-model="queryParams.marketplaceId"
          placeholder="请输入Amazon Marketplace ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Amazon 标准识别号" prop="asin">
        <el-input
          v-model="queryParams.asin"
          placeholder="请输入Amazon 标准识别号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Amazon 商品类型" prop="productType">
        <el-select
          v-model="queryParams.productType"
          placeholder="请选择Amazon 商品类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品状况类型" prop="conditionType">
        <el-select
          v-model="queryParams.conditionType"
          placeholder="请选择商品状况类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="Amazon 商品名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入Amazon 商品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="Amazon Listing 创建时间" prop="amazonCreatedTime">
        <el-date-picker
          v-model="queryParams.amazonCreatedTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="Amazon Listing 更新时间" prop="amazonUpdatedTime">
        <el-date-picker
          v-model="queryParams.amazonUpdatedTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="最后同步时间" prop="lastSyncTime">
        <el-date-picker
          v-model="queryParams.lastSyncTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
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
          v-hasPermi="['amazon:listing-marketplace:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['amazon:listing-marketplace:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
            type="danger"
            plain
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
            v-hasPermi="['amazon:listing-marketplace:delete']"
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
      <el-table-column label="关联 amazon_listing.id" align="center" prop="listingId" />
      <el-table-column label="Amazon Marketplace ID" align="center" prop="marketplaceId" />
      <el-table-column label="Amazon 标准识别号" align="center" prop="asin" />
      <el-table-column label="Amazon 商品类型" align="center" prop="productType" />
      <el-table-column label="商品状况类型" align="center" prop="conditionType" />
      <el-table-column label="Amazon 商品名称" align="center" prop="itemName" />
      <el-table-column
        label="Amazon Listing 创建时间"
        align="center"
        prop="amazonCreatedTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="Amazon Listing 更新时间"
        align="center"
        prop="amazonUpdatedTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="最后同步时间"
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
            v-hasPermi="['amazon:listing-marketplace:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['amazon:listing-marketplace:delete']"
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
  <ListingMarketplaceForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ListingMarketplaceApi, ListingMarketplace } from '@/api/amazon/listingmarketplace'
import ListingMarketplaceForm from './ListingMarketplaceForm.vue'

/** Listing信息表 列表 */
defineOptions({ name: 'AmazonListingMarketplace' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ListingMarketplace[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  listingId: undefined,
  marketplaceId: undefined,
  asin: undefined,
  productType: undefined,
  conditionType: undefined,
  itemName: undefined,
  amazonCreatedTime: [],
  amazonUpdatedTime: [],
  lastSyncTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ListingMarketplaceApi.getListingMarketplacePage(queryParams)
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
    await ListingMarketplaceApi.deleteListingMarketplace(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除Listing信息表 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await ListingMarketplaceApi.deleteListingMarketplaceList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch {}
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: ListingMarketplace[]) => {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ListingMarketplaceApi.exportListingMarketplace(queryParams)
    download.excel(data, 'Listing信息表.xls')
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