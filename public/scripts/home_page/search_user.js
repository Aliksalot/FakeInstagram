
const search_for_user = () => {
    const input_field = document.getElementById('inputUsernameSearch')
    const out = document.getElementById('searchUserOutput')
    if(input_field.style.display === 'none'){
        input_field.value = ''
        input_field.style.display = 'inline-block'
        out.textContent = ''
        return
    }
        
    input_field.style.display = 'none'
    const user_tofind = input_field.value
    
    if(input_field.value === '') return

    const xhr = new XMLHttpRequest()

    xhr.open('POST', '/redirect_to_user');
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
        if(xhr.status === 200){
            const exists = xhr.responseText === 'true' ? true: false
            if(exists){
                window.location.href = '/account/' + user_tofind
            }else{
                
                out.textContent = `This account doesn't exist`
            }
        }
    }
    xhr.send(JSON.stringify({username: user_tofind}))
}