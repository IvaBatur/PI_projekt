# PI_projekt

# 3,2,1 BOX 

**Fakultet:** Fakultet informatike u Puli  
**Kolegij:** Programsko inženjerstvo  
**Nastavni profesor:** doc. dr. sc. Nikola Tanković
**Student:** Iva Batur

## Opis projekta

Aplikacija *3,2,1 BOX* omogućuje upravljanje aktivnostima boksačkog kluba.  
Sastoji se od dva dijela: **backend** izrađen u Node.js s Express frameworkom i **frontend** izrađen u Vue 3.  
Kroz aplikaciju trener ima mogućnost upravljanja članovima kluba, objavljivanja obavijesti, dodavanja nadolazećih turnira te  dodavanja slika u galeriju.
Članovi kluba mogu pregledavati objavljene obavijesti trenera, prijaviti se na turnire i pregledavati galeriju.

Backend pruža REST API s podrškom za prijavu i autorizaciju uloga (trener, član, gost).

## Korisnički podaci za prijavu

✅ **Trener**  
- Email: `trener@box.com`  
- Lozinka: `tajna123`

✅ **Član**  
- Email: `clan@box.com`  
- Lozinka: `lozinka321`

Gost može pristupiti aplikaciji bez prijave odabirom opcije *Continue as Guest*.



> Za pokretanje aplikacije, prvo pokrenuti backend server (`node index.js`) i zatim frontend (`npm run serve`).
