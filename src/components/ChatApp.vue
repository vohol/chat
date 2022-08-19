<script>
import { mapGetters } from 'vuex';
import ChatMsg from './ChatMsg.vue';
import NotificationsPopUp from './NotificationsPopUp.vue';

export default {
	data() {
		return {
			activeChatId: '',
			searchRequest: '',
		};
	},
	computed: {
		...mapGetters(['getChatHistory']),
		getFilteredChatHistory() {
			if (this.searchRequest.trim().length >= 2) {
				let regExp = new RegExp(this.searchRequest.trim(), 'gi');

				return this.getChatHistory.filter((el) => regExp.test(el.name));
			} else {
				return this.getChatHistory;
			}
		},
	},
	methods: {
		timeConverter(milliseconds) {
			const date = new Date(milliseconds);
			return date
				.toDateString()
				.replace(/^\w+/, '')
				.replace(/(\d{2})/, '$1, ');
		},
		getLastMsg(msgArray) {
			return msgArray.sort((a, b) => {
				return b.date - a.date;
			})[0];
		},
		changeId(id) {
			this.activeChatId = id;
		},
	},

	components: { ChatMsg, NotificationsPopUp },
};
</script>

<template>
	<div class="chat">
		<div class="chat__left left-prt" :class="{ visible: !activeChatId }">
			<div class="left-prt__header">
				<div class="avatar left-prt__avatar">
					<img
						src="https://i.pravatar.cc/54?img=67"
						alt="user avatar"
						class="avatar__img"
					/>
				</div>
				<input
					type="search"
					name="search"
					id="search"
					class="left-prt__search"
					placeholder="Search to start new chat"
					v-model="searchRequest"
				/>
			</div>
			<div class="left-prt__main">
				<h1 class="left-prt__title">Chats</h1>
				<div class="chat-list">
					<div
						class="chat-list__item chat-item"
						v-for="chat in getFilteredChatHistory"
						:key="chat.userId"
						@click="
							activeChatId = chat.userId;
							searchRequest = '';
						"
						:class="{ 'chat-item--active': chat.userId == activeChatId }"
					>
						<div class="chat-item__img avatar">
							<img
								:src="`https://i.pravatar.cc/54?img=${chat.userId}`"
								alt="user avatar"
								class="avatar__img"
							/>
						</div>
						<div class="chat-item__body">
							<div class="chat-item__title">
								<span class="chat-item__name">{{ chat.name }}</span>
								<span class="chat-item__date">
									{{ timeConverter(getLastMsg(chat.msgHistory).date) }}
								</span>
							</div>
							<div class="chat-item__subtitle">
								<p class="chat-item__msg">
									{{ getLastMsg(chat.msgHistory).msg }}
								</p>
								<span
									class="chat-item__new-counter"
									v-show="chat.msgHistory.filter((el) => el.new).length"
									>{{ chat.msgHistory.filter((el) => el.new).length }}</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<ChatMsg
			:chatId="activeChatId"
			class="chat__right"
			:class="{ visible: activeChatId }"
			@back="activeChatId = ''"
		/>
		<NotificationsPopUp
			@openChat="changeId($event)"
			:activeChatId="activeChatId"
		/>
	</div>
</template>

<style lang="scss">
.avatar {
	width: 54px;
	height: 54px;
	border-radius: 50%;

	&__img {
		border-radius: 50%;
		width: 100%;
		object-fit: fill;
	}
}

.chat {
	height: 100vh;
	width: 100%;
	display: flex;
}

.left-prt {
	max-width: 400px;
	width: 100%;
	display: flex;
	flex-direction: column;
	border-right: 1px solid $border-color;

	&__header {
		padding: 20px;
		background: $background;
		border-bottom: 1px solid $border-color;
	}

	&__avatar {
		margin-bottom: 40px;
	}

	&__search {
		width: 100%;
		height: 35px;
		border-radius: 50px;
		border: 1px solid $border-color;
		padding: 0 15px;
		display: flex;
		align-items: center;
	}

	&__main {
		flex-grow: 1;
		overflow: auto;
	}

	&__title {
		font-size: 25px;
		display: block;
		padding: 35px 20px;
		color: #53a2c3;
		font-weight: 500;
	}
}

@media screen and (max-width: 760px) {
	.chat {
		display: block;

		.chat__left {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			max-width: 100%;
			width: 100%;
			transform: translateX(-100%);
			transition: all 0.3s;
			z-index: 2;
			background: white;
		}

		.chat__right {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			max-width: 100%;
			width: 100%;
		}

		.visible {
			transform: translateX(0);
		}
	}
}

.chat-item {
	display: flex;
	padding: 15px 20px;
	width: 100%;
	border-bottom: 1px solid $border-color;
	max-height: 85px;

	&:hover {
		cursor: pointer;
		background: $background;
	}

	&--active {
		background: $background;
	}

	&__img {
		margin-right: 12px;
	}

	&__body {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	&__title {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	&__subtitle {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__new-counter {
		background: $dark-back;
		min-width: 20px;
		height: 20px;
		border-radius: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 12px;
		font-weight: 400;
		margin-left: 10px;
	}

	&__msg {
		display: flex;
		align-items: center;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	&__name {
		font-size: 16px;
		font-weight: 500;
	}

	&__msg,
	&__date {
		font-size: 14px;
		font-weight: 400;
		color: gray;
	}
}
</style>
