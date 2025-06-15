# Find Your Home – Platformă web imobiliară

**Find Your Home** este o aplicație web dezvoltată ca parte a lucrării de licență, având ca scop principal transformarea modului în care utilizatorii din România încarcă, caută, rezervă și închiriază locuințe. Aceasta oferă un flux complet de la publicarea anunțurilor până la colaborarea post-închiriere, punând accent pe accesibilitate, transparență, comunicare directă și autonomie digitală.

## ✨ Obiectivele proiectului

* Să ofere o alternativă reală și completă platformelor imobiliare clasice din România.
* Să faciliteze interacțiunea directă între chiriași și proprietari, fără intermediari.
* Să crească nivelul de transparență, siguranță și organizare prin funcționalități inteligente.

## 🔹 Funcționalități implementate

### ᵀ. Autentificare și înregistrare

* Crearea contului cu roluri diferite: Admin (automat), Utilizator, Proprietar
* Autentificare cu JWT + refresh-token
* Resetare parolă prin e-mail securizat

### ᵁ. Gestionare anunțuri

* Formular detaliat de publicare a locuinței
* Vizualizare, editare, ștergere anunțuri
* Localizare exactă pe hartă (Google Maps)
* Detecție automata a imaginilor duplicate prin SHA256

### ᵂ. Vizualizare și căutare

* Filtrare avansată: oraș, preț, camere, etc.
* Paginare și sortare dinamică prin API REST
* Hartă interactivă cu markers generate automat

### ᵃ. Programare vizionări și rezervări

* Calendar interactiv cu sloturi definite de proprietari
* Cereri de rezervare cu statusuri dinamice
* Sistem automat de actualizare a statusului vizitelor

### ᵄ. Colaborare post-închiriere

* Contracte, task-uri, notițe, termene recurente
* Calendar cu zilele de plată a chiriei/utilităților
* Reminder e-mail automat cu 12h înainte
* Fișiere accesibile doar părților implicate

### ᵅ. Evaluare și comunicare

* Sistem de mesagerie internă (SignalR)
* Recenzii oferite doar după interacțiuni reale
* Penalizări automate pentru comportamente neserioase

### ᵆ. Panou admin

* Validare recenzii, anunțuri, testimoniale
* Gestionare FAQ publicate pe pagină
* Control general asupra conținutului

## 📅 Tehnologii utilizate

### Frontend

* **React.js** ([React Docs](https://reactjs.org))
* **TypeScript** ([TypeScript Handbook](https://www.typescriptlang.org/docs/))
* **Tailwind CSS** ([Tailwind CSS](https://tailwindcss.com/docs))
* **Vite** pentru build rapid
* **Axios** pentru apeluri HTTP
* **Google Maps API** pentru localizare

### Backend

* **C# și ASP.NET Core** ([ASP.NET Core Docs](https://learn.microsoft.com/en-us/aspnet/core))
* **Entity Framework Core** pentru ORM
* **SQL Server** ca sistem de gestiune a datelor
* **Azure Blob Storage** pentru stocare fișiere
* **SignalR** pentru mesagerie in-app
* **JWT** pentru autentificare sigură

### Testare

* **Cypress** pentru testare end-to-end
* **Vitest** și **React Testing Library** pentru frontend
* **xUnit și Moq** pentru backend

### Alte servicii

* **Vercel** pentru hosting frontend
* **Azure App Service** pentru backend
* **GitHub Actions** pentru CI/CD

## 🎯 Testare și rezultate

* Verificare manuală a tuturor fluxurilor
* Teste automate pentru componente critice
* Scoruri Lighthouse (pagina colaborare):

  * Performanță: 92/100
  * Accesibilitate: 93/100
  * SEO: 100/100

## 🌟 Beneficii ale arhitecturii

* Separare clară frontend-backend
* Autorizare pe roluri și securitate ridicată
* Experiență intuitivă pentru utilizatori
* Posibilitate de extindere facilă

## 🚀 Extensii viitoare

* Aplicație mobilă
* Procesatori de plăți integrați
* Generare automata a contractelor PDF
* Algoritmi de recomandare a anunțurilor
* Estimare automată a valorii de piață

