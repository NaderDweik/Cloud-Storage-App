function openFolderPopup() {
    document.getElementById("folderPopup").style.display = "block";
}

function closeFolderPopup() {
    document.getElementById("folderPopup").style.display = "none";
}

function openContentPopup() {
    document.getElementById("contentPopup").style.display = "block";
}

function closeContentPopup() {
    document.getElementById("contentPopup").style.display = "none";
}

// Close the popups if the user clicks outside of them
window.onclick = function(event) {
    const folderPopup = document.getElementById("folderPopup");
    const contentPopup = document.getElementById("contentPopup");

    if (event.target === folderPopup) {
        closeFolderPopup();
    }
    if (event.target === contentPopup) {
        closeContentPopup();
    }
};
