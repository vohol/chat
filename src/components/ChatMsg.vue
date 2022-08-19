<template>
	<div class="rght-prt rght-prt--preview" v-if="!chatId">
		<span>Select a chat to start messaging</span>
	</div>
	<div class="rght-prt" v-else>
		<div class="rght-prt__header">
			<button @click="$emit('back')" class="back-btn">
				<i class="fa fa-solid fa-chevron-left"></i>
			</button>
			<div class="avatar">
				<img
					:src="`https://i.pravatar.cc/54?img=${chatId}`"
					alt="user avatar"
					class="avatar__img"
				/>
			</div>
			<span class="rght-prt__name">{{ getNameById(id) }}</span>
		</div>
		<div class="rght-prt__body">
			<div
				class="msg-item"
				v-for="msg in getMessages.slice().sort((a, b) => a.date - b.date)"
				:key="msg.date"
				:class="{ 'msg-item--out': !msg.in }"
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
			<form class="form" @submit.prevent="sendMsg()">
				<textarea
					class="form__input"
					v-model="newMsg"
					autofocus
					@keydown.enter.exact.prevent="sendMsg()"
					@keydown.enter.shift.exact.prevent="newline"
				/>
				<p>Enter - send message; Shift + Enter - new line.</p>
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
		...mapGetters(['getMessagesById', 'getNameById']),
		getMessages() {
			return this.getMessagesById(this.id);
		},
	},
	methods: {
		...mapMutations(['addNewMsg', 'readNewMessages']),
		newline() {
			this.newMsg = `${this.newMsg}\n`;
		},
		setNewMsg(value, id, isIn, isNew) {
			this.addNewMsg({
				date: Date.now(),
				msg: value,
				in: isIn,
				userId: id,
				new: isNew,
			});
		},
		async sendMsg() {
			if (this.newMsg.trim()) {
				this.setNewMsg(this.newMsg.trim(), this.chatId, false, false);
				this.newMsg = '';
				const msg = await this.fetchChuckJoke();
				const tempId = this.chatId;

				setTimeout(() => {
					this.setNewMsg(msg, tempId, true, true);
				}, 10000);
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
		goBack() {
			this.$emit('goBack');
		},
	},
	updated() {
		if (this.chatId) {
			this.scrollToBot();
			document.querySelector('.form__input').focus();
		}
	},
	watch: {
		chatId: {
			immediate: true,
			handler(newVal) {
				this.readNewMessages(this.chatId);
				this.id = newVal;
			},
		},
	},
};
</script>

<style lang="scss">
.back-btn {
	display: none;
}

@media screen and (max-width: 760px) {
	.back-btn {
		display: block;
		padding: 10px 14px;
		background: $border-color;
		border-radius: 10px;
		margin-right: 5px;

		& .fa {
			font-size: 30px;
			color: $dark-back;
		}
	}
}

.form {
	display: flex;
	height: 62px;
	border-radius: 20px;
	position: relative;

	p {
		position: absolute;
		bottom: -18px;
		font-size: 10px;
		color: gray;
		margin-left: 15px;
	}

	&__input {
		border-radius: 20px 0 0 20px;
		flex: 92%;
		padding: 0 20px;
		border-top: 10px solid white;
		border-bottom: 10px solid white;
		padding-right: 0;
		font-size: 14px;
		resize: none;
	}

	&__btn {
		flex: 8%;
		border-radius: 0 20px 20px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 12px;
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
			font-size: 16px;

			display: block;
			padding: 12px 25px;
			border-radius: 50px;
			background: $dark-back;
			color: white;
			margin: 0 auto;
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
	justify-content: flex-start;

	&__img {
		margin-right: 12px;
		min-width: 54px;
	}

	&__msg {
		padding: 12px 16px;
		min-height: 54px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		font-size: 14px;
		line-height: 1.4;

		border-radius: 20px;
		background: $dark-back;
		color: white;
	}

	&__date {
		color: gray;
		font-size: 12px;
		margin-left: 16px;
	}

	&--out {
		justify-content: flex-end;
	}
	&--out &__body {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	&--out &__date {
		text-align: right;
		margin-left: 0;
		margin-right: 16px;
	}

	&--out &__msg {
		background: $border-color;
		color: black;
		text-align: right;
		justify-content: flex-end;
	}
}
</style>
