


const create_post = (post) => {

    const post_img_style = 'position: relative;top: 100px;width: 420px;max-width: 420px;height: 220px;max-height: 220px;left: 20px;margin-top: 100px;'
    const description_style = 'position: relative;top: 90px;left: 25px;width: 210px;height: 100px;margin-top: 10px;overflow: auto;word-wrap: break-word;'
    const post_header_style = 'position: relative;margin-bottom: 5px;top: 190px;left: 20px'
    const like_button_style = 'position: relative;top: 500px; left: 240px; width: 50px; height: 40px; margin-top: 10px; margin-right: 10px'
    const liked_by_button_style = 'position: relative;top: 493px; left: 360px; margin-left: 10px; width: 60px; height: 40px;'

    const post_div = document.createElement('div')
    post_div.id = post.src
    
    const like_button = document.createElement('button')
    like_button.style = like_button_style
    console.log('IS LIKED', post.is_liked)
    like_button.textContent = post.is_liked ? 'Liked' : 'Like'
    
    like_button.onclick = () => {
        like(post, like_button)
    }

    const liked_by_button = document.createElement('button')
    liked_by_button.style = liked_by_button_style
    liked_by_button.textContent = 'Liked by'

    const post_header = document.createElement('div')
    post_header.style = post_header_style
    post_header.textContent = post.username + " - " + new Date(post.date).toLocaleDateString('en-US');

    const post_image = document.createElement('img')
    post_image.style = post_img_style
    post_image.src = post.src

    console.log(`IMG SRC FOR ${post.username}: ${post_image.src}`)

    const description = document.createElement('div')
    description.style = description_style
    description.textContent = post.description

    post_div.appendChild(liked_by_button)
    post_div.appendChild(like_button)
    post_div.appendChild(post_header)
    post_div.appendChild(post_image)
    post_div.appendChild(description)

    return post_div
}
