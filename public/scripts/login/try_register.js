
const output_messages = {
    emptyFields : 'Please fill all fields! ',
    confirmPassErr : 'Passwords dont match! ',
    usernameUnavalible : 'Username not avaliable! ',
    invalidUsername : 'Username can contain only numbers and letters! ',
    invalidPassword : 'Password can only contain numbers and letters! ',
    errorWithAccountCreation : 'Couldnt create account'
}

const clearFields = (fields) => {
    fields.forEach(field => {
        field.value = ''
    });
}

const try_register = () => {
    
    const outputField = document.getElementById('outputField')

    const usernameField = document.getElementById('usernameField')
    const passwordField = document.getElementById('passwordField')
    const confirmField = document.getElementById('confirmField')
    
    const username = usernameField.value
    const password = passwordField.value
    const confirm = confirmField.value

    /*debug*/ console.log(username, password, confirm)
    if(username === undefined || password === undefined || confirm === undefined){
        clearFields([usernameField, passwordField, confirmField])
        outputField.textContent = output_messages.emptyFields
        return
    }

    if(!(password === confirm)){
        clearFields([passwordField, confirmField])
        outputField.textContent = output_messages.confirmPassErr
        return
    }
 
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/new_account_attempt')
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if(xhr.status === 200){
            console.log("RESPONSE FROM SERVER", xhr.responseText)
            switch(xhr.responseText){
                case 'invalidPass': outputField.textContent = output_messages.invalidPassword; break;
                case 'usernameNotAvaliable': outputField.textContent = output_messages.usernameUnavalible; break;
                case 'invalidUsername': outputField.textContent = output_messages.invalidUsername; break;
                /*debug*/
                case 'DONE': window.location.href = '/login'
            }
        }else{
            outputField.textContent = outputField.errorWithAccountCreation
        }
        clearFields([passwordField, confirmField, usernameField])
    }
    
    clearFields([passwordField, confirmField, usernameField])

    const user = {username: username, password: password}
    console.log("SENDING", user)
    xhr.send(JSON.stringify(user))
}