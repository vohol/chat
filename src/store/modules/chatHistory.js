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
			let result;

			state.chatHistory.forEach((el) => {
				if (el.userId == msgItem.userId) {
					el.msgHistory.push({
						date: msgItem.date,
						msg: msgItem.msg,
						in: msgItem.in,
					});

					result = true;
				}

				if (result) return;
			});
		},
	},
	state: {
		chatHistory: [],
	},
	getters: {
		getChatHistory(state) {
			return state.chatHistory.sort((a, b) => {
				return getLastMsg(b.msgHistory).date - getLastMsg(a.msgHistory).date;
			});
		},
	},
};

function getLastMsg(msgArray) {
	return msgArray.sort((a, b) => {
		return b.date - a.date;
	})[0];
}
