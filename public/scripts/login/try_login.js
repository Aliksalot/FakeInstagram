
const clearFields = () => {
    document.getElementById('passwordField').value = ''
    document.getElementById('usernameField').value = ''
}


const try_login = () => {

    const output_messages = {
        gettingResultFail : 'Couldnt connect to server! ',
        wrongInformation : 'Invalid Username or Password! ',
        loginSuccess : 'Succesfully logged in'
    }

    const resultOutputField = document.getElementById('resultOutput')

    const passwordField = document.getElementById('passwordField')
    const usernameField = document.getElementById('usernameField')

    const password = passwordField.value
    const username = usernameField.value

    if(password === undefined || username === undefined){
        clearFields()
        return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/login_attempt')
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if(xhr.status === 200){
            if(xhr.responseText === 'false'){
                resultOutputField.textContent = output_messages.wrongInformation
                clearFields()
            }else{
                resultOutputField.textContent = output_messages.loginSuccess
                window.location.href = '/my_profile'
            }
                
            
        }else{
            resultOutputField.textContent = output_messages.gettingResultFail
        }
    }
    const user = {username: username, password: password}
    xhr.send(JSON.stringify(user))

}

