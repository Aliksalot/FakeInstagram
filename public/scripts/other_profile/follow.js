
const follow = () => { 
    const url = window.location.href
    const to_follow = url.split('/').pop()
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/request/follow')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status === 200){
            

        }
    }

    const to_send = {to_follow: to_follow}
    
    xhr.send(JSON.stringify(to_send))

}