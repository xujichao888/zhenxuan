<template>
	<div class="jx-tabnavbar">
		<div
			:class="['jx-tabnavbar-item', {'jx-tabnavbar-item-active': item.id === selectTab}]"
			v-for="item in tabList"
			:key="item.id"
			@click="cutTabSelect(item.id)"
		>
			{{item.name}}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		tabList: {
			required: false,
		},
		selectTab: {
			required: false,
		},
	},
  data () {
    return {
    }
	},
	methods: {
		cutTabSelect (id) {
			this.$emit('update:selectTab', id)
		},
	},
  created () {
	},
}
</script>

<style lang="scss" scope>
	.jx-tabnavbar {
		width: 100%;
		height: 88rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 35rpx 5rpx;
		box-sizing: border-box;
		&-item {
			height: 60rpx;
			font-size: 28rpx;
			text-align: center;
			color: #333333;
			line-height: 60rpx;
		}
		&-item-active {
			position: relative;
			color: #ff4365;
			&::before {
				content: '';
				width: 100%;
				height: 4rpx;
				border-radius: 2rpx;
				background-color: #ff4365;
				position: absolute;
				bottom: 0;
				left: 0;
			}
		}
	}
</style>
