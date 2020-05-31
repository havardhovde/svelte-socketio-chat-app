# Svelte Chap App

Simple chat app built using Svelte and Socket.io. Also includes weather functionality using the OpenWeatherMap API.

To run locally:
1. Clone/download repository
2. Get an API-key from [OpenWeatherMap](https://openweathermap.org/api)
3. In the src folder, create a file named config.js
4. Add the following to config.js
```javascript
let config = {
    API_KEY : 'add your API key here'
}

export default config
```
5. Start the app with
```bash
npm run dev
```

Once running type !name 'your name' to set your name, and !weather 'location' to get the weather.