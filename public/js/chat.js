

const socket = io()

//Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//tamplates
const messageTemplate = document.querySelector('#message-template').innerHTML
const linkTemplate = document.querySelector("#link-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoScroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHighet = $messages.scrollHeight


    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHighet - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    // $username.innerHTML = message.username
    $messages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)

    const html = Mustache.render(linkTemplate, {
        username: message.username,
        link: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
$messageForm.addEventListener('submit', (e) => {

    e.preventDefault()
    //disable form
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {

        //enable form
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('The message was delivered!')
    })

    //
    //console.log('Message have been sent')
})


$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log({ lat: position.coords.latitude, long: position.coords.longitude })
        $sendLocationButton.setAttribute('disabled', 'disabled')
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })

})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room, users
    })
    document.querySelector("#sidebar").innerHTML = html
})