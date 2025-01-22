<template>
    <div>
        <div class="address" v-if="!showEdit">
            <van-nav-bar
                fixed
                title="配送地址"
                left-arrow
                @click-left="$router.go(-1)"
                class="custom-nav"
            />
            <van-address-list
                v-model="chosenAddressId"
                :list="formatAddressList"
                :disabled-list="disabledList"
                disabled-text="以下地址超出配送范围"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
                @select="onSelect"
                class="custom-address-list"
            />

        </div>
        <div v-else>
            <AddressEdit
            v-model="showEdit"
            :address="currentAddress"
            @save="onSave"
            @delete="onDelete"></AddressEdit>
        </div>
    </div>

    </template>

<script>
import { getAddRessList, addAddress, updataAddress, deleteAddress, setDefault } from '@/api/address'
import AddressEdit from '@/components/AddressEdit.vue'

export default {
  name: 'addRessIndex',
  components: {
    AddressEdit
  },
  data () {
    return {
      list: [],
      chosenAddressId: '1',
      disabledList: [],
      showEdit: false,
      currentAddress: {},
      isFromOrder: false
    }
  },
  computed: {
    formatAddressList () {
      return this.list.map(item => {
        const address = [
          item.region.province,
          item.region.city,
          item.region.region,
          item.detail
        ].filter(Boolean).join('')

        return {
          id: item.address_id,
          name: item.name,
          tel: item.phone,
          address,
          isDefault: item.isDefault === 1
        }
      })
    }
  },

  created () {
    this.getAddRessList()
    this.isFromOrder = !!this.$route.query.from
  },
  methods: {
    // 获取地址列表
    async getAddRessList () {
      const { data: { list } } = await getAddRessList()

      this.list = list
    },

    onAdd () {
    // 初始化一个空的地址对象，包含所有必需的字段
      this.currentAddress = {
        addressId: null,
        name: '',
        phone: '',
        detail: '',
        isDefault: 0,
        region: {
          province: '',
          city: '',
          region: '',
          provinceCode: '',
          cityCode: '',
          regionCode: ''
        }
      }
      this.showEdit = true
    },

    async onSave (address) {
      // 检查必要的数据是否存在
      if (!address.region) {
        this.$toast('请选择省市区')
        return
      }
      // 如果是编辑，添加 address_id
      // 再组件哪实现了
      try {
        if (address.address_id) {
          await updataAddress(address.address_id, address)
          this.$toast.success('修改成功')
        } else {
          console.log(address)

          const res = await addAddress(address)
          console.log(res)

          this.$toast.success('添加成功')
        }
        this.showEdit = false
        await this.getAddRessList()
      } catch (error) {
        console.error('保存失败：', error)
        this.$toast.fail('操作失败')
      }
    },

    onEdit (item) {
    // 找到原始地址数据
      const address = this.list.find(addr => addr.address_id === item.id)

      // 转换为编辑组件需要的格式
      this.currentAddress = {
        addressId: address.address_id,
        name: address.name,
        phone: address.phone,
        detail: address.detail,
        isDefault: address.isDefault,
        region: {
          province: address.region.province,
          city: address.region.city,
          region: address.region.region,
          // 转换ID为字符串格式的编码
          provinceCode: String(address.province_id),
          cityCode: String(address.city_id),
          regionCode: String(address.region_id)
        }
      }

      this.showEdit = true
    },
    async onDelete (id) {
      try {
        const res = await deleteAddress(id)
        console.log(res)

        this.$toast.success('删除成功')
        this.showEdit = false
        this.getAddRessList()
      } catch {
        // 取消删除
      }
    },
    async onSelect (item) {
      console.log('设置默认地址')
      console.log(item)
      // 判断是否是从订单页面转跳过来
      // if (!this.isFromOrder) return
      try {
        await setDefault(item.id)
        this.$toast('设置默认地址成功')
        this.$router.go(-1)
      } catch (error) {
        this.$toast.fail('设置默认地址失败')
      }
    }
  }
}
</script>

    <style lang="less" scoped>
    .address {
        padding-top: 46px;
        min-height: 100vh;
        background-color: #f7f7f7;

        .custom-nav {
            background-color: #fff;

            :deep(.van-nav-bar__title) {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }

            :deep(.van-icon) {
                color: #333;
            }
        }

        .custom-address-list {
            // 自定义地址列表样式
            :deep(.van-address-list__bottom) {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 0 16px 16px;
                background-color: #fff;

                .van-button {
                    width: 100%;
                    height: 40px;
                    border-radius: 20px;
                    background: linear-gradient(to right, #ff6034, #ee0a24);
                    border: none;
                    font-size: 14px;
                }
            }

            :deep(.van-address-list__item) {
                margin: 12px 12px 0;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

                .van-address-list__name {
                    font-size: 15px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .van-address-list__address {
                    font-size: 13px;
                    color: #666;
                    line-height: 1.5;
                }

                .van-tag {
                    background-color: #ee0a24;
                }

                .van-radio__icon {
                    .van-icon {
                        border-color: #ddd;
                    }

                    &--checked .van-icon {
                        background-color: #ee0a24;
                        border-color: #ee0a24;
                    }
                }
            }

            :deep(.van-address-list__disabled-text) {
                padding: 12px 16px 0;
                color: #999;
                font-size: 13px;
            }

            :deep(.van-address-list__disabled-item) {
                margin: 12px 12px 0;
                padding: 12px 16px;
                border-radius: 8px;
                background-color: #f5f5f5;

                .van-address-list__name {
                    color: #999;
                }

                .van-address-list__address {
                    color: #999;
                }
            }
        }
    }
    </style>
