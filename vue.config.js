const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: process.env.NODE_ENV === 'production' ? '/chat/' : '/',
	css: {
		loaderOptions: {
			sass: {
				additionalData: `
				@import "@/assets/scss/_nullstyle.scss";
        @import "@/assets/scss/_variables.scss";
        `,
			},
		},
	},
});
