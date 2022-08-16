<template>
	<chat-app />
</template>

<script>
import ChatApp from './components/ChatApp.vue';
import { mapActions } from 'vuex';
export default {
	components: { ChatApp },
	name: 'App',
	methods: {
		...mapActions(['fetchChatHistory']),
	},
	created() {
		this.fetchChatHistory();
	},
};
</script>

<style>
#app {
	font-family: 'Roboto', sans-serif;
	width: 100%;
}
</style>
