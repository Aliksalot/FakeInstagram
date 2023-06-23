
const request_image = () => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/load_image');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if(xhr.status === 200){
            const imageContainer = document.getElementById('sex')
            const image = document.createElement('img');
            image.src = '/' + xhr.responseText

            // Append the image to the container
            imageContainer.innerHTML = '';
            imageContainer.appendChild(image);
            console.log(xhr.responseText)
        }
    }
    xhr.send()
}