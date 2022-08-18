import defaultChatHistory from '@/assets/data';

export default {
	actions: {
		fetchChatHistory(ctx) {
			let newChatHistory;

			localStorage.getItem('history')
				? (newChatHistory = JSON.parse(localStorage.getItem('history')))
				: (newChatHistory = defaultChatHistory);

			ctx.commit('updateChatHistory', newChatHistory);
		},
	},
	mutations: {
		updateChatHistory(state, chatHistory) {
			state.chatHistory = chatHistory;
		},
		addNewMsg(state, msgItem) {
			state.chatHistory.forEach((el) => {
				if (el.userId == msgItem.userId) {
					el.msgHistory.push({
						date: msgItem.date,
						msg: msgItem.msg,
						in: msgItem.in,
						new: msgItem.new,
					});

					return;
				}
			});

			localStorage.setItem('history', JSON.stringify(state.chatHistory));
		},
		readNewMessages(state, id) {
			state.chatHistory.forEach((el) => {
				if (el.userId == id) {
					el.msgHistory.map((el) => (el.new = false));

					return;
				}
			});

			localStorage.setItem('history', JSON.stringify(state.chatHistory));
		},
	},
	state: {
		chatHistory: [],
	},
	getters: {
		getMessagesById: (state) => (id) => {
			return state.chatHistory.filter((el) => el.userId == id)[0].msgHistory;
		},
		getChatHistory(state) {
			return state.chatHistory.sort((a, b) => {
				return getLastMsg(b.msgHistory).date - getLastMsg(a.msgHistory).date;
			});
		},
		getNameById: (state) => (id) => {
			return state.chatHistory.filter((el) => el.userId == id)[0].name;
		},
	},
};

function getLastMsg(msgArray) {
	return msgArray.sort((a, b) => {
		return b.date - a.date;
	})[0];
}
