<script>
import { mapGetters } from 'vuex';
import ChatMsg from './ChatMsg.vue';

export default {
	data() {
		return {
			activeChatId: '',
		};
	},
	computed: {
		...mapGetters(['getChatHistory']),
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
	},

	components: { ChatMsg },
};
</script>

<template>
	<div class="chat">
		<div class="chat__left left-prt">
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
				/>
			</div>
			<div class="left-prt__main">
				<h1 class="left-prt__title">Chats</h1>
				<div class="chat-list">
					<div
						class="chat-list__item chat-item"
						v-for="chat in getChatHistory"
						:key="chat.userId"
						@click="activeChatId = chat.userId"
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
							<p class="chat-item__msg">
								{{ getLastMsg(chat.msgHistory).msg }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<ChatMsg :chatId="activeChatId" class="chat__right" />
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

.chat-item {
	display: flex;
	padding: 15px 20px;
	width: 100%;
	border-bottom: 1px solid $border-color;

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
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	&__title {
		display: flex;
		justify-content: space-between;
	}

	&__msg {
		flex-grow: 1;
		display: flex;
		align-items: center;
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
