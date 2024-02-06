const STORAGE_TOKEN = 'QDZWF0M731P6BJUN86LFPQFS6VZ8PUSF08W8Y1A2';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function setItem(key, value) {
    // Erstellt ein Payload-Objekt mit Schlüssel, Wert und dem STORAGE_TOKEN
    const payload = { key, value, token: STORAGE_TOKEN };
    // Sendet einen POST-Request an STORAGE_URL mit dem Payload als JSON-Daten
    // und wartet auf die Antwort
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        // Wandelt die Antwort in JSON um und gibt das Ergebnis zurück
        .then(res => res.json());
}

async function getItem(key) {
    // Erstellt die URL für den GET-Request mit dem Schlüssel und dem STORAGE_TOKEN
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    // Sendet einen GET-Request an die generierte URL und wartet auf die Antwort
    return fetch(url)
        // Wandelt die Antwort in JSON um
        .then(res => res.json())
        // Verarbeitet die Antwort und gibt den Wert des Schlüssels zurück, falls vorhanden
        .then(res => {
            if (res.data) { // Wenn Daten vorhanden sind
                return res.data.value; // Gib den Wert des Schlüssels zurück
            }
            // Andernfalls wirf einen Fehler
            throw `Could not find data with key "${key}".`;
        });
}
