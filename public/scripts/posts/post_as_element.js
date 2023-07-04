


const create_post = (post) => {

    const post_img_style = 'position: relative;top: 100px;width: 420px;max-width: 420px;height: 220px;max-height: 220px;left: 20px;margin-top: 100px;'
    const description_style = 'position: relative;top: 90px;left: 25px;width: 260px;height: 100px;margin-top: 10px;overflow: auto;word-wrap: break-word;'
    const post_header_style = 'position: relative;margin-bottom: 5px;top: 190px;left: 370px'
    const like_button_style = 'position: relative;top: 540px; left: 240px; width: 50px; height: 40px; margin-top: 10px; margin-right: 10px'
    const liked_by_button_style = 'position: relative;top: 532px; left: 360px; margin-left: 10px; width: 60px; height: 40px;'

    const post_div = document.createElement('div')
    post_div.id = post.src
    
    const like_button = document.createElement('button')
    like_button.style = like_button_style
    
    like_button.textContent = post.is_liked ? 'Liked' : 'Like'
    
    like_button.onclick = () => {
        like(post.src, like_button)
    }

    const liked_by_button = document.createElement('button')
    liked_by_button.style = liked_by_button_style
    liked_by_button.textContent = 'Liked by'

    liked_by_button.onclick = () => {
        show_liked(post.src)
    }

    const post_header = document.createElement('div')

    const username = document.createElement('button')
    username.textContent = post.username
    username.style = 'position: relative;margin-bottom: 5px;top: 230px;left: 20px'
    username.onclick = () => {
        window.location.href = `/account/${post.username}`
    }

    const date = document.createElement('p')
    date.style = post_header_style
    date.textContent = new Date(post.date).toLocaleDateString('en-US');

    post_header.appendChild(username)
    post_header.appendChild(date)

    const post_image = document.createElement('img')
    post_image.style = post_img_style
    post_image.src = post.src

    

    const description = document.createElement('div')
    description.style = description_style
    description.textContent = post.description


    post_div.style.backgroundColor = 'orange'
    post_div.style = 'width:480px; height: 300px; margin-bottom: 100px'
    post_div.appendChild(liked_by_button)
    post_div.appendChild(like_button)
    post_div.appendChild(post_header)
    post_div.appendChild(post_image)
    post_div.appendChild(description)

    return post_div
}
