

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

            const post_img_style = 'position: relative;top: 100px;width: 420px;max-width: 420px;height: 220px;max-height: 220px;left: 20px;margin-top: 100px;'
            const description_style = 'position: relative;top: 90px;left: 25px;width: 210px;height: 100px;margin-top: 10px;overflow: auto;word-wrap: break-word;'
            const post_header_style = 'position: relative;margin-bottom: 5px;top: 190px;left: 20px'

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
                const post_div = document.createElement('div')
                post_div.id = post.src
                
                const post_header = document.createElement('div')
                post_header.style = post_header_style
                post_header.textContent = user_data.username + " - " + new Date(post.date).toLocaleDateString('en-US');

                const post_image = document.createElement('img')
                post_image.style = post_img_style
                post_image.src = post.src

                const description = document.createElement('div')
                description.style = description_style
                description.textContent = post.description

                post_div.appendChild(post_header)
                post_div.appendChild(post_image)
                post_div.appendChild(description)

                posts_box.appendChild(post_div)
            });
            
            
        }

    }

    xhr.send()
}