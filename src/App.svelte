
<style>
	* { 
		margin: 0; padding: 0; box-sizing: border-box; 
	}
	main {
		text-align: center;
		max-width: 500px;
		margin: 0 auto;
	}
	.title {
		font-size: 2rem;
	}
	.top-text {
		line-height: 2;
	}
	form { 
		background: #000; padding:3px; position: fixed; bottom: 0; width: 100%; left: 0; 
	}
	form input {
		border: 0; padding: 10px; width: 90%;
	}
	form button {
		width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; 
	}
	#messages {
		list-style-type: none; margin: 10px; padding: 0; 
	}
	#messages li {
		padding: 10px 10px;
	}
	#messages li:nth-child(even) { 
		background: #ffa16b;
		color: black;
		border-radius: 10px;
		text-align: center;
		margin-top: 10px;
	}
	#messages li:nth-child(odd) { 
		background: #6bbcff;
		color: black;
		border-radius: 10px;
		text-align: center;
		margin-top: 10px;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<script>
	export let title
	import io from "socket.io-client"
	import config from './config.js'
	import { fade } from "svelte/transition"

	const socket = io('http://localhost:3000')
	const placeholder = "Type your message here..."
	const greeting = `You have joined the chat. Use '!name your_nickname' to set your nickname!`

	let apiKey = config.API_KEY
  	let messages = []
	let message = ""
	let name = 'Anonymous'
	let usersConnected = 0

	socket.on("user joined", function({numUsers}) {
		usersConnected = numUsers
	})
	socket.on("user left", function(numUsers) {
		usersConnected = numUsers
	})
  	socket.on("message", function(message) {		
	  messages = messages.concat(message)
		console.log(message.text)
	})
	function handleSubmit() {
		message.trim()
		if (message == '') {
			return;
		} 
		
		let messageString = `${name}: ${message}`
		//Set nickname
		if (message.slice(0, 5) == '!name') {
			let newName = message.slice(6)
			messageString = `Server: ${name} changed their nickname to ${newName}`
			if (newName == '') {
				message = ''
				return;
			}
			name = newName;
		}
		// Get Weather
		if (message.slice(0, 8) == '!weather') {
			let location = message.slice(9)
			let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
			fetch(url)
			.then(response => response.json())
			.then(data => {
				let apiLocation = data.name
				let currentWeather = data.weather[0].description
				let temperature = data.main.temp
				messageString = `The weather in ${apiLocation} is ${currentWeather}, with a temperature of ${temperature} degrees.`
				console.log(messageString)
				socket.emit('add-message', messageString)
				})
			.catch(err => {
				messageString = `${location} is an invalid location, try again.`
				console.log(err)
				socket.emit('add-message', messageString)
			})
		}
		socket.emit('add-message', messageString)
		message = ''
	}
</script>

<main>
	<h3 class='title'>{title}</h3>
	<p class='top-text'>{greeting}</p>
	<p class='top-text'>Type '!weather your-location' to check the weather!</p>
	<!-- <p class='top-text'>There {usersConnected == 1 ? 'is' : 'are'} currently {usersConnected} {usersConnected == 1 ? 'user' : 'users'} connected.</p> -->
    <ul id="messages">
		{#each messages as message}
          <li transition:fade>{message.text}</li>
        {/each}
	</ul>
    <form action="">
      <input placeholder={placeholder} id="m" autocomplete="off" bind:value={message}/>
	  <button on:click|preventDefault={handleSubmit}>Send</button>
    </form>
</main>