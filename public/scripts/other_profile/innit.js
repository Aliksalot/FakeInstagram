
const innit = () => {
    const url = window.location.href;
    const account_name = url.split('/').pop()
    console.log(`account name: ${account_name}`)  
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/request/data/${account_name}`)
    xhr.onload = () => {
        if(xhr.status === 200){
            console.log('Server responded')
            const data = JSON.parse(xhr.responseText)
            if(data === false)
                return
            const post_img_style = 'position: relative;top: 100px;width: 420px;max-width: 420px;height: 220px;max-height: 220px;left: 20px;margin-top: 100px;'
            const description_style = 'position: relative;top: 90px;left: 25px;width: 210px;height: 100px;margin-top: 10px;overflow: auto;word-wrap: break-word;'
            const post_header_style = 'position: relative;margin-bottom: 5px;top: 190px;left: 20px'

            const username_box = document.getElementById('username')
            username_box.textContent = data.username

            const pfp_box = document.getElementById('profile_picture')
            pfp_box.src = data.pfp === undefined ? '/no_picture' : '/data/' + data.pfp

            console.log(`pfp_src ${pfp_box.src}`)

            const bio = document.getElementById('description')
            bio.textContent = data.bio = bio.textContent = data.bio === undefined ? 'Looks like you dont have a bio yet! You can set a bio from options > edit bio. ' : bio.textContent = data.bio

            const posts = data.posts
            const posts_box = document.getElementById('posts')

            posts.reverse()

            posts.forEach(post => {
                const post_div = document.createElement('div')
                post_div.id = post.src
                
                const post_header = document.createElement('div')
                post_header.style = post_header_style
                post_header.textContent = data.username + " - " + new Date(post.date).toLocaleDateString('en-US');

                const post_image = document.createElement('img')
                post_image.style = post_img_style
                post_image.src = '/data/' + post.src
                console.log('POST IMAGE: ', post_image.src)

                const description = document.createElement('div')
                description.style = description_style
                description.textContent = post.description

                post_div.appendChild(post_header)
                post_div.appendChild(post_image)
                post_div.appendChild(description)

                posts_box.appendChild(post_div)
            })

            console.log('account page loaded')
            const client_body = document.getElementById('main_body')
            client_body.style.display = 'block'    

        }
        
    }
    xhr.send()
}