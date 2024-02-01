$(document).ready(function () {
    // Simuliere eine UserID (ersetze dies durch die echte UserID)
    var userId = '1000';

    // AJAX-Aufruf, um Daten von der Lambda-Funktion abzurufen
    $.ajax({
        url: 'https://55pxbbcbr7.execute-api.eu-central-1.amazonaws.com/default/get_item?UserID=' + userId,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Hier kannst du die erhaltenen Daten in dein HTML-Element einfügen
            var resultContainer = $('#result-container');
            if (data.Tasks && data.Tasks.length > 0) {
                var tasksHtml = '<ul>';
                data.Tasks.forEach(function (task) {
                    tasksHtml += '<li>' + task + '</li>';
                });
                tasksHtml += '</ul>';
                resultContainer.html(tasksHtml);
            } else {
                resultContainer.html('<p>Keine Aufgaben gefunden.</p>');
            }
        },
        error: function (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
        }
    });
});