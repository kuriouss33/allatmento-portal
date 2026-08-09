// === XSS BIZTONSÁGI SZŰRŐ (HTML ESZKÉPELÉS) ===
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// === FIREBASE INICIALIZÁLÁS ===
const firebaseConfig = {
  apiKey: "AIzaSyD6cwQi2yitYYRNAlHjIQ9yLrJBAcexJmU",
  authDomain: "allatmento-app.firebaseapp.com",
  projectId: "allatmento-app",
  storageBucket: "allatmento-app.firebasestorage.app",
  messagingSenderId: "1023641672984",
  appId: "1:1023641672984:web:a6b3ea4899b3c49c0bd26d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// === IMGBB API KULCS ===
const imgbbApiKey = "5274f0761f88a38f610c030a7de51e0f"; 

// === EGYEDI FELHASZNÁLÓ AZONOSÍTÓ (USER ID) ===
let currentUserId = localStorage.getItem("allatmento_user_id");
if (!currentUserId) {
  currentUserId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("allatmento_user_id", currentUserId);
}

// === KÉPERNYŐ ÉS FELÜLETI ELEMEK ===
const step0 = document.getElementById("step0");
const stepMap = document.getElementById("stepMap");
const stepSajat = document.getElementById("stepSajat");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");

// MODAL & FOTO ELEMEK
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModalBtn = document.getElementById("closeModalBtn");
const fotoInput = document.getElementById("fotoInput");
const imagePreviewBox = document.getElementById("imagePreviewBox");
const previewImage = document.getElementById("previewImage");
const removePhotoBtn = document.getElementById("removePhotoBtn");
const uploadLabelText = document.getElementById("uploadLabelText");

// KERESŐK ÉS SZŰRŐK ELEMEI
const bejelentesKeresoInput = document.getElementById("bejelentesKeresoInput");
const szervezetKeresoInput = document.getElementById("szervezetKeresoInput");
const megyeValaszto = document.getElementById("megyeValaszto");
const szervezetekLista = document.getElementById("szervezetekLista");

// NÉZETVÁLTÓK
const toggleMapBtn = document.getElementById("toggleMapBtn");
const toggleListBtn = document.getElementById("toggleListBtn");
const mainMapDiv = document.getElementById("mainMap");
const bejelentesekListaDiv = document.getElementById("bejelentesekLista");

// ÁLLAPOT VÁLTOZÓK
let panzoomInstance = null;
let pontosLat = null;
let pontosLon = null;
let userMap;
let userMarker; 
let activeMarkers = {}; 
let osszesBejelentesMemoria = [];
let osszesSzervezetMemoria = [];

// === 1. KÖZPONTI TÉRKEP ELINDÍTÁSA ===
const mainMap = L.map('mainMap').setView([47.1625, 19.5033], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(mainMap);

// === VALÓS IDEJŰ BEJELENTÉSEK FIGYELŐJE ÉS KERESŐ SZŰRŐ ===
db.collection("bejelentesek").onSnapshot((snapshot) => {
  const activeDocIds = snapshot.docs.map(doc => doc.id);
  
  // Térkép jelölők takarítása
  Object.keys(activeMarkers).forEach(id => {
    if (!activeDocIds.includes(id)) {
      mainMap.removeLayer(activeMarkers[id]);
      delete activeMarkers[id];
    }
  });

  osszesBejelentesMemoria = [];

  snapshot.docs.forEach((doc) => {
    const adat = doc.data();
    const id = doc.id;
    const statusz = adat.statusz || "uj"; 

    osszesBejelentesMemoria.push({ id: id, adat: adat });

    if (adat.lat && adat.lon) {
      if (statusz !== "megoldva") {
        const kepHtml = adat.fotoUrl 
          ? `<br><img src="${adat.fotoUrl}" class="popup-img" onclick="openImageModal('${adat.fotoUrl}')" alt="Állat fotója">` 
          : '';

        const statuszText = statusz === "uj" ? "🚨 ÚJ BEJELENTÉS" : "🚗 FOLYAMATBAN (Úton)";

        const popupContent = `
          <strong style="font-size:14px;">${adat.fajta}</strong><br>
          <span class="status-badge ${statusz}" style="display:inline-block; margin: 4px 0;">${statuszText}</span><br>
          <span style="color:#64748b; font-size:12px;">${adat.megjegyzes || 'Nincs megjegyzés'}</span><br>
          <span style="font-size:12px;">📞 ${adat.telefon || 'Nincs tel.'}</span>
          ${kepHtml}
          ${getStatusButtonHtml(id, statusz, adat.vallaloId)}
        `;

        if (activeMarkers[id]) {
          activeMarkers[id].setPopupContent(popupContent);
        } else {
          const marker = L.marker([adat.lat, adat.lon]).addTo(mainMap).bindPopup(popupContent);
          activeMarkers[id] = marker;
        }
      } else {
        if (activeMarkers[id]) {
          mainMap.removeLayer(activeMarkers[id]);
          delete activeMarkers[id];
        }
      }
    }
  });

  szurEsKirajzolBejelentesek();
});

// BEJELENTÉSEK SZŰRÉSE ÉS LISTÁZÁSA GÉPELÉSKOR
function szurEsKirajzolBejelentesek() {
  const bejelentesekLista = document.getElementById("bejelentesekLista");
  if (!bejelentesekLista) return;

  const keresoSzo = bejelentesKeresoInput ? bejelentesKeresoInput.value.toLowerCase().trim() : "";
  bejelentesekLista.innerHTML = "";

  const szurtBejelentesek = osszesBejelentesMemoria.filter((elem) => {
    const fajta = (elem.adat.fajta || "").toLowerCase();
    const megjegyzes = (elem.adat.megjegyzes || "").toLowerCase();
    const telefon = (elem.adat.telefon || "").toLowerCase();
    const lezaras = (elem.adat.lezarasMegjegyzes || "").toLowerCase();

    return fajta.includes(keresoSzo) || megjegyzes.includes(keresoSzo) || telefon.includes(keresoSzo) || lezaras.includes(keresoSzo);
  });

  if (szurtBejelentesek.length === 0) {
    bejelentesekLista.innerHTML = '<p style="color: #64748b; text-align: center; margin-top: 15px;">Nincs a keresésnek megfelelő bejelentés.</p>';
    return;
  }

  szurtBejelentesek.forEach((elem) => {
    bejelentesekLista.innerHTML += createReportCardHtml(elem.id, elem.adat);
  });
}

if (bejelentesKeresoInput) {
  bejelentesKeresoInput.addEventListener("input", szurEsKirajzolBejelentesek);
}

// KÁRTYA HTML GENERÁLÓ (XSS VÉDETT)
function createReportCardHtml(id, adat) {
  const statusz = adat.statusz || "uj";
  const statuszLabel = statusz === "uj" ? "ÚJ" : (statusz === "folyamatban" ? "FOLYAMATBAN" : "MEGOLDVA");
  const kepHtml = adat.fotoUrl ? `<img src="${adat.fotoUrl}" class="popup-img" onclick="openImageModal('${adat.fotoUrl}')" style="margin-bottom:8px;">` : '';

  // Az összes beírt mezőt átengedjük az escapeHtml szűrőn
  const tisztitottFajta = escapeHtml(adat.fajta);
  const tisztitottMegjegyzes = escapeHtml(adat.megjegyzes);
  const tisztitottTelefon = escapeHtml(adat.telefon);
  const tisztitottLezaras = escapeHtml(adat.lezarasMegjegyzes);

  const lezarasHtml = tisztitottLezaras 
    ? `<p style="color:#047857; background:#ecfdf5; padding:6px 8px; border-radius:6px; border:1px solid #a7f3d0; font-size:12px; margin-top:6px; word-break:break-word;">💬 <b>Megoldás:</b> ${tisztitottLezaras}</p>` 
    : '';

  const torlesGombHtml = (adat.createrId === currentUserId) 
    ? `
      <div class="delete-box-container" style="margin-top:8px;">
        <button type="button" class="report-action-btn btn-delete" onclick="showDeleteConfirm('${id}', event)">🗑️ Bejelentés törlése</button>
      </div>`
    : '';

  return `
    <div class="report-card-wrapper" data-report-id="${id}">
      <div class="report-card">
        <div class="report-header">
          <span class="report-title">${tisztitottFajta}</span>
          <span class="status-badge ${statusz}">${statuszLabel}</span>
        </div>
        <div class="report-body">
          ${kepHtml}
          <p>📝 ${tisztitottMegjegyzes || 'Nincs megjegyzés'}</p>
          <p>📞 ${tisztitottTelefon || 'Nincs megadva'}</p>
          ${lezarasHtml}
        </div>
        ${getStatusButtonHtml(id, statusz, adat.vallaloId)}
        <button type="button" class="report-action-btn btn-outline" style="margin-top:6px; color:#1877f2; border-color:#cbd5e1; font-weight:bold;" onclick="shareReportById('${id}', event)">
          📲 Bejelentés megosztása
        </button>
        ${torlesGombHtml}
      </div>
    </div>
  `;
}

// BÁRMELYIK BEJELENTÉS MEGOSZTÁSA (AKÁR LISTÁBÓL, AKÁR TÉRKEPRŐL)
window.shareReportById = function(docId, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  
  const elem = osszesBejelentesMemoria.find(item => item.id === docId);
  if (!elem) return;

  const adat = elem.adat;
  let terKepLink = (adat.lat && adat.lon) ? `https://www.google.com/maps?q=${adat.lat},${adat.lon}` : 'Nincs megadva';
  
  const megosztandoSzoveg = `🚨 ÁLLATMENTÉS BEJELENTÉS!\n\n🐾 Állat: ${adat.fajta || 'Állat'}\n📝 Leírás: ${adat.megjegyzes || 'Nincs külön megjegyzés'}\n📞 Kapcsolat: ${adat.telefon || 'Nincs megadva'}\n📍 Pontos helyszín (Térkép): ${terKepLink}`;

  if (navigator.share) {
    navigator.share({
      title: '🚨 Állatmentő Bejelentés',
      text: megosztandoSzoveg
    }).catch(() => console.log("Megosztás megszakítva"));
  } else {
    navigator.clipboard.writeText(megosztandoSzoveg);
    alert("📋 A bejelentés adatai és a Google Maps helyszín linkje másolva a vágólapra!\n\nMost megnyílik a Facebook, ahol beillesztheted (CTRL + V) a kívánt csoportba.");
    window.open('https://www.facebook.com/', '_blank');
  }
};

// AKCIÓGOMB GENERÁLÓ LOGIKA
function getStatusButtonHtml(id, statusz, vallaloId) {
  if (statusz === "uj") {
    return `
      <div class="status-action-box" data-action-id="${id}">
        <button type="button" class="report-action-btn btn-action-take" onclick="changeStatus('${id}', 'folyamatban', event)">🚗 Úton vagyok / Elvállalom</button>
      </div>`;
  } else if (statusz === "folyamatban") {
    if (vallaloId === currentUserId) {
      return `
        <div class="status-action-box" data-action-id="${id}">
          <button type="button" class="report-action-btn btn-action-solve" onclick="showResolveInput('${id}', event)">✅ Úgy látom, megoldva!</button>
          <button type="button" class="report-action-btn btn-outline" style="margin-top:5px; color:#ef4444;" onclick="changeStatus('${id}', 'uj', event)">❌ Mégsem tudom vállalni</button>
        </div>`;
    } else {
      return `<p style="font-size:11px; color:#d97706; margin-top:6px; text-align:center;">🚗 Valaki már úton van erre az ügyre</p>`;
    }
  } else {
    return `
      <p style="font-size:11px; color:#10b981; margin-top:6px; text-align:center;">✅ Ez az ügy lezárult</p>
      <button type="button" class="report-action-btn btn-outline" style="font-size:11px; padding:4px;" onclick="changeStatus('${id}', 'uj', event)">↩️ Újrakiadás / Visszaállítás</button>
    `;
  }
}

// LEZÁRÁSI MEGJEGYZÉS BEVITELI MEZŐ MEGJELENÍTÉSE
window.showResolveInput = function(docId, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  const btn = event.target;
  const box = btn.closest('.status-action-box');

  if (box) {
    box.innerHTML = `
      <div style="background:#f0fdf4; padding:10px; border-radius:8px; border:1px solid #bbf7d0; margin-top:6px; text-align:left;">
        <label style="font-size:12px; font-weight:bold; color:#166534; display:block; margin-bottom:6px;">Megoldás részletei (opcionális):</label>
        <textarea id="resolveInput_${docId}" placeholder="Pl.: A cica a Váci Állatkórházba került..." style="width:100%; min-height:60px; font-size:13px; padding:8px; margin:0 0 8px 0; border:1px solid #86efac; border-radius:6px; box-sizing:border-box; font-family:inherit; resize:vertical;"></textarea>
        <div style="display:flex; gap:8px;">
          <button type="button" class="report-action-btn btn-action-solve" style="padding:10px; font-size:12px; margin:0; flex:2; width:auto; white-space:nowrap;" onclick="submitResolve('${docId}', event)">✅ Mentés & Lezárás</button>
          <button type="button" class="report-action-btn btn-outline" style="padding:10px; font-size:12px; margin:0; flex:1; width:auto; white-space:nowrap;" onclick="cancelResolve('${docId}', event)">Mégsem</button>
        </div>
      </div>
    `;
  }
};

// MEGJEGYZÉS MENTÉSE ÉS LEZÁRÁS FIRESTORE-BAN
window.submitResolve = function(docId, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  const input = document.getElementById(`resolveInput_${docId}`);
  const lezarasMegjegyzes = input ? input.value.trim() : "";

  db.collection("bejelentesek").doc(docId).update({
    statusz: "megoldva",
    lezarasMegjegyzes: lezarasMegjegyzes
  })
  .then(() => console.log("Ügy sikeresen lezárva megjegyzéssel!"))
  .catch((error) => console.error("Hiba a lezárásnál:", error));
};

// LEZÁRÁS MEGSZAKÍTÁSA
window.cancelResolve = function(docId, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  const btn = event.target;
  const box = btn.closest('.status-action-box');
  if (box) {
    box.innerHTML = `
      <button type="button" class="report-action-btn btn-action-solve" onclick="showResolveInput('${docId}', event)">✅ Úgy látom, megoldva!</button>
      <button type="button" class="report-action-btn btn-outline" style="margin-top:5px; color:#ef4444;" onclick="changeStatus('${docId}', 'uj', event)">❌ Mégsem tudom vállalni</button>
    `;
  }
};

// STÁTUSZVÁLTÁS ADATBÁZISBAN
window.changeStatus = function(docId, ujStatusz, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const updateData = { statusz: ujStatusz };

  if (ujStatusz === "folyamatban") {
    updateData.vallaloId = currentUserId;
  } else if (ujStatusz === "uj") {
    updateData.vallaloId = null;
    updateData.lezarasMegjegyzes = null;
  }

  db.collection("bejelentesek").doc(docId).update(updateData)
    .then(() => console.log("Státusz frissítve!"))
    .catch((error) => console.error("Hiba:", error));
};

// BEJELENTÉS TÖRLESE: MEGERŐSÍTŐ ABLAK MEGJELENÍTÉSE
window.showDeleteConfirm = function(docId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const btn = event.target;
  const box = btn.closest('.delete-box-container');

  if (box) {
    box.innerHTML = `
      <div style="background:#fef2f2; padding:8px; border-radius:8px; border:1px solid #fecaca; text-align:center;">
        <span style="font-size:12px; color:#ef4444; font-weight:bold; display:block; margin-bottom:6px;">Biztosan törlöd ezt a bejelentést?</span>
        <div style="display:flex; gap:6px;">
          <button type="button" class="report-action-btn btn-danger" style="padding:6px; font-size:12px;" onclick="deleteReport('${docId}', event)">IGEN, TÖRÖLD</button>
          <button type="button" class="report-action-btn btn-outline" style="padding:6px; font-size:12px;" onclick="cancelDelete('${docId}', event)">Mégsem</button>
        </div>
      </div>
    `;
  }
};

// MÉGSEM GOMB LOGIKA
window.cancelDelete = function(docId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const btn = event.target;
  const box = btn.closest('.delete-box-container');

  if (box) {
    box.innerHTML = `<button type="button" class="report-action-btn btn-delete" onclick="showDeleteConfirm('${docId}', event)">🗑️ Bejelentés törlése</button>`;
  }
};

// FIRESTORE VÉGLEGES TÖRLESE
window.deleteReport = function(docId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const elemek = document.querySelectorAll(`[data-report-id="${docId}"]`);
  elemek.forEach(elem => elem.remove());

  db.collection("bejelentesek").doc(docId).delete()
    .then(() => {
      console.log("Dokumentum törölve!");
      const sajatLista = document.getElementById("sajatUgyekLista");
      if (sajatLista && sajatLista.children.length === 0) {
        sajatLista.innerHTML = '<p style="color: #64748b;">Még nincs saját bejelentésed vagy elvállalt ügyed.</p>';
      }
    })
    .catch((error) => console.error("Hiba:", error));
};

// === SAJÁT ÜGYEIM LEKÉRDEZÉSE ===
let sajatUgyekUnsubscribe = null;

function betoltSajatUgyek() {
  const sajatLista = document.getElementById("sajatUgyekLista");
  sajatLista.innerHTML = '<p style="color: #64748b;">⏳ Saját ügyek betöltése...</p>';

  if (sajatUgyekUnsubscribe) sajatUgyekUnsubscribe();

  sajatUgyekUnsubscribe = db.collection("bejelentesek").onSnapshot((snapshot) => {
    sajatLista.innerHTML = "";
    let talalat = false;

    snapshot.docs.forEach((doc) => {
      const adat = doc.data();
      const id = doc.id;

      if (adat.createrId === currentUserId || adat.vallaloId === currentUserId) {
        talalat = true;
        const szerep = adat.createrId === currentUserId ? "✍️ Általad bejelentve" : "🚗 Általad elvállalva";
        
        sajatLista.innerHTML += `
          <div style="margin-bottom: 4px; font-size:12px; font-weight:bold; color:#8b5cf6; text-align:left;">${szerep}</div>
          ${createReportCardHtml(id, adat)}
        `;
      }
    });

    if (!talalat) {
      sajatLista.innerHTML = '<p style="color: #64748b;">Még nincs saját bejelentésed vagy elvállalt ügyed.</p>';
    }
  });
}

// === NÉZETVÁLTÓ LOGIKA (TÉRKEP | LISTA) ===
toggleMapBtn.addEventListener("click", () => {
  toggleMapBtn.classList.add("active");
  toggleListBtn.classList.remove("active");
  mainMapDiv.style.display = "block";
  bejelentesekListaDiv.style.display = "none";
  if (bejelentesKeresoInput) bejelentesKeresoInput.style.display = "none";
  setTimeout(() => { mainMap.invalidateSize(); }, 100);
});

toggleListBtn.addEventListener("click", () => {
  toggleListBtn.classList.add("active");
  toggleMapBtn.classList.remove("active");
  mainMapDiv.style.display = "none";
  bejelentesekListaDiv.style.display = "block";
  if (bejelentesKeresoInput) bejelentesKeresoInput.style.display = "block";
});

// === INFORMÁCIÓS NÉZETVÁLTÓ (SZERVEZETEK | ÚTMUTATÓK) ===
const toggleSzervezetekBtn = document.getElementById("toggleSzervezetekBtn");
const toggleUtmutatoBtn = document.getElementById("toggleUtmutatoBtn");
const szervezetekSzakasz = document.getElementById("szervezetekSzakasz");
const utmutatoSzakasz = document.getElementById("utmutatoSzakasz");

if (toggleSzervezetekBtn && toggleUtmutatoBtn) {
  toggleSzervezetekBtn.addEventListener("click", () => {
    toggleSzervezetekBtn.classList.add("active");
    toggleUtmutatoBtn.classList.remove("active");
    szervezetekSzakasz.style.display = "block";
    utmutatoSzakasz.style.display = "none";
  });

  toggleUtmutatoBtn.addEventListener("click", () => {
    toggleUtmutatoBtn.classList.add("active");
    toggleSzervezetekBtn.classList.remove("active");
    szervezetekSzakasz.style.display = "none";
    utmutatoSzakasz.style.display = "block";
  });
}

// === KÉP ELŐNÉZET LOGIKA ===
fotoInput.addEventListener("change", function() {
  const file = this.files[0];
  const uploadLabel = document.querySelector(".custom-file-upload");
  const uploadIcon = document.querySelector(".upload-icon");

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      imagePreviewBox.style.display = "block";
      
      uploadIcon.innerText = "✅";
      uploadLabelText.innerText = "Fotó sikeresen csatolva!";
      uploadLabel.classList.add("uploaded");
    };
    reader.readAsDataURL(file);
  }
});

removePhotoBtn.addEventListener("click", function() {
  const uploadLabel = document.querySelector(".custom-file-upload");
  const uploadIcon = document.querySelector(".upload-icon");

  fotoInput.value = "";
  previewImage.src = "";
  imagePreviewBox.style.display = "none";
  
  uploadIcon.innerText = "📷";
  uploadLabelText.innerText = "Fotó készítése / Csatolása";
  uploadLabel.classList.remove("uploaded");
});

// === KÉPNÉZŐ MODAL LOGIKA ===
function openImageModal(url) {
  modalImage.src = url;
  modalImage.style.transform = "none";
  imageModal.style.display = "flex";

  if (panzoomInstance) {
    panzoomInstance.destroy();
    panzoomInstance = null;
  }

  if (typeof Panzoom !== "undefined") {
    setTimeout(() => {
      panzoomInstance = Panzoom(modalImage, { 
        maxScale: 5, 
        minScale: 1, 
        contain: 'outside',
        cursor: 'move',
        exclude: [closeModalBtn]
      });
      const wrapper = document.querySelector('.modal-content-wrapper');
      if (wrapper) wrapper.addEventListener('wheel', panzoomInstance.zoomWithWheel);
    }, 100);
  }
}

closeModalBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  imageModal.style.display = "none";
  modalImage.src = "";
  if (panzoomInstance) {
    panzoomInstance.destroy();
    panzoomInstance = null;
  }
});

// === INFORMÁCIÓS MODUL LEKÉRDEZÉS & KETTŐS SZŰRÉS ===
function betoltSzervezetek(kivalasztottMegye) {
  szervezetekLista.innerHTML = '<p style="color: #64748b;">⏳ Szervezetek betöltése...</p>';

  let lekerdezes = db.collection("szervezetek");
  if (kivalasztottMegye !== "Összes") {
    lekerdezes = lekerdezes.where("megye", "==", kivalasztottMegye);
  }

  lekerdezes.get().then((snapshot) => {
    osszesSzervezetMemoria = [];
    
    snapshot.forEach((doc) => {
      osszesSzervezetMemoria.push(doc.data());
    });

    szurEsKirajzolSzervezetek();
  }).catch((err) => {
    console.error("Hiba a szervezetek lekérésekor:", err);
    szervezetekLista.innerHTML = '<p style="color: #ef4444;">Nem sikerült betölteni az adatokat.</p>';
  });
}

function szurEsKirajzolSzervezetek() {
  const keresoSzo = szervezetKeresoInput ? szervezetKeresoInput.value.toLowerCase().trim() : "";
  szervezetekLista.innerHTML = "";

  const szurtLista = osszesSzervezetMemoria.filter((szervezet) => {
    const nev = (szervezet.nev || "").toLowerCase();
    const cim = (szervezet.cim || "").toLowerCase();
    const megye = (szervezet.megye || "").toLowerCase();
    const kategoria = (szervezet.kategoria || "").toLowerCase();

    return nev.includes(keresoSzo) || cim.includes(keresoSzo) || megye.includes(keresoSzo) || kategoria.includes(keresoSzo);
  });

  if (szurtLista.length === 0) {
    szervezetekLista.innerHTML = '<p style="color: #ef4444; text-align: center; margin-top: 15px;">❌ Nincs a keresésnek megfelelő szervezet.</p>';
    return;
  }

  szurtLista.forEach((szervezet) => {
    let kategoriaClass = "";
    let ikonosNev = szervezet.nev;

    if (szervezet.kategoria === "orvos") {
      kategoriaClass = "orvos"; ikonosNev = "🏥 " + szervezet.nev;
    } else if (szervezet.kategoria === "hatosag") {
      kategoriaClass = "hatosag"; ikonosNev = "🏛️ " + szervezet.nev;
    } else if (szervezet.kategoria === "vad") {
      kategoriaClass = "vad"; ikonosNev = "🦅 " + szervezet.nev;
    } else {
      ikonosNev = "🐕 " + szervezet.nev;
    }

    szervezetekLista.innerHTML += `
      <div class="info-card ${kategoriaClass}">
        <h3>${ikonosNev}</h3>
        <p>📍 ${szervezet.cim || szervezet.megye}</p>
        <p>📞 ${szervezet.telefon}</p>
        <a href="tel:${szervezet.telefon}" class="call-btn">📞 HÍVÁS MOST</a>
      </div>
    `;
  });
}

if (megyeValaszto) {
  megyeValaszto.addEventListener("change", function() {
    betoltSzervezetek(this.value);
  });
}

if (szervezetKeresoInput) {
  szervezetKeresoInput.addEventListener("input", szurEsKirajzolSzervezetek);
}

// === NAVIGÁCIÓ ===
document.getElementById("menuMapBtn").addEventListener("click", () => {
  step0.style.display = "none"; stepMap.style.display = "block";
  setTimeout(() => { mainMap.invalidateSize(); }, 100);
});

document.getElementById("menuNewBtn").addEventListener("click", () => {
  step0.style.display = "none"; step1.style.display = "block";
});

document.getElementById("menuSajatBtn").addEventListener("click", () => {
  step0.style.display = "none"; stepSajat.style.display = "block";
  betoltSajatUgyek();
});

document.getElementById("menuInfoBtn").addEventListener("click", () => {
  step0.style.display = "none"; step4.style.display = "block";
  betoltSzervezetek(megyeValaszto.value);
});

document.querySelectorAll(".backToMenuBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    stepMap.style.display = "none"; stepSajat.style.display = "none";
    step1.style.display = "none"; step2.style.display = "none";
    step3.style.display = "none"; step4.style.display = "none";
    step0.style.display = "block";

    if (sajatUgyekUnsubscribe) {
      sajatUgyekUnsubscribe();
      sajatUgyekUnsubscribe = null;
    }

    const mapDiv = document.getElementById("map");
    if (mapDiv) mapDiv.classList.remove("mutasd");
    document.getElementById("tovabb2").style.display = "none";
    document.getElementById("eredmeny").innerText = "Válassz a fenti lehetőségek közül!";
  });
});

// === HELYSZÍN MEGADÁSA (GPS VAGY MANUÁLIS TÉRKEP) ===
document.getElementById("gpsButton").addEventListener("click", function() {
  const eredmeny = document.getElementById("eredmeny");
  eredmeny.innerHTML = "⏳ GPS pozíció keresése...";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sikeresKereses, hibaKereses);
  } else {
    eredmeny.innerHTML = "A böngésződ nem támogatja a GPS-t. Használd a manuális választást!";
  }
});

document.getElementById("manualLocationBtn").addEventListener("click", function() {
  if (!pontosLat || !pontosLon) {
    pontosLat = 47.4979;
    pontosLon = 19.0402;
  }
  document.getElementById("eredmeny").innerHTML = "📍 Kattints a térképre vagy húzd a gombostűt a pontos helyszínre!";
  megjelenitBejelentesTerkep(pontosLat, pontosLon, 12);
});

function sikeresKereses(pozicio) {
  pontosLat = pozicio.coords.latitude;
  pontosLon = pozicio.coords.longitude;
  document.getElementById("eredmeny").innerHTML = "✅ Pozíció rögzítve! (Áthelyezhető)";
  megjelenitBejelentesTerkep(pontosLat, pontosLon, 16);
}

function hibaKereses() {
  document.getElementById("eredmeny").innerHTML = "❌ Nem sikerült lekérni a helyzeted. Kattints a manuális választásra!";
}

function megjelenitBejelentesTerkep(lat, lon, zoomLevel) {
  const mapDiv = document.getElementById("map");
  document.getElementById("mapSearchContainer").style.display = "flex";
  mapDiv.classList.add("mutasd");

  if (!userMap) {
    userMap = L.map('map').setView([lat, lon], zoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(userMap);
    
    userMarker = L.marker([lat, lon], { draggable: true }).addTo(userMap);
    userMarker.bindPopup('A bejelentés helye (Húzható!)').openPopup();

    userMarker.on('dragend', function(event) {
      const position = userMarker.getLatLng();
      pontosLat = position.lat;
      pontosLon = position.lng;
      document.getElementById("eredmeny").innerHTML = "📍 Új helyszín rögzítve!";
    });

    userMap.on('click', function(event) {
      pontosLat = event.latlng.lat;
      pontosLon = event.latlng.lng;
      userMarker.setLatLng(event.latlng);
      document.getElementById("eredmeny").innerHTML = "📍 Új helyszín rögzítve!";
    });

  } else {
    userMap.setView([lat, lon], zoomLevel);
    if (typeof userMarker !== "undefined") {
      userMarker.setLatLng([lat, lon]);
    }
  }

  setTimeout(() => { userMap.invalidateSize(); }, 300);
  document.getElementById("tovabb2").style.display = "block";
}

// === CÍM ALAPÚ KERESŐ (OPENSTREETMAP NOMINATIM) ===
document.getElementById("mapSearchBtn").addEventListener("click", async function() {
  const query = document.getElementById("mapSearchInput").value.trim();
  const eredmenyDiv = document.getElementById("eredmeny");
  const searchBtn = document.getElementById("mapSearchBtn");

  if (!query) {
    eredmenyDiv.innerHTML = "⚠️ Kérlek, írj be egy címet a kereséshez!";
    return;
  }

  eredmenyDiv.innerHTML = "⏳ Keresés folyamatban...";
  searchBtn.innerText = "⏳";

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=hu`);
    const data = await response.json();

    if (data && data.length > 0) {
      pontosLat = parseFloat(data[0].lat);
      pontosLon = parseFloat(data[0].lon);

      userMap.setView([pontosLat, pontosLon], 16);
      if (typeof userMarker !== "undefined") {
        userMarker.setLatLng([pontosLat, pontosLon]);
        userMarker.getPopup().setContent("Keresett helyszín rögzítve! 📍").openPopup();
      }

      const rovidCim = data[0].display_name.split(',')[0];
      eredmenyDiv.innerHTML = `✅ Helyszín megtalálva: <b>${rovidCim}</b> (Áthelyezhető)`;
    } else {
      eredmenyDiv.innerHTML = "❌ Nem találtunk ilyen címet. Próbáld meg máshogy írni!";
    }
  } catch (error) {
    console.error("Geocoding hiba:", error);
    eredmenyDiv.innerHTML = "❌ Hiba történt a keresés során. Ellenőrizd az internetkapcsolatot!";
  }

  searchBtn.innerText = "🔍";
});

document.getElementById("mapSearchInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("mapSearchBtn").click();
  }
});

// LÉPTETÉSEK
document.getElementById("tovabb1").addEventListener("click", () => { step1.style.display = "none"; step2.style.display = "block"; });
document.getElementById("vissza1").addEventListener("click", () => { step2.style.display = "none"; step1.style.display = "block"; });
document.getElementById("tovabb2").addEventListener("click", () => { step2.style.display = "none"; step3.style.display = "block"; });
document.getElementById("vissza2").addEventListener("click", () => { step3.style.display = "none"; step2.style.display = "block"; });

// KÁRTYA KIVÁLASZTÁS
document.querySelectorAll(".karty").forEach(karty => {
  karty.addEventListener("click", function() {
    document.querySelectorAll(".karty").forEach(k => k.classList.remove("kivalasztva"));
    this.classList.add("kivalasztva");
  });
});

// === MENTÉS ÉS KÉPFELTÖLTÉS ===
document.getElementById("kuldes").addEventListener("click", async function() {
  const submitBtn = document.getElementById("kuldes");
  submitBtn.innerText = "⏳ Feltöltés és küldés...";
  submitBtn.disabled = true;

  const megjegyzes = document.getElementById("megjegyzes").value;
  const telefon = document.getElementById("telefon").value;
  const kivalasztottKarty = document.querySelector(".karty.kivalasztva");
  const allatFajta = kivalasztottKarty ? kivalasztottKarty.dataset.fajta : "Nincs megadva";
  
  const fajl = fotoInput.files[0];
  let fotoUrl = null;

  try {
    if (fajl) {
      const formData = new FormData();
      formData.append("image", fajl);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        fotoUrl = result.data.url;
      }
    }

    await db.collection("bejelentesek").add({
      fajta: allatFajta,
      megjegyzes: megjegyzes,
      telefon: telefon,
      lat: pontosLat,
      lon: pontosLon,
      fotoUrl: fotoUrl,
      statusz: "uj",
      createrId: currentUserId,
      idopont: firebase.firestore.FieldValue.serverTimestamp()
    });

    let terKepLink = (pontosLat && pontosLon) ? `https://www.google.com/maps?q=${pontosLat},${pontosLon}` : 'Nincs megadva';
    const megosztandoSzoveg = `🚨 ÚJ ÁLLATMENTÉS BEJELENTÉS!\n\n🐾 Állat: ${allatFajta}\n📝 Leírás: ${megjegyzes || 'Nincs külön megjegyzés'}\n📞 Kapcsolat: ${telefon || 'Nincs megadva'}\n📍 Pontos helyszín (Térkép): ${terKepLink}`;

    step3.innerHTML = `
      <div style="padding: 10px 0; text-align: center;">
        <span style="font-size: 48px;">🎉</span>
        <h2>Köszönjük!</h2>
        <p style="font-size: 14px; color: #64748b;">A bejelentésed és a fotó elmentve a központi szerverre.</p>

        <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 15px; border-radius: 12px; margin-top: 15px; text-align: left;">
          <p style="font-weight: bold; font-size: 14px; margin: 0 0 6px 0; color: #1e293b;">📢 Segíts, hogy még gyorsabban kiérjen a segítség!</p>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 12px 0;">Oszd meg a bejelentést Facebook csoportokban, Messengeren vagy Viberen:</p>
          
          <button type="button" id="shareBtn" class="btn btn-primary" style="background: #1877f2; border: none; font-size: 14px; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            📲 Bejelentés Megosztása
          </button>
        </div>

        <button class="btn btn-outline" style="margin-top: 15px;" onclick="location.reload()">← Vissza a főmenübe</button>
      </div>
    `;

    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: '🚨 Állatmentő Bejelentés',
              text: megosztandoSzoveg
            });
          } catch (err) {
            console.log("Megosztás megszakítva");
          }
        } else {
          navigator.clipboard.writeText(megosztandoSzoveg);
          alert("📋 A bejelentés adatai és a Google Maps helyszín másolva a vágólapra!\n\nMost megnyílik a Facebook, ahol beillesztheted (CTRL + V) a kívánt csoportba.");
          window.open('https://www.facebook.com/', '_blank');
        }
      });
    }

  } catch (error) {
    console.error("Hiba: ", error);
    alert("Nem sikerült a beküldés. Ellenőrizd a kapcsolatot!");
    submitBtn.innerText = "🚨 BEJELENTÉS KÜLDÉSE";
    submitBtn.disabled = false;
  }
});