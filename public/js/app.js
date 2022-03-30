console.log("mi app.js en public")

document.addEventListener('click', e => {
    //console.log(e.target.dataset.short)
    if (e.target.dataset.short){
        const url = `${location.origin}/${e.target.dataset.short}`

        navigator.clipboard
        .writeText(url)
        .then(() => {
            console.log("Text copied to clipboard... ");
            console.log("Texto copiado al portapapeles...")
            console.log(url)
        })
        .catch((err) => {
            console.log("Something went wrong", err);
            console.log("Algo salió mal", err)
        });

    }

})