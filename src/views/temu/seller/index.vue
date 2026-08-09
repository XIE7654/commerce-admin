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
      <el-form-item label="店铺" prop="shopId">
        <el-select
          v-model="queryParams.shopId"
          placeholder="请选择店铺"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="shop in shopList"
            :key="shop.id"
            :label="shop.shopName"
            :value="shop.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          @click="openForm('create')"-->
<!--          v-hasPermi="['temu:seller:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--          v-hasPermi="['temu:seller:export']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->
<!--        <el-button-->
<!--            type="danger"-->
<!--            plain-->
<!--            :disabled="isEmpty(checkedIds)"-->
<!--            @click="handleDeleteBatch"-->
<!--            v-hasPermi="['temu:seller:delete']"-->
<!--        >-->
<!--          <Icon icon="ep:delete" class="mr-5px" /> 批量删除-->
<!--        </el-button>-->
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
      <el-table-column label="店铺" align="center" prop="shopName" />
      <el-table-column label="semiUniqueId" align="center" prop="semiUniqueId" />
      <el-table-column label="区域编号" align="center" prop="regionId" />
      <el-table-column label="mallId" align="center" prop="mallId" />
      <el-table-column label="mallType" align="center" prop="mallType" />
      <el-table-column label="应用订阅状态" align="center" prop="appSubscribeStatus" />
      <el-table-column
        label="授权过期时间"
        align="center"
        prop="expiredAt"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="应用订阅事件编码列表" align="center" prop="appSubscribeEventCodeList" />
      <el-table-column label="授权事件及权限状态列表" align="center" prop="authEventCodeList" />
      <el-table-column label="API 权限范围列表" align="center" prop="apiScopeList" />
      <el-table-column
        label="最近一次同步授权信息时间"
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
  <SellerForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { SellerApi, Seller } from '@/api/temu/seller'
import { ShopApi, ShopSimple } from '@/api/temu/shop'
import SellerForm from './SellerForm.vue'

/** Temu 卖家商城授权信息 列表 */
defineOptions({ name: 'TemuSeller' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<Seller[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const shopList = ref<ShopSimple[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shopId: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SellerApi.getSellerPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 查询店铺下拉列表 */
const getShopList = async () => {
  shopList.value = await ShopApi.getShopSimpleList()
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
    await SellerApi.deleteSeller(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
  getShopList()
})
</script>
