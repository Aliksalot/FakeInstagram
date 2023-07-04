
const follow = () => { 
    const url = window.location.href
    const to_follow = url.split('/').pop()
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/request/follow')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status === 200){
            const follow_btn = document.getElementById('follow_btn')
            follow_btn.textContent = 'unfollow'
            follow_btn.onclick = unfollow
            location.reload()
        }
    }

    const to_send = {to_follow: to_follow}
    
    xhr.send(JSON.stringify(to_send))

}

const unfollow = () => {
    const url = window.location.href
    const to_unfollow = url.split('/').pop()
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/request/unfollow')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status === 200){
            const follow_btn = document.getElementById('follow_btn')
            follow_btn.textContent = 'follow'
            follow_btn.onclick = follow
        }
    }

    const to_send = {to_unfollow: to_unfollow}
    
    xhr.send(JSON.stringify(to_send))    
}