# RecordAI

## Beschreibung

Record.AI ist eine benutzerfreundliche Anwendung, mit der Sie mühelos Audioaufnahmen erstellen, transkribieren und verwalten können. Sie nutzt modernste KI-Technologie für eine präzise Umwandlung von Audio in Text, was sie zu einem leistungsstarken Werkzeug für verschiedene Anwendungsfälle wie Mitschriften, Interviews und Content-Erstellung macht.

## Funktionen

- **Audioaufnahme**: Einfache Erfassung von qualitativ hochwertigen Audioaufnahmen.
- **KI-basierte Transkription**: Wandele Audioaufnahmen mithilfe fortschrittlicher KI-Algorithmen in präzise und verlässliche Texttranskriptionen um.
- **Transkriptionsbearbeitung**: Bearbeite und formatiere Transkriptionen mit intuitiven Tools, um Genauigkeit und Lesbarkeit sicherzustellen.
- **Titelgenerierung**: Generiere automatisch Titel für Audio-Dateien, um die Organisation und einfache Identifizierung zu verbessern.
- **Authentifizierung**: Sichere Authentifizierung der Benutzer zum Schutz ihrer Daten und Gewährleistung der Privatsphäre.

## Installation

1. Klone das Repository: `git clone git@github.com:SebastianMunaretto/RecordAI.git`
2. Installiere die benötigten Abhängigkeiten: `npm install`
3. Füge API keys in enviornment files ein (FIREBASE, OPENAI)

## Verwendung

1. Starte die Anwendung: `ng serve`
2. Greife mit deinem Webbrowser auf die App zu unter `http://localhost:4200`


## To Do
- [X] Add loading spinners for all fetch processes
- [X] Make whole collections deletable so the folder on the left should be deletable
- [X] Add popupus and snack bars where needed
- [X] Fix styling and centering issues
- [] Limit home element fetch to batches of 5 witch page changes to increase performance on bigger datasets
- [X] Add folder system that can be managed on the left menu bar
- [X] Refetch the elements when the audio registration element is closed
- [X] Refactor project to make it type conform
- [X] Manage all possible error cases
- [X] Redesign UI
- [X] Rebrand the whole project to RecordAI
- [X] In connection with the error messages optimize the returns in the database class
- [X] Allow edit of title and transcription

