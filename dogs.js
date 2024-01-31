// Hunde-Api hinzugefügt

document.getElementById("showDogButton").addEventListener("click", async function() {
    // Fetchen Sie ein zufälliges Hundebild von einer Hundebild-API
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();

    // Bild-URL aus der Antwort extrahieren
    const imageUrl = data.message;

    // Das Bild auf der Seite anzeigen
    const dogImage = document.getElementById("dogImage");
    dogImage.src = imageUrl;
    dogImage.style.display = "block";
});