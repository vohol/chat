<template>
	<div class="rght-prt rght-prt--preview" v-if="!chatId">
		<span>Select a chat to start messaging</span>
	</div>
	<div class="rght-prt" v-else>
		<div class="rght-prt__header">
			<div class="avatar">
				<img
					:src="`https://i.pravatar.cc/54?img=${chatId}`"
					alt="user avatar"
					class="avatar__img"
				/>
			</div>
			<span class="rght-prt__name"></span>
		</div>
		<div class="rght-prt__body">
			<div
				class="msg-item"
				v-for="msg in getMessages.slice().sort((a, b) => a.date - b.date)"
				:key="msg.date"
				:class="{ 'msg-item--in': msg.in }"
			>
				<div class="avatar msg-item__img" v-if="msg.in">
					<img
						:src="`https://i.pravatar.cc/54?img=${chatId}`"
						alt="user avatar"
						class="avatar__img"
					/>
				</div>
				<div class="msg-item__body">
					<p class="msg-item__msg">{{ msg.msg }}</p>
					<p class="msg-item__date">{{ dateConverter(msg.date) }}</p>
				</div>
			</div>
		</div>
		<div class="rght-prt__footer">
			<form class="form" @submit.prevent="sendMsg()" @keydown.enter="sendMsg()">
				<textarea class="form__input" v-model="newMsg" autofocus />
				<button type="submit" class="form__btn">
					<i class="fa fa-solid fa-paper-plane form__icon"></i>
				</button>
			</form>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	props: ['chatId'],
	data() {
		return {
			newMsg: '',
			id: '',
		};
	},
	computed: {
		...mapGetters(['getMessagesById']),
		getMessages() {
			return this.getMessagesById(this.id);
		},
	},
	methods: {
		...mapMutations(['addNewMsg']),
		setNewMsg(value, id, isIn) {
			this.addNewMsg({ date: Date.now(), msg: value, in: isIn, userId: id });
		},
		async sendMsg() {
			if (this.newMsg.trim()) {
				this.setNewMsg(this.newMsg.trim(), this.chatId, false);
				this.newMsg = '';
				const msg = await this.fetchChuckJoke();
				this.setNewMsg(msg, this.chatId, true);
			}
		},
		dateConverter(milliseconds) {
			let d = new Date(milliseconds);

			return d
				.toLocaleString()
				.replace(/(\d+):(\d+):(\d+)/, '$1:$2')
				.replace(/(\d{4})/, (el) => {
					return el.slice(2);
				});
		},
		scrollToBot() {
			let msgBody = document.querySelector('.rght-prt__body');

			msgBody.scrollTop = msgBody.scrollHeight;
		},
		async fetchChuckJoke() {
			const res = await fetch('https://api.chucknorris.io/jokes/random');
			const data = await res.json();
			return await data.value;
		},
	},
	updated() {
		this.scrollToBot();
		document.querySelector('.form__input').focus();
	},
	watch: {
		chatId: {
			immediate: true,
			handler(newVal) {
				this.id = newVal;
			},
		},
	},
};
</script>

<style lang="scss">
.form {
	display: flex;
	height: 62px;
	border-radius: 50px;

	&__input {
		border-radius: 50px 0 0 50px;
		flex: 92%;
		padding: 10px 20px;
		padding-right: 0;
		font-size: 14px;
		resize: none;
		display: flex;
	}

	&__btn {
		flex: 8%;
		border-radius: 0 50px 50px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-right: 10px;
		background: white;
	}

	&__btn:hover &__icon {
		color: $dark-back;
		transition: color 0.2s;
	}

	&__icon {
		font-size: 28px;
		color: gray;
	}
}

.rght-prt {
	width: 100%;
	display: flex;
	flex-direction: column;

	&--preview {
		display: flex;
		align-items: center;
		justify-content: center;

		span {
			font-weight: 400px;
			font-size: 28px;

			display: block;
			padding: 15px 30px;
			border-radius: 50px;
			background: $dark-back;
			color: white;
		}
	}

	&__header {
		padding: 18px 20px;
		display: flex;
		align-items: center;
		gap: 20px;
		border-bottom: 1px solid $border-color;
		background: $background;
	}

	&__body {
		flex-grow: 1;
		padding: 20px;
		overflow: auto;
	}

	&__name {
		font-weight: 400;
		font-size: 20px;
	}

	&__footer {
		padding: 30px 20px;
		border-top: 1px solid $border-color;
		background: $background;
	}
}

.msg-item {
	display: flex;
	margin-bottom: 20px;
	justify-content: flex-end;

	&--in {
		justify-content: flex-start;
	}

	&__img {
		margin-right: 12px;
	}

	&__msg {
		padding: 12px 16px;
		min-height: 54px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		font-size: 16px;

		border-radius: 50px;
		background: $dark-back;
		color: white;
	}

	&__date {
		color: gray;
		font-size: 12px;
	}
}
</style>
