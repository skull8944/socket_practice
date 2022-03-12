const socket  = io();

const scrollToBotton = () => {
    var messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

socket.on('connect', () => {    
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit('join', params, (err) => {
        if(err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('no error');
        }
    });
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});

socket.on('updateUsersList', (users) => {
    let ol = document.createElement('ol');
  
    users.forEach(function (user) {
      let li = document.createElement('li');
      li.innerHTML = user;
      ol.appendChild(li);
    });
  
    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ol);
});

socket.on('newMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    const div = document.createElement('div');

    div.innerHTML = html
    document.querySelector('#messages').appendChild(div);
    scrollToBotton();

    // console.log("newMessage", message);
    // var li = document.createElement('li');
    // li.innerText = `${message.from} ${formattedTime}: ${message.text}`;

    // document.querySelector('body').appendChild(li);
});

socket.on('newLocationMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#location-message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    const div = document.createElement('div');

    div.innerHTML = html
    document.querySelector('#messages').appendChild(div);

    // console.log("newLocationMessage", message);
    // var li = document.createElement('li');
    // var a = document.createElement('a');
    // a.setAttribute('target', '_blank');
    // a.setAttribute('href', message.url);
    // a.innerText = 'My Current Location'
    // li.innerText = `${message.from} ${formattedTime}: `;
    // li.appendChild(a);

    // document.querySelector('body').appendChild(li);
});

document.querySelector('#submit-btn').addEventListener(
    'click', (e) => {
        e.preventDefault();
        if(document.querySelector('input[name="message"]').value != '') {
            socket.emit('createMessage', {
                text: document.querySelector('input[name="message"]').value
            });
            document.querySelector('input[name="message"]').value = '';
        }
    }
)

document.querySelector('#send-location').addEventListener(
    'click', (e) => {
        if(!navigator.geolocation) {
            return alert('Geolocation is not supported buy your browser.');
        }
        
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('createLocationMessage', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, () => {
            alert('Unable to fetch location');
        })
    }
)