document.addEventListener('DOMContentLoaded', () => {
    const userIdInput = document.getElementById('userIdInput');
    const todoIdInput = document.getElementById('todoIdInput');
    const taskInput = document.getElementById('taskInput');
    
    const aufgabenLadenButton = document.getElementById('aufgabenLadenButton');

    // Event-Listener für Enter-Taste in userIdInput
    userIdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            aufgabenLaden();
        }
    });

    // Event-Listener für Enter-Taste in todoIdInput
    todoIdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            aufgabenLaden();
        }
    });

    // Event-Listener für Enter-Taste in taskInput
    taskInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            aufgabeHinzufuegen();
        }
    });

    // Event-Listener für den Button
    aufgabenLadenButton.addEventListener('click', aufgabenLaden);
});

async function aufgabenLaden() {
    try {
        let userId = document.getElementById('userIdInput').value;
        let todoId = document.getElementById('todoIdInput').value;

        if ( userId === '') {
            alert('Bitte eine Aufgabe eingeben!');
            return;
        }
        let apiUrl = `https://55pxbbcbr7.execute-api.eu-central-1.amazonaws.com/default/get_item?UserID=${userId}`;

        if (todoId) {
            apiUrl += `&TodoID=${todoId}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aufgabenListe = document.getElementById('todoListe');
        aufgabenListe.innerHTML = ''; // Leert die aktuelle Liste, um sie neu zu befüllen

        if (data.Tasks && data.Tasks.length > 0) {
            // Sortiere die Aufgaben nach TodoID als Zahlen
            data.Tasks.sort((a, b) => parseInt(a.TodoID, 10) - parseInt(b.TodoID, 10));

            data.Tasks.forEach(task => {
                const li = document.createElement('li');
            
                const timestampSpan = document.createElement('span');
                timestampSpan.className = 'timestamp';
                timestampSpan.textContent = task.Datum;
            
                li.innerHTML += `To-Do-ID: ${task.TodoID} | ${task.Task}`;
                
                li.appendChild(timestampSpan);
            
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Löschen';
                deleteButton.onclick = function() {
                    aufgabeLoeschen(userId, task.TodoID);
                };
                li.appendChild(deleteButton);
            
                aufgabenListe.appendChild(li);
            });
        } else {
            alert('Es wurden keine Aufgaben gefunden.');
        }
    } catch (error) {
        console.error('Fehler beim Laden der Aufgaben:', error);
    }
}

async function aufgabeLoeschen(userId, todoId) {
    try {
        console.log('Aufgabe wird gelöscht:', todoId);

        const endpoint = 'https://55pxbbcbr7.execute-api.eu-central-1.amazonaws.com/default/del_item';

        const requestBody = {
            UserID: userId,
            TodoID: todoId
        };

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Deleted record:', data);
        aufgabenLaden();

        return data;
    } catch (error) {
        console.error('Error deleting records:', error.message);
        throw error;
    }
}

async function findeNaechsteFreieTodoID(userId) {
    try {
        let apiUrl = `https://55pxbbcbr7.execute-api.eu-central-1.amazonaws.com/default/get_item?UserID=${userId}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Ändere die Vergleichs- und Sortierlogik, um TodoIDs als Zahlen zu behandeln
        let existingIds = data.Tasks.map(task => parseInt(task.TodoID, 10));
        let nextFreeId = 1;

        while (existingIds.includes(nextFreeId)) {
            nextFreeId++;
        }

        return nextFreeId;
    } catch (error) {
        console.error('Fehler beim Ermitteln der nächsten freien TodoID:', error);
        throw error;
    }
}

async function aufgabeHinzufuegen() {
    try {
        let userId = document.getElementById('userIdInput').value;
        let todoIdInput = document.getElementById('todoIdInput');
        let taskInput = document.getElementById('taskInput');
        let todoId = todoIdInput.value;
        let taskDescription = document.getElementById('taskInput').value;
        let timestamp = new Date().toLocaleString();

        if (taskDescription === '') {
            alert('Bitte eine Task eingeben!');
            return;
        }

        if (!todoId) {
            todoId = await findeNaechsteFreieTodoID(userId);
        }

        let apiUrl2 = `https://55pxbbcbr7.execute-api.eu-central-1.amazonaws.com/default/put_item?UserID=${userId}&TodoID=${todoId}`;

        const requestBody = {
            UserID: userId,
            TodoID: '' + todoId,
            Task: taskDescription,
            Datum: timestamp
        };

        const response = await fetch(apiUrl2, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Added record:', data);
        todoIdInput.value = '';
        taskInput.value = '';
        aufgabenLaden(); // Aktualisiert die Anzeige der Aufgabenliste

    } catch (error) {
        console.error('Error adding record:', error.message);
        throw error;
    }
}