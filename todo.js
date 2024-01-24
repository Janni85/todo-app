document.addEventListener('DOMContentLoaded', (event) => {
    aufgabenLaden(); // Ruft die Funktion auf, um gespeicherte Aufgaben zu laden
});

function aufgabenLaden() {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || [];

    let aufgabenListe = document.getElementById('todoListe');
    aufgabenListe.innerHTML = ''; // Leert die aktuelle Liste, um sie neu zu befüllen

    aufgaben.forEach((aufgabe, index) => {
        let li = document.createElement('li'); // Erstellt ein neues Listenelement

        // Erstellt ein neues Span-Element für den Kommentar
        let commentSpan = document.createElement('span');
        commentSpan.textContent = aufgabe.text; // Setzt den Text der Aufgabe in das Span-Element
        li.appendChild(commentSpan); // Fügt das Span-Element zum Listenelement hinzu

        // Erstellt ein neues Span-Element für das Datum und die Uhrzeit
        let timestampSpan = document.createElement('span');
        timestampSpan.textContent = aufgabe.timestamp; // Setzt das Datum und die Uhrzeit in das Span-Element
        timestampSpan.style.float = 'right'; // Fügt einen CSS-Stil hinzu, um das Span-Element rechtsbündig zu positionieren
        li.appendChild(timestampSpan); // Fügt das Span-Element zum Listenelement hinzu

        aufgabenListe.appendChild(li); // Fügt das Listenelement zur Liste im HTML hinzu

        // Erstellt einen Löschbutton für jede Aufgabe
        let loeschButton = document.createElement('button');
        loeschButton.textContent = 'Löschen';
        // Fügt einen Event-Listener hinzu, der die Aufgabe löscht, wenn der Button geklickt wird
        loeschButton.onclick = function() {
            aufgabeLoeschen(index);
        };
        li.appendChild(loeschButton); // Fügt den Löschbutton zum Listenelement hinzu
    });
}

function aufgabeLoeschen(index) {
    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || []; //Liest vorhandene Aufgabe
    aufgaben.splice(index, 1); // Entfernt die Aufgabe am spezifizierten Index
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben)); // Speichert das aktualisierte Array
    aufgabenLaden();
}

function neueAufgabeHinzufuegen() {
    let aufgabeInput = document.getElementById('neueAufgabe'); // Greift auf das Eingabefeld zu
    let aufgabeText = aufgabeInput.value; // Holt den eingegebenen Text aus dem Eingabefeld
    if (aufgabeText === '') {
        alert('Bitte eine Aufgabe eingeben!'); // Zeigt eine Warnung, falls das Feld leer ist
        return; // Beendet die Funktion frühzeitig, falls kein Text eingegeben wurde
    }

    let aufgaben = JSON.parse(localStorage.getItem('aufgaben')) || []; // Liest vorhandene Aufgaben
    let timestamp = new Date(); // Erstellt ein neues Date-Objekt mit dem aktuellen Datum und der Uhrzeit
    aufgaben.push({ text: aufgabeText, timestamp: timestamp.toLocaleString() }); // Fügt die neue Aufgabe mit dem Zeitstempel zum Array hinzu
    localStorage.setItem('aufgaben', JSON.stringify(aufgaben)); // Speichert das aktualisierte Array
    aufgabeInput.value = ''; // Leert das Eingabefeld
    aufgabenLaden();
}