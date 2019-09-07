
let form = document.querySelector('form')
let search = document.querySelector('input')
let msg1 = document.querySelector('#message-1')
let msg2 = document.querySelector('#message-2')

form.addEventListener('submit', (event) => {
  event.preventDefault()

  fetch('/weather?address=' + search.value).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        msg1.textContent = data.error
        msg2.textContent = ''
      } else {
        msg1.textContent = data.location
        msg2.textContent = data.forecast
      }

      console.log('done')
    })
  })
  console.log('fetching')
})
