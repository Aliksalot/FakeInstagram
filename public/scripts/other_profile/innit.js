
const innit = () => {
    const url = window.location.href;
    const account_name = url.split('/').pop()
    console.log(`account name: ${account_name}`)  
    
    document.body.style.zoom = "0.8";

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/request/data/${account_name}`)
    xhr.onload = () => {
        if(xhr.status === 200){
            console.log('Server responded')
            const data = JSON.parse(xhr.responseText)
            if(data === false)
                return

            const username_box = document.getElementById('username')
            username_box.textContent = data.username

            const following_box = document.getElementById('following')
            following_box.textContent += data.following.length
            following_box.onclick = () => {
                show_following(data.username)
            }

            const follower_box = document.getElementById('followers')
            follower_box.textContent += data.followers.length
            follower_box.onclick = () => {
                show_followers(data.username)
            }

            const pfp_box = document.getElementById('profile_picture')
            pfp_box.src = data.pfp === undefined ? '/no_picture' : '/data/' + data.pfp

            console.log(`pfp_src ${pfp_box.src}`)

            const bio = document.getElementById('description')
            bio.textContent = data.bio = bio.textContent = data.bio === undefined ? 'Looks like you dont have a bio yet! You can set a bio from options > edit bio. ' : bio.textContent = data.bio

            const posts = data.posts
            const posts_box = document.getElementById('posts')

            posts.reverse()

            posts.forEach(post => {
                const post_div = create_post(post)
                posts_box.appendChild(post_div)
            })

            const follow_btn = document.getElementById('follow_btn')
            
            if(data.is_followed){
                follow_btn.textContent = 'Unfollow'
                follow_btn.onclick = unfollow
            }else{
                follow_btn.textContent = 'Follow'
                follow_btn.onclick = follow
            }

            console.log("DATA IS FOLLOWED", data.is_followed)

            console.log('account page loaded')
            const client_body = document.getElementById('main_body')
            client_body.style.display = 'block'

        }
        
    }
    xhr.send()
}