
const onload = () => { 

    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/request_owner_data')
    xhr.setRequestHeader('Content-Type', 'application/json')
    
    xhr.onload = () => {

        if(xhr.status === 200){
            const user_data = JSON.parse(xhr.responseText)
            console.log(user_data)
            console.log(`bio ${user_data.bio}`)
            console.log(`pfp ${user_data.pfp}`)

            const username_box = document.getElementById('username')
            username_box.textContent = user_data.username

            const pfp_box = document.getElementById('profile_picture')
            pfp_box.src = user_data.pfp === undefined ? '/no_picture' : user_data.pfp

            console.log(`pfp_src ${pfp_box.src}`)

            const bio = document.getElementById('description')
            bio.textContent = user_data.bio = bio.textContent = user_data.bio === undefined ? 'Looks like you dont have a bio yet! You can set a bio from options > edit bio. ' : bio.textContent = user_data.bio

            const posts = user_data.posts
            const posts_box = document.getElementById('posts')

            posts.reverse()

            posts.forEach(post => {
                posts_box.appendChild(create_post(post))
            });
            
            console.log('home page loaded')
            const client_body = document.getElementById('main_body')
            client_body.style.display = 'block'            
            
            
        }

    }

    xhr.send()
}