import { createStore } from 'vuex';
import chatHistory from './modules/chatHistory';

const store = createStore({
	modules: {
		chatHistory,
	},
});

export default store;
