
const logout = () => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/logout')
    
    xhr.onload = () => {
        if(xhr.status === 200){
            location.reload()
        }
    }
    
    xhr.send()

}