import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		title: 'Svelte Chat'
	}
});

export default app;