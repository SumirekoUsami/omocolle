document.querySelectorAll(".girl").forEach(girl => {
    girl.addEventListener("mouseover", () => {
        CharName.innerText = girl.dataset.name;
        CharDesc.innerText = girl.dataset.description;
        
        CharAuthor.style.display = "unset";
        CharAuthorLink.href      = girl.dataset.author.split(";")[1];
        CharAuthorLink.innerText = girl.dataset.author.split(";")[0];
    });
    
    girl.addEventListener("click", () => {
        window.location.assign(urlPrefix + "char=" + girl.dataset.id);
    });
});
