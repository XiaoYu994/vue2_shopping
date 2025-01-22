<template>
  <div class="address-edit">
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      :style="{ height: '100%' }"
      :close-on-click-overlay="false"
    >
      <van-nav-bar
        :title="address.address_id ? '编辑地址' : '新增地址'"
        left-arrow
        @click-left="onClose"
      />

      <van-address-edit
        :address-info="addressInfo"
        :area-list="areaList"
        show-delete
        :area-columns-placeholder="['请选择省', '请选择市', '请选择区']"
        @save="onSave"
        @delete="onDelete"
        @change-area="onChangeArea"
      />
    </van-popup>
  </div>
</template>

<script>
import { areaList } from '@vant/area-data'
import { getRegionTree } from '@/api/address'
export default {
  name: 'AddressEdit',
  props: {
    value: Boolean,
    address: {
      type: Object,
      default: () => ({
      })
    }
  },
  data () {
    return {
      areaList,
      areaList2: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      selectedArea: {
        province: '',
        city: '',
        region: '',
        provinceCode: '',
        cityCode: '',
        regionCode: ''
      }
    }
  },
  computed: {
    addressInfo () {
      const { addressId, name, phone, detail, isDefault } = this.address
      return {
        id: addressId,
        name,
        tel: phone,
        addressDetail: detail,
        isDefault: isDefault === 1,
        province: this.address.region?.province,
        city: this.address.region?.city,
        county: this.address.region?.region,
        areaCode: this.address.region?.regionCode || ''
      }
    }
  },
  async created () {
    await this.getAreaList()
  },
  methods: {
  // 获取地区数据并转换
    async getAreaList () {
      try {
        const { data: { list } } = await getRegionTree()

        // 处理省份数据
        Object.values(list).forEach(province => {
        // 直接使用 ID
          this.areaList2.province_list[province.id] = province.name

          // 处理城市数据
          if (province.city) {
            Object.values(province.city).forEach(city => {
            // 直接使用 ID
              this.areaList2.city_list[city.id] = city.name

              // 处理区域数据
              if (city.region) {
                Object.values(city.region).forEach(region => {
                // 直接使用 ID
                  this.areaList2.county_list[region.id] = region.name
                })
              }
            })
          }
        })

        console.log('转换后的地区数据：', this.areaList2)
      } catch (error) {
        console.error('获取地区数据失败：', error)
        this.$toast.fail('获取地区数据失败')
      }
    },
    onChangeArea (values, index) {
      console.log('选择的地区值：', values)
      console.log(this.areaList2)

      if (values && values.length === 3) {
        const province = values[0].name
        const city = values[1].name
        const region = values[2].name
        // 查找对应的编码
        const provinceCode = Object.entries(this.areaList2.province_list)
          .find(([_, name]) => name === province)?.[0]
        const cityCode = Object.entries(this.areaList2.city_list)
          .find(([_, name]) => name === city)?.[0]
        const regionCode = Object.entries(this.areaList2.county_list)
          .find(([_, name]) => name === region)?.[0]

        console.log('解析的编码：', {
          provinceCode,
          cityCode,
          regionCode
        })

        this.selectedArea = {
          province,
          city,
          region,
          provinceCode,
          cityCode,
          regionCode
        }

        console.log('更新后的 selectedArea：', this.selectedArea)
      }
    },

    onSave (content) {
      console.log('保存时的数据：', content)

      // 优先使用 selectedArea 中的数据，如果没有则使用编辑时的数据

      const areaData = this.selectedArea.provinceCode
        ? this.selectedArea
        : {
            province: content.province,
            city: content.city,
            region: content.county,
            provinceCode: this.address.region?.provinceCode,
            cityCode: this.address.region?.cityCode,
            regionCode: this.address.region?.regionCode
          }

      // 检查是否有地区数据
      if (!areaData.provinceCode || !areaData.cityCode || !areaData.regionCode) {
        this.$toast('请选择省市区')
        return
      }

      const saveData = {
        name: content.name,
        phone: content.tel,
        detail: content.addressDetail,
        region: [
          {
            value: parseInt(areaData.provinceCode),
            label: areaData.province
          },
          {
            value: parseInt(areaData.cityCode),
            label: areaData.city
          },
          {
            value: parseInt(areaData.regionCode),
            label: areaData.region
          }
        ]
      }
      // 如果是编辑，添加 address_id
      if (content.id) {
        saveData.address_id = content.id
      }

      console.log('发送到后端的数据：', saveData)

      this.$emit('save', saveData)
    },
    onClose () {
      this.$dialog.confirm({
        title: '提示',
        message: '确认放弃编辑吗？',
        confirmButtonText: '确认',
        cancelButtonText: '继续编辑'
      }).then(() => {
        this.$emit('input', false)
      }).catch(() => {})
    },

    onDelete () {
      this.$emit('delete', this.address.addressId)
    }
  }
}
</script>

<style lang="less" scoped>
.address-edit {
  :deep(.van-popup) {
    background: #f7f7f7;
  }

  :deep(.van-address-edit) {
    padding: 12px;

    &__fields {
      border-radius: 8px;
      margin-bottom: 12px;
    }

    &__buttons {
      padding: 0 16px 16px;

      .van-button {
        border-radius: 20px;
        height: 40px;

        &--danger {
          background: linear-gradient(to right, #ff6034, #ee0a24);
          border: none;
        }
      }
    }
  }
}
</style>
