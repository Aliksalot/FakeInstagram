
const show_following = (account) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/request/following')
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onload = () => {
        if(xhr.status === 200){
            const list = JSON.parse(xhr.responseText)
  
            while(document.getElementById('pop_up') !== null){
                document.body.removeChild(document.getElementById('pop_up'))
            }

            const pop_up = document.createElement('div')
            pop_up.style = 'position: fixed; left: 120px; top: 100px; width: 240px; height: 400px; background-color: lightgray; z-index: 9999; overflow: auto;'
            const users_box = document.createElement('div')
            users_box.style = 'margin-left: 10px; margin-top: 10px; height: 350px; width: 220px; overflow: auto; white-space: pre-line; background-color: gray'
            users_box.style.whiteSpace = 'pre-line'
        
            list.forEach(user => {
        
                const field = document.createElement('div')
        
                field.style = 'margin-left: 10px; margin-top: 10px;'
                field.style.whiteSpace = 'pre-line'
                const user_btn = document.createElement('button')
        
                user_btn.style = 'position: relative; width: 50px; height: 50px'
                user_btn.style.cursor = 'pointer'
                user_btn.style.backgroundImage = user.pfp === undefined ? `url(/no_picture)` : `url(/data/${user.pfp})`
                user_btn.style.backgroundRepeat = 'no-repeat'
                user_btn.style.backgroundSize = 'cover'
        
                user_btn.onclick = () => {
                    window.location.href = '/account/' + user.username
                }
        
                const username_box = document.createElement('div')
                username_box.style = 'position: relative; margin-left: 60px; top:35px'
                username_box.textContent = user.username
        
                field.appendChild(username_box)
                field.appendChild(user_btn)
        
                users_box.appendChild(field)    
            });
        
            pop_up.appendChild(users_box)
        
            const close_btn = document.createElement('button')
            close_btn.style = 'width: 20px; height: 20px; margin-top: 10px; margin-left: 10px'
            close_btn.style.cursor = 'pointer'
            close_btn.style.backgroundImage = `url(/close_button)`
            close_btn.style.backgroundRepeat = 'no-repeat'
            close_btn.style.backgroundSize = 'cover'
            close_btn.onclick = () => {
                document.body.removeChild(document.getElementById('pop_up'))           
            }
            pop_up.id = 'pop_up'
            pop_up.appendChild(close_btn)
            document.body.appendChild(pop_up)
        }
    }

    xhr.send(JSON.stringify({username: account}))

}
