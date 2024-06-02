import './style.css'
import { home } from './Pages/Home'

document.querySelector('#app').innerHTML = home();

document.getElementById('send-button').addEventListener('click', sendMessage);
document.querySelectorAll('.bot-button').forEach(button => {
  button.addEventListener('click', () => {
      selectBot(button.dataset.bot);
  });
});

let selectedBot = null;

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');

const bots = {
    Siri: {
        avatar: 'img/Siri.jpg',
        hello: () => 'Hello, all the bots welcome you',
        help: () => 'Help: here is the list of commands\nhello: have all the bots welcome you\njoke: tells you a random joke\napple: tells if Apple is better than android',
        joke: async () => `${await getJoke()}`,
        apple: () => 'Apple is better than Android'
    },
    okGoogle: {
        avatar: 'img/google-home-logo.jpg',
        hello: () => 'Hello, all the bots welcome you',
        bitcoin: async () => `Bitcoin is worth: ${await getBitcoinValue()}$`,
        android: () => 'Android is better than Apple'
    },
    Sam: {
        avatar: 'img/Sam-Logo.jpg',
        hello: () => 'Hello, all the bots welcome you',
        weather: async (args) => `Temperature in ${args} is ${await getWeather(args)} °C`,
        chuck: () => 'Chuck Norris can divide by zero.'
    }
};

function selectBot(botName) {
    selectedBot = botName;
     document.querySelectorAll('.bot-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.bot-button[data-bot="${botName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

async function sendMessage() {
    if (!selectedBot) {
        alert('Please select a bot first');
        return;
    }

    const message = userInput.value;
    userInput.value = '';

    const [command, ...args] = message.split(' ');

    if (bots[selectedBot][command]) {
        const response = await bots[selectedBot][command](args);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        displayMessage('user', message, time);
        displayMessage(selectedBot, response, bots[selectedBot].avatar, time);
    } else {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        displayMessage('user', message, time);
        displayMessage(selectedBot, 'Command not recognized', bots[selectedBot].avatar, time);
    }
}

function getWeather(town){
    return $.ajax({
        method: 'GET',
        url: `http://api.weatherapi.com/v1/current.json?key=c95dfbe187544f1a940130207240206&q=${town}&aqi=no`,
        contentType: 'application/json'
    }).then(result => {
        console.log(result);
            return result.current.temp_c;
    }).catch(jqXHR => {
        console.error('Error: ', jqXHR.responseText);
        return 'Error fetching joke';
    });
}

function getJoke() {
    return $.ajax({
        method: 'GET',
        url: 'https://v2.jokeapi.dev/joke/Any',
        contentType: 'application/json'
    }).then(result => {
        if (result.type == "single") {
            return result.joke;
        } else {
            return `${result.setup} ${result.delivery}`;
        }
    }).catch(jqXHR => {
        console.error('Error: ', jqXHR.responseText);
        return 'Error fetching joke';
    });
}

function getBitcoinValue() {
    var symbol = 'BTCUSDT';
    return $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/cryptoprice?symbol=' + symbol,
        headers: { 'X-Api-Key': 'XWZfnA+vRyJFS25Kb6D4gQ==MLHGc3eypPvBeeDm'},
        contentType: 'application/json'
    }).then(result => {
        return result.price;
    }).catch(jqXHR => {
        console.error('Error: ', jqXHR.responseText);
        return 'Error fetching Bitcoin value';
    });
}

function displayMessage(sender, message, avatar = null, time) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
    if (sender === 'user') {
        messageElement.innerHTML = `${message}`;
    } else {
        messageElement.innerHTML = `<img src="${avatar}" alt="${sender} avatar" class="avatar"> <b>${sender}:</b> ${message}</br> <span class="timestamp">${time}</span>`;
    }
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    saveMessageToLocalStorage(sender, message, avatar, time);
}

function saveMessageToLocalStorage(sender, message, avatar, time) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ avatar, sender, message, time });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = msg.sender === 'user' ? 'user-message' : 'bot-message';
        if (msg.sender === 'user'){
            messageElement.innerHTML = `${msg.message}`;
        }else{
            messageElement.innerHTML = `<img src="${msg.avatar}" alt="${msg.sender} avatar" class="avatar"><b>${msg.sender}:</b> ${msg.message}</br> <span class="timestamp">${msg.time}</span>`;
        }
        chatWindow.appendChild(messageElement);
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

window.onload = loadChatHistory;

