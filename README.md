# PI_projekt

# 3,2,1 Box

**Fakultet:** Fakultet informatike u Puli  (https://fipu.unipu.hr)

**Kolegij:** Programsko inženjerstvo (ntankovic.unipu.hr/pi)

**Mentor:** doc. dr. sc. Nikola Tanković (ntankovic.unipu.hr) 

**Student:** Iva Batur

## Opis projekta

Aplikacija *3,2,1 BOX* omogućuje upravljanje aktivnostima boksačkog kluba.  
Sastoji se od dva dijela: **backend** izrađen u Node.js s Express frameworkom i **frontend** izrađen u Vue 3.  
Kroz aplikaciju trener ima mogućnost upravljanja članovima kluba, objavljivanja obavijesti, dodavanja nadolazećih turnira te  dodavanja slika u galeriju.
Članovi kluba mogu pregledavati objavljene obavijesti trenera, prijaviti se na turnire i pregledavati galeriju.

Backend pruža REST API s podrškom za prijavu i autorizaciju uloga (trener, član, gost).

##  Tehnologije

- **Frontend:** Vue.js 3, Vue CLI , Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Cloudinary, multer, multer-storage-cloudinary, dotenv, CORS
- **Hosting i deploy:** Netlify, Render
- **Pohrana slika:** Cloudinary

## Korisnički podaci za prijavu

✅ **Trener**  
- Email: `trener@box.com`  
- Lozinka: `tajna123`

✅ **Član**  
- Email: `clan@box.com`  
- Lozinka: `lozinka321`

Gost može pristupiti aplikaciji bez prijave odabirom opcije *Continue as Guest*.

> Prototip aplikacije: https://www.figma.com/proto/02wwDnkpBpzyDkWm041zox/Untitled?node-id=0-1&t=x1kvo4e0jsMlR14v-1

