
const home_onload = () => { 
    
    document.body.style.zoom = "0.8";

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/request/all_following_posts')
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onload = () => {
        if(xhr.status === 200){
            const posts = JSON.parse(xhr.responseText)

            if(!posts) return

            const posts_box = document.getElementById('posts')

            posts.forEach(post => {
                posts_box.appendChild(create_post(post))
            })  
        }
    }
    xhr.send()

}