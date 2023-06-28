
const like = (post, like_button) => {
    console.log(post)
    const xhr = new XMLHttpRequest()
    xhr.open('post', '/request/like_post')
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onload = () => { 
        if(xhr.status === 200){
            const response = JSON.parse(xhr.responseText)
            console.log(response)
            if(response.status === 'liked'){
                like_button.textContent = 'Liked'
                console.log('LIKED')
            }else{
                like_button.textContent = 'Like'
                console.log('UNLIKED')
            }
            
        }

    }
    
    xhr.send(JSON.stringify(post))

}