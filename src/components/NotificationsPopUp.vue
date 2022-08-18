<template>
	<div class="pop-up">
		<div
			v-for="item in getNewMessages"
			:key="item.date"
			class="notif-item"
			@click="
				callBackUserId = item.userId;
				openChat();
			"
		>
			<div class="notif-item__title">
				<span class="notif-item__span"
					>New message from
					<span class="notif-item__span--bold">{{ item.name }}</span></span
				>
				<button class="notif-item__btn" @click.stop="closeItem">
					<i class="fas fa-times"></i>
				</button>
			</div>
			<p class="notif-item__msg">{{ item.msg }}</p>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			startTime: 0,
			callBackUserId: '',
		};
	},
	computed: {
		...mapGetters(['getChatHistory']),
		getNewMessages() {
			// return this.newMessages();
			//to do: need back this shit
			return this.newMessages().filter((el) => el.date >= this.startTime);
		},
	},
	methods: {
		newMessages() {
			let messages = [];

			this.getChatHistory.forEach((element) => {
				element.msgHistory.forEach((el) => {
					if (el.new)
						messages.push({
							...el,
							userId: element.userId,
							name: element.name,
						});
				});
			});

			return messages;
		},
		closeItem(e) {
			e.target.closest('.notif-item').remove();
		},
		openChat() {
			this.$emit('openChat', this.callBackUserId);
		},
	},
	mounted() {
		this.startTime = Date.now();
	},
};
</script>

<style lang="scss">
.pop-up {
	position: absolute;
	top: 4px;
	right: 4px;
	z-index: 10;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.notif-item {
	padding: 15px 15px;
	max-width: 400px;
	max-height: 100px;
	background: $dark-back;
	border-radius: 8px;
	color: white;
	cursor: pointer;

	&__title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	&__span {
		font-size: 14px;

		&--bold {
			font-weight: 500;
		}
	}

	&__btn {
		background: transparent;
		padding: 4px;
	}

	.fas {
		color: white;
		font-size: 16px;
	}

	&__msg {
		font-size: 13px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		padding-right: 20px;
	}
}
</style>
