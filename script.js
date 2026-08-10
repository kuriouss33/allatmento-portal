// === SÖTÉT MÓD (DARK MODE) LOGIKA ===
const themeToggleBtn = document.getElementById("themeToggleBtn");
const currentTheme = localStorage.getItem("allatmento_theme");

// Automatikus téma beállítás indításkor (mentett vagy rendszerszintű)
if (currentTheme === "dark" || (!currentTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.setAttribute("data-theme", "dark");
  if (themeToggleBtn) themeToggleBtn.innerText = "☀️";
} else {
  document.documentElement.setAttribute("data-theme", "light");
  if (themeToggleBtn) themeToggleBtn.innerText = "🌙";
}

// Gomb kattintás eseménykezelő
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    let theme = document.documentElement.getAttribute("data-theme");
    
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("allatmento_theme", "light");
      themeToggleBtn.innerText = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("allatmento_theme", "dark");
      themeToggleBtn.innerText = "☀️";
    }
  });
}

// === ANGOL / MAGYAR NYELV LOGIKA (100% TELJES i18N SZÓTÁR) ===
const translations = {
  hu: {
    // Főmenü
    appTitle: "Állatmentő Portál",
    appSub: "Sürgősségi segítség & koordináció",
    btnActiveReports: "🗺️ Bejelentések",
    btnNewReport: "🚨 Új bejelentést teszek",
    btnMyCases: "📋 Saját ügyeim & Vállalásaim",
    btnInfo: "ℹ️ Információk & Elérhetőségek",
    backToMenu: "← Vissza a főmenübe",

    // Aktív bejelentések & Saját ügyek
    activeReportsTitle: "Bejelentések",
    activeReportsSub: "Kövesd az ügyek állapotát vagy vállalj mentést!",
    toggleMap: "🗺️ Térkép",
    toggleList: "📋 Lista nézet",
    searchPlaceholder: "🔍 Keresés fajta, megjegyzés vagy tel. alapján...",
    myCasesTitle: "📋 Saját Ügyeim",
    myCasesSub: "Az általad tett és az elvállalt bejelentések:",
    noReportsFound: "Nincs a keresésnek megfelelő bejelentés.",
    noPhone: "📞 Telefonszám nincs megadva",
    callBtn: "📞 Hívás",
    callOrgBtn: "📞 HÍVÁS MOST",
    openMapLink: "📍 Pontos helyszín megnyitása Google Maps-en",
    solutionLabel: "💬 Megoldás:",
    noNotes: "Nincs megjegyzés",
    shareBtn: "📲 Bejelentés megosztása",
    deleteBtn: "🗑️ Bejelentés törlése",
    myCreatedRole: "✍️ Általad bejelentve",
    myTakenRole: "🚗 Általad elvállalva",
    noMyCases: "Még nincs saját bejelentésed vagy elvállalt ügyed.",

    // Státuszok & Akciógombok
    statusNew: "ÚJ",
    statusInProg: "FOLYAMATBAN",
    statusSolved: "MEGOLDVA",
    statusNewBadge: "🚨 ÚJ BEJELENTÉS",
    statusInProgBadge: "🚗 FOLYAMATBAN (Úton)",
    btnTake: "🚗 Úton vagyok / Elvállalom",
    btnSolved: "✅ Úgy látom, megoldva!",
    resolvePlaceholder: "Pl.: A cica a Váci Állatkórházba került...",
    btnCancelTake: "❌ Mégsem tudom vállalni",
    statusTakenByOther: "🚗 Valaki már úton van erre az ügyre",
    statusCaseClosed: "✅ Ez az ügy lezárult",
    btnReopen: "↩️ Újrakiadás / Visszaállítás",
    deleteConfirmQuestion: "Biztosan törlöd ezt a bejelentést?",
    btnYesDelete: "IGEN, TÖRÖLD",
    btnCancel: "Mégsem",
    resolveInputLabel: "Megoldás részletei (opcionális):",
    btnSaveResolve: "✅ Mentés & Lezárás",

    // Új bejelentés (1, 2, 3. lépés)
    step1Badge: "1 / 3 LÉPÉS",
    step1Title: "Állatfajta",
    step1Sub: "Milyen állatról van szó?",
    typeDog: "Kutya",
    typeCat: "Macska",
    typeWild: "Vadállat",
    typeOther: "Egyéb",
    nextBtn: "Tovább →",
    backBtn: "← Vissza",
    step2Badge: "2 / 3 LÉPÉS",
    step2Title: "Helyszín & Fotó",
    step2Sub: "Hol láttad az állatot? Csatolhatsz fotót is.",
    gpsBtn: "📍 Saját pozíció lekérése (GPS)",
    mapSelectBtn: "🗺️ Helyszín kiválasztása a térképen",
    mapMarkerPopup: "A bejelentés helye (Húzható!)",
    uploadPhotoText: "Fotó készítése / Csatolása",
    removePhotoText: "❌ Fotó eltávolítása",
    searchAddressPlaceholder: "Cím keresése (pl. Budapest, Váci út)",
    locationDefaultText: "Válassz a fenti lehetőségek közül!",
    step3Badge: "3 / 3 LÉPÉS",
    step3Title: "Részletek & Küldés",
    step3Sub: "Megjegyzés és elérhetőség (opcionális)",
    notesPlaceholder: "Pl.: Félős, a bokor alatt lapul, kék nyakörv van rajta...",
    phonePlaceholder: "Telefonszámod (opcionális)",
    submitBtn: "🚨 BEJELENTÉS KÜLDÉSE",
    mapMarkerPopup: "A bejelentés helye (Húzható!)",
    resolvePlaceholder: "Pl.: A cica a Váci Állatkórházba került...",
    gpsSearching: "⏳ GPS pozíció keresése...",
    gpsNotSupported: "A böngésződ nem támogatja a GPS-t. Használd a manuális választást!",
    gpsSuccess: "✅ Pozíció rögzítve! (Áthelyezhető)",
    gpsError: "❌ Nem sikerült lekérni a helyzeted. Kattints a manuális választásra!",
    manualMapHint: "📍 Kattints a térképre vagy húzd a gombostűt a pontos helyszínre!",
    locationSaved: "📍 Új helyszín rögzítve!",
    searchAddressError: "⚠️ Kérlek, írj be egy címet a kereséshez!",
    searchSearching: "⏳ Keresés folyamatban...",
    searchFound: "✅ Helyszín megtalálva: ",
    searchNotFound: "❌ Nem találtunk ilyen címet. Próbáld meg máshogy írni!",
    searchNetworkError: "❌ Hiba történt a keresés során. Ellenőrizd az internetkapcsolatot!",
    uploadSuccess: "Fotó sikeresen csatolva!",

    // Információk, Szűrők & Elsősegély
    step4Title: "ℹ️ Információk & Útmutatók",
    step4Sub: "Szervezetek elérhetőségei és teendők vészhelyzet esetén:",
    toggleOrganizations: "📞 Szervezetek",
    toggleGuide: "💡 Elsősegély kisokos",
    searchOrgPlaceholder: "🔍 Keresés név, város vagy kulcsszó alapján...",
    catAll: "Minden kategória",
    catShelter: "🐕 Menhelyek & Egyesületek",
    catVet: "🏥 Állatkórházak & Rendelők",
    catAuth: "🏛️ Hatóságok & Polgárőrség",
    catWild: "🦅 Vadmentés",
    ctyAll: "Összes megye / régió",
    ctyPest: "Pest megye",
    noOrgFound: "❌ Nincs a keresésnek megfelelő szervezet.",

    // Modal
    modalHint: "Görgess vagy húzd az ujjad a zoomoláshoz",

    // Útmutatók (Elsősegély kisokos)
    g1Title: "Madárfióka (Csupasz vagy tollas?)",
    g1Body: `<p><b>1. Csupasz / Pehelytollas fióka:</b> Még nem tudja elhagyni a fészket. Ha megtalálod a fészket, <b>tedd vissza!</b> (Tévhit: a madarak nem hagyják el a fiókát az emberi szag miatt). Ha a fészek megsemmisült, tegyed egy kis bélelt dobozba és rögzítsd a fára.</p>
             <p><b>2. Tollas fióka (Fészekhagyó):</b> A rigók, cinkék, baglyok fiókái természetes módon elhagyják a fészket, mielőtt röpképesek lennének. A szüleik a földön is etetik őket! <b>Ne vidd el!</b> Csak akkor nyúlj hozzá, ha közvetlen veszélyben van (úttest, macska) – ekkor tedd fel a legközelebbi bokor/fa ágára.</p>
             <p><b>⚠️ Szigorúan TILOS:</b> Fecskendőből vizet vagy tejet nyomni a csőrébe! A légcsőnyílásuk a nyelvük mögött van, így pillanatok alatt megfulladnak tőle.</p>`,
    
    g2Title: "Felnőtt, sérült madár",
    g2Body: `<p><b>1. Ablaknak repült / Sokkos madár:</b> Gyakran csak agyrázkódása van. Dobj rá egy törölközőt, óvatosan tedd egy zárt, szellőzőnyílásokkal ellátott <b>kartondobozba</b>, és tedd csendes, sötét helyre. 1-2 óra múlva nyisd ki a dobozt a szabadban – ha magához tért, el fog repülni.</p>
             <p><b>2. Lógó szárny, vérzés, törés:</b> Helyezd sötét kartondobozba (a sötétség csökkenti a sokkot). A doboz aljára tegyél papírtörlőt.</p>
             <p><b>⚠️ Fontos:</b> Ne adj neki ételt és vizet is maximum egy pici kupakban vagy tálkában tegyél be mellé! Hívd a legközelebbi Nemzeti Parkot vagy Mályi/Rákosmenti Madármentőket.</p>`,

    g3Title: "Sérült vagy elütött macska",
    g3Body: `<p><b>1. Védekezés:</b> A fájdalmat érző macska pánikba esik, súlyos harapott/karmolt sebet okozhat! Használj vastag pokrócot vagy munkavédelmi kesztyűt.</p>
             <p><b>2. "Burrito" módszer:</b> Terítsd rá a pokrócot, és szorosan tekerd be a testét és a lábait, így biztonságosan fel tudod emelni anélkül, hogy megkarcolna vagy kárt tenne magában.</p>
             <p><b>3. Szállítás:</b> Tedd zárt hordozóba vagy dobozba. Ha sokkos állapotban van (kihűlés fenyegeti), tegyél mellé törölközőbe tekert melegvizes palackot.</p>`,

    g4Title: "Talált vagy elütött kutya",
    g4Body: `<p><b>1. Megközelítés:</b> Lassan, guggolva, oldalról közelíts! Ne nézz közvetlenül a szemébe, és beszélj hozzá halkan. Ne tegyél hirtelen mozdulatot.</p>
             <p><b>2. Sérült kutya mozgatása:</b> A fájdalom miatt a legszelídebb kutya is kaphat maga felé. Ha emelned kell, pléd segítségével hordágyként mozgassátok. Ha szükséges, pórázzal vagy gézzel óvatosan kösd át a pofáját a szállítás idejére.</p>
             <p><b>3. Ingyenes chipolvasás:</b> A legtöbb <b>MOL benzinkúton</b> és minden állatorvosnál díjmentesen leolvassák a mikrochipet a gazda értesítéséhez.</p>`,

    g5Title: "Sünök & Denevérek",
    g5Body: `<p><b>🦔 Sün nappal a szabadban:</b> A sün éjszakai állat. Ha nappal nyílt terepen kóborol, billeg vagy elterül, az szinte biztosan betegséget vagy sérülést jelez. Kesztyűvel tedd magas falu dobozba.</p>
             <p><b>🦔 Kicsi sün télen:</b> Késő ősszel/télen a 400-500 gramm alatti sünök nem tudnak áttelelni, segítségre van szükségük!</p>
             <p><b>🦇 Denevér a lakásban/földön:</b> Védett állat! <b>Soha ne nyúlj hozzá puszta kézzel!</b> Teríts rá egy rongyot, tedd dobozba és értesítsd a helyi Nemzeti Park Igazgatóságot.</p>`,

    g6Title: "Nagyvadak (Őz, Róka, Vaddisznó)",
    g6Body: `<p><b>1. Saját biztonság:</b> Sérült őzhöz, vaddisznóhoz ne menj közel! A patájukkal és agyarukkal életveszélyes sérülést okozhatnak.</p>
             <p><b>2. Közúti baleset esetén:</b> Kapcsold be a vészvillogót, tegyed ki az elakadásjelző háromszöget. Hívd a <b>112-es segélyhívót</b> – ők értesítik a területileg illetékes vadásztársaságot.</p>
             <p><b>3. Autópályán:</b> Az autópálya-kezelőt vagy a 112-t értesítsd, ne szállj ki az autóból a leállósávban sem védőfelszerelés nélkül!</p>`
  },
  en: {
    // Main Menu
    appTitle: "Animal Rescue Portal",
    appSub: "Emergency Assistance & Coordination",
    btnActiveReports: "🗺️ Reports",
    btnNewReport: "🚨 Submit New Report",
    btnMyCases: "📋 My Cases & Commitments",
    btnInfo: "ℹ️ Information & Contacts",
    backToMenu: "← Back to Main Menu",

    // Active Reports & My Cases
    activeReportsTitle: "Reports",
    activeReportsSub: "Track report statuses or volunteer for a rescue!",
    toggleMap: "🗺️ Map",
    toggleList: "📋 List View",
    searchPlaceholder: "🔍 Search by species, notes, or phone...",
    myCasesTitle: "📋 My Cases",
    myCasesSub: "Reports created or undertaken by you:",
    noReportsFound: "No reports matching your search.",
    noPhone: "📞 Phone number not provided",
    callBtn: "📞 Call",
    callOrgBtn: "📞 CALL NOW",
    openMapLink: "📍 Open exact location on Google Maps",
    solutionLabel: "💬 Resolution:",
    noNotes: "No additional notes",
    shareBtn: "📲 Share Report",
    deleteBtn: "🗑️ Delete Report",
    myCreatedRole: "✍️ Reported by you",
    myTakenRole: "🚗 Undertaken by you",
    noMyCases: "You have no created or undertaken reports yet.",

    // Statuses & Action Buttons
    statusNew: "NEW",
    statusInProg: "IN PROGRESS",
    statusSolved: "RESOLVED",
    statusNewBadge: "🚨 NEW REPORT",
    statusInProgBadge: "🚗 IN PROGRESS (On the way)",
    btnTake: "🚗 On my way / Volunteer",
    btnSolved: "✅ I consider it resolved!",
    btnCancelTake: "❌ Cancel my volunteer status",
    statusTakenByOther: "🚗 Someone is already on their way",
    resolvePlaceholder: "E.g., The cat was brought to the vet...",
    statusCaseClosed: "✅ This case is closed",
    btnReopen: "↩️ Reopen / Reset Case",
    deleteConfirmQuestion: "Are you sure you want to delete this report?",
    btnYesDelete: "YES, DELETE",
    btnCancel: "Cancel",
    resolveInputLabel: "Resolution details (optional):",
    btnSaveResolve: "✅ Save & Close",

    // New Report Steps
    step1Badge: "STEP 1 / 3",
    step1Title: "Animal Species",
    step1Sub: "What kind of animal is it?",
    typeDog: "Dog",
    typeCat: "Cat",
    typeWild: "Wild Animal",
    typeOther: "Other",
    nextBtn: "Next →",
    backBtn: "← Back",
    step2Badge: "STEP 2 / 3",
    step2Title: "Location & Photo",
    step2Sub: "Where did you see the animal? You can attach a photo.",
    gpsBtn: "📍 Get My Current Location (GPS)",
    mapMarkerPopup: "Report location (Draggable!)",
    mapSelectBtn: "🗺️ Pick Location on Map",
    uploadPhotoText: "Take Photo / Attach",
    removePhotoText: "❌ Remove Photo",
    searchAddressPlaceholder: "Search address (e.g. Budapest, Váci út)",
    locationDefaultText: "Choose from the options above!",
    step3Badge: "STEP 3 / 3",
    step3Title: "Details & Submit",
    step3Sub: "Notes and contact info (optional)",
    notesPlaceholder: "E.g., Scared, hiding under bushes, blue collar...",
    phonePlaceholder: "Your phone number (optional)",
    submitBtn: "🚨 SUBMIT REPORT",
    mapMarkerPopup: "Report location (Draggable!)",
    resolvePlaceholder: "E.g., The cat was brought to the vet...",
    gpsSearching: "⏳ Searching GPS location...",
    gpsNotSupported: "GPS is not supported by your browser. Use manual selection!",
    gpsSuccess: "✅ Location saved! (Draggable)",
    gpsError: "❌ Could not retrieve GPS location. Please select manually!",
    manualMapHint: "📍 Click on the map or drag the pin to the exact location!",
    locationSaved: "📍 New location saved!",
    searchAddressError: "⚠️ Please enter an address to search!",
    searchSearching: "⏳ Searching...",
    searchFound: "✅ Location found: ",
    searchNotFound: "❌ Address not found. Try typing it differently!",
    searchNetworkError: "❌ Error during search. Check your internet connection!",
    uploadSuccess: "Photo attached successfully!",

    // Info, Filters & First Aid
    step4Title: "ℹ️ Info & Guides",
    step4Sub: "Contacts for rescue organizations and emergency guides:",
    toggleOrganizations: "📞 Organizations",
    toggleGuide: "💡 First Aid Guide",
    searchOrgPlaceholder: "🔍 Search by name, city, or keyword...",
    catAll: "All Categories",
    catShelter: "🐕 Shelters & Associations",
    catVet: "🏥 Hospitals & Vets",
    catAuth: "🏛️ Authorities & Police",
    catWild: "🦅 Wildlife Rescue",
    ctyAll: "All counties / regions",
    ctyPest: "Pest county",
    noOrgFound: "❌ No organizations matching your search.",

    // Modal
    modalHint: "Pinch or scroll to zoom",

    // Guides (First Aid)
    g1Title: "Bird Chick (Fledged or Unfledged?)",
    g1Body: `<p><b>1. Naked / Downy Chick:</b> Cannot leave the nest yet. If you find the nest, <b>put it back!</b> (Myth: birds do not abandon chicks due to human scent). If destroyed, put it in a lined box and attach to the tree.</p>
             <p><b>2. Fledged Chick:</b> Fledglings naturally leave the nest before being able to fly well. Parents feed them on the ground! <b>Do not remove them!</b> Only intervene if in immediate danger (road, cat) – place onto a nearby branch.</p>
             <p><b>⚠️ Strictly FORBIDDEN:</b> Squirt water or milk into the beak! Their airway is behind the tongue; they can suffocate instantly.</p>`,

    g2Title: "Adult, Injured Bird",
    g2Body: `<p><b>1. Window Collision / Shocked:</b> Often just a concussion. Throw a towel over it, place gently in a closed, ventilated <b>cardboard box</b> in a quiet, dark spot. Open outside after 1-2 hours – if recovered, it will fly away.</p>
             <p><b>2. Drooping Wing, Bleeding, Fracture:</b> Keep in a dark box to reduce shock. Line the bottom with paper towels.</p>
             <p><b>⚠️ Important:</b> Do not give food/water except a tiny cap. Call a local Wildlife Rescue center!</p>`,

    g3Title: "Injured or Hit Cat",
    g3Body: `<p><b>1. Protection:</b> A cat in pain will panic and can inflict severe bites/scratches! Use a thick blanket or heavy gloves.</p>
             <p><b>2. 'Burrito' Method:</b> Wrap firmly in a blanket to immobilize legs so you can safely lift it without injury to either party.</p>
             <p><b>3. Transport:</b> Place in a secure carrier or box. Keep warm with a wrapped hot water bottle if in shock.</p>`,

    g4Title: "Found or Injured Dog",
    g4Body: `<p><b>1. Approach:</b> Move slowly, crouch, approach from the side. Avoid direct eye contact and speak softly.</p>
             <p><b>2. Handling Injured Dogs:</b> Even gentle dogs may bite when in severe pain. Move using a blanket as a stretcher. Muzzle gently with gauze if necessary.</p>
             <p><b>3. Free Microchip Scan:</b> Available at most <b>MOL gas stations</b> and all veterinary clinics to contact the owner.</p>`,

    g5Title: "Hedgehogs & Bats",
    g5Body: `<p><b>🦔 Hedgehog in daylight:</b> Nocturnal animals. Roaming in daylight indicates illness/injury. Put in a high-walled box using gloves.</p>
             <p><b>🦔 Small Hedgehogs in winter:</b> Under 400-500g in late autumn cannot survive hibernation without assistance.</p>
             <p><b>🦇 Bat indoors/ground:</b> Protected species! <b>Never touch with bare hands!</b> Cover with a cloth, box it, and call local Park Authorities.</p>`,

    g6Title: "Large Wildlife (Deer, Fox, Boar)",
    g6Body: `<p><b>1. Personal Safety:</b> Keep distance from injured deer or wild boars! Hooves and tusks cause severe injury.</p>
             <p><b>2. Road Accidents:</b> Turn hazard lights on, set up triangle. Call <b>112 Emergency</b> – they alert local hunting associations.</p>
             <p><b>3. Highways:</b> Call 112 or highway operators; stay safe inside your vehicle.</p>`
  }
};

let currentLang = localStorage.getItem("allatmento_lang") || "hu";

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("allatmento_lang", lang);
  
  const langBtn = document.getElementById("langToggleBtn");
  if (langBtn) langBtn.innerText = lang === "hu" ? "🇬🇧 EN" : "🇭🇺 HU";

  const t = translations[lang];

  // Elemek szövegeinek tömeges frissítése
  const map = {
    "appTitleText": t.appTitle,
    "appSubText": t.appSub,
    "btnActiveReportsText": t.btnActiveReports,
    "btnNewReportText": t.btnNewReport,
    "btnMyCasesText": t.btnMyCases,
    "btnInfoText": t.btnInfo,
    "activeReportsTitle": t.activeReportsTitle,
    "activeReportsSub": t.activeReportsSub,
    "toggleMapBtn": t.toggleMap,
    "toggleListBtn": t.toggleList,
    "myCasesTitle": t.myCasesTitle,
    "myCasesSub": t.myCasesSub,
    "step1Badge": t.step1Badge,
    "step1Title": t.step1Title,
    "step1Sub": t.step1Sub,
    "typeDog": t.typeDog,
    "typeCat": t.typeCat,
    "typeWild": t.typeWild,
    "typeOther": t.typeOther,
    "tovabb1": t.nextBtn,
    "step2Badge": t.step2Badge,
    "step2Title": t.step2Title,
    "step2Sub": t.step2Sub,
    "gpsButton": t.gpsBtn,
    "manualLocationBtn": t.mapSelectBtn,
    "eredmeny": t.locationDefaultText,
    "uploadLabelText": t.uploadPhotoText,
    "removePhotoBtn": t.removePhotoText,
    "vissza1": t.backBtn,
    "tovabb2": t.nextBtn,
    "step3Badge": t.step3Badge,
    "step3Title": t.step3Title,
    "step3Sub": t.step3Sub,
    "vissza2": t.backBtn,
    "kuldes": t.submitBtn,
    "step4Title": t.step4Title,
    "step4Sub": t.step4Sub,
    "toggleSzervezetekBtn": t.toggleOrganizations,
    "toggleUtmutatoBtn": t.toggleGuide,
    "optCatAll": t.catAll,
    "optCatShelter": t.catShelter,
    "optCatVet": t.catVet,
    "optCatAuth": t.catAuth,
    "optCatWild": t.catWild,
    "optCtyAll": t.ctyAll,
    "optCtyPest": t.ctyPest,
    "modalHintText": t.modalHint,
    "g1Title": t.g1Title,
    "g2Title": t.g2Title,
    "g3Title": t.g3Title,
    "g4Title": t.g4Title,
    "g5Title": t.g5Title,
    "g6Title": t.g6Title
  };

  for (const [id, text] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  }

  // HTML tartalmak frissítése (útmutatók)
  const htmlMap = {
    "g1Body": t.g1Body,
    "g2Body": t.g2Body,
    "g3Body": t.g3Body,
    "g4Body": t.g4Body,
    "g5Body": t.g5Body,
    "g6Body": t.g6Body
  };

  for (const [id, htmlText] of Object.entries(htmlMap)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = htmlText;
  }

  // "Vissza a főmenübe" gombok egységes fordítása
  document.querySelectorAll(".backToMenuBtn").forEach(btn => {
    btn.innerText = t.backToMenu;
  });

  // Placeholder mezők fordítása
  const bejelentesKereso = document.getElementById("bejelentesKeresoInput");
  if (bejelentesKereso) bejelentesKereso.placeholder = t.searchPlaceholder;

  const szervezetKereso = document.getElementById("szervezetKeresoInput");
  if (szervezetKereso) szervezetKereso.placeholder = t.searchOrgPlaceholder;

  const mapSearchInput = document.getElementById("mapSearchInput");
  if (mapSearchInput) mapSearchInput.placeholder = t.searchAddressPlaceholder;

  const megjegyzes = document.getElementById("megjegyzes");
  if (megjegyzes) megjegyzes.placeholder = t.notesPlaceholder;

  const telefon = document.getElementById("telefon");
  if (telefon) telefon.placeholder = t.phonePlaceholder;

  // Dinamikus listák újrarendezése az új nyelven
  if (typeof szurEsKirajzolBejelentesek === "function") szurEsKirajzolBejelentesek();
  if (typeof szurEsKirajzolSzervezetek === "function") szurEsKirajzolSzervezetek();
  if (typeof betoltSajatUgyek === "function") betoltSajatUgyek();

  // Ha a térképes marker már létezik, frissíti annak szövegét is
  if (typeof userMarker !== "undefined" && userMarker) {
    userMarker.setPopupContent(t.mapMarkerPopup);
  }
}

// Gomb eseménykezelő
const langToggleBtn = document.getElementById("langToggleBtn");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => {
    const newLang = currentLang === "hu" ? "en" : "hu";
    updateLanguage(newLang);
  });
}

// Indításkor automata nyelv frissítés
document.addEventListener("DOMContentLoaded", () => {
  updateLanguage(currentLang);
});

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
  const t = translations[currentLang];

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

        const statuszText = statusz === "uj" ? t.statusNewBadge : t.statusInProgBadge;

        const popupContent = `
          <strong style="font-size:14px;">${adat.fajta}</strong><br>
          <span class="status-badge ${statusz}" style="display:inline-block; margin: 4px 0;">${statuszText}</span><br>
          <span style="color:#64748b; font-size:12px;">${adat.megjegyzes || t.noNotes}</span><br>
          <span style="font-size:12px;">📞 ${adat.telefon || t.noPhone}</span>
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

  const t = translations[currentLang];
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
    bejelentesekLista.innerHTML = `<p style="color: #64748b; text-align: center; margin-top: 15px;">${t.noReportsFound}</p>`;
    return;
  }

  szurtBejelentesek.forEach((elem) => {
    bejelentesekLista.innerHTML += createReportCardHtml(elem.id, elem.adat);
  });
}

if (bejelentesKeresoInput) {
  bejelentesKeresoInput.addEventListener("input", szurEsKirajzolBejelentesek);
}

// DINAMIKUS KÁRTYA GENERÁLÓ (FORDÍTÁSSAL)
function createReportCardHtml(id, adat) {
  const t = translations[currentLang];
  const statusz = adat.statusz || "uj";
  
  const statuszLabel = statusz === "uj" ? t.statusNew : (statusz === "folyamatban" ? t.statusInProg : t.statusSolved);
  const kepHtml = adat.fotoUrl ? `<img src="${adat.fotoUrl}" class="popup-img" onclick="openImageModal('${adat.fotoUrl}')" style="margin-bottom:8px;">` : '';

  const tisztitottFajta = escapeHtml(adat.fajta);
  const tisztitottMegjegyzes = escapeHtml(adat.megjegyzes);
  const tisztitottTelefon = escapeHtml(adat.telefon);
  const tisztitottLezaras = escapeHtml(adat.lezarasMegjegyzes);

  let idopontSzoveg = "";
  if (adat.idopont && adat.idopont.toDate) {
    const d = adat.idopont.toDate();
    const dateLoc = currentLang === "en" ? "en-US" : "hu-HU";
    idopontSzoveg = `🕒 ${d.toLocaleDateString(dateLoc)} ${d.toLocaleTimeString(dateLoc, {hour: '2-digit', minute:'2-digit'})}`;
  }

  const hivasGombHtml = tisztitottTelefon 
    ? `<a href="tel:${tisztitottTelefon}" class="report-action-btn" style="background:#10b981; color:white; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; margin-top:8px; font-weight:bold;">${t.callBtn} (${tisztitottTelefon})</a>`
    : `<p style="font-size:12px; color:#64748b; margin:4px 0;">${t.noPhone}</p>`;

  const terKepGombHtml = (adat.lat && adat.lon)
    ? `<a href="https://www.google.com/maps?q=${adat.lat},${adat.lon}" target="_blank" style="font-size:12px; color:#2563eb; text-decoration:underline; display:block; margin-top:4px;">${t.openMapLink}</a>`
    : '';

  const lezarasHtml = tisztitottLezaras 
    ? `<p style="color:#047857; background:#ecfdf5; padding:6px 8px; border-radius:6px; border:1px solid #a7f3d0; font-size:12px; margin-top:6px; word-break:break-word;"><b>${t.solutionLabel}</b> ${tisztitottLezaras}</p>` 
    : '';

  const torlesGombHtml = (adat.createrId === currentUserId) 
    ? `
      <div class="delete-box-container" style="margin-top:8px;">
        <button type="button" class="report-action-btn btn-delete" onclick="showDeleteConfirm('${id}', event)">${t.deleteBtn}</button>
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
          <p style="margin:4px 0;">📝 ${tisztitottMegjegyzes || t.noNotes}</p>
          ${terKepGombHtml}
          ${idopontSzoveg ? `<p style="font-size:11px; color:#94a3b8; margin-top:4px;">${idopontSzoveg}</p>` : ''}
          ${hivasGombHtml}
          ${lezarasHtml}
        </div>
        ${getStatusButtonHtml(id, statusz, adat.vallaloId)}
        <button type="button" class="report-action-btn btn-outline" style="margin-top:6px; color:#1877f2; border-color:#cbd5e1; font-weight:bold;" onclick="shareReportById('${id}', event)">
          ${t.shareBtn}
        </button>
        ${torlesGombHtml}
      </div>
    </div>
  `;
}

// BÁRMELYIK BEJELENTÉS MEGOSZTÁSA
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

// AKCIÓGOMB GENERÁLÓ LOGIKA (FORDÍTÁSSAL)
function getStatusButtonHtml(id, statusz, vallaloId) {
  const t = translations[currentLang];
  if (statusz === "uj") {
    return `
      <div class="status-action-box" data-action-id="${id}">
        <button type="button" class="report-action-btn btn-action-take" onclick="changeStatus('${id}', 'folyamatban', event)">${t.btnTake}</button>
      </div>`;
  } else if (statusz === "folyamatban") {
    if (vallaloId === currentUserId) {
      return `
        <div class="status-action-box" data-action-id="${id}">
          <button type="button" class="report-action-btn btn-action-solve" onclick="showResolveInput('${id}', event)">${t.btnSolved}</button>
          <button type="button" class="report-action-btn btn-outline" style="margin-top:5px; color:#ef4444;" onclick="changeStatus('${id}', 'uj', event)">${t.btnCancelTake}</button>
        </div>`;
    } else {
      return `<p style="font-size:11px; color:#d97706; margin-top:6px; text-align:center;">${t.statusTakenByOther}</p>`;
    }
  } else {
    return `
      <p style="font-size:11px; color:#10b981; margin-top:6px; text-align:center;">${t.statusCaseClosed}</p>
      <button type="button" class="report-action-btn btn-outline" style="font-size:11px; padding:4px;" onclick="changeStatus('${id}', 'uj', event)">${t.btnReopen}</button>
    `;
  }
}

// LEZÁRÁSI MEGJEGYZÉS BEVITELI MEZŐ MEGJELENÍTÉSE
window.showResolveInput = function(docId, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  const t = translations[currentLang];
  const btn = event.target;
  const box = btn.closest('.status-action-box');

  if (box) {
    box.innerHTML = `
      <div style="background:#f0fdf4; padding:10px; border-radius:8px; border:1px solid #bbf7d0; margin-top:6px; text-align:left;">
        <label style="font-size:12px; font-weight:bold; color:#166534; display:block; margin-bottom:6px;">${t.resolveInputLabel}</label>
        <textarea id="resolveInput_${docId}" placeholder="${t.resolvePlaceholder}" style="width:100%; min-height:60px; font-size:13px; padding:8px; margin:0 0 8px 0; border:1px solid #86efac; border-radius:6px; box-sizing:border-box; font-family:inherit; resize:vertical;"></textarea>
        <div style="display:flex; gap:8px;">
          <button type="button" class="report-action-btn btn-action-solve" style="padding:10px; font-size:12px; margin:0; flex:2; width:auto; white-space:nowrap;" onclick="submitResolve('${docId}', event)">${t.btnSaveResolve}</button>
          <button type="button" class="report-action-btn btn-outline" style="padding:10px; font-size:12px; margin:0; flex:1; width:auto; white-space:nowrap;" onclick="cancelResolve('${docId}', event)">${t.btnCancel}</button>
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
  const t = translations[currentLang];
  const btn = event.target;
  const box = btn.closest('.status-action-box');
  if (box) {
    box.innerHTML = `
      <button type="button" class="report-action-btn btn-action-solve" onclick="showResolveInput('${docId}', event)">${t.btnSolved}</button>
      <button type="button" class="report-action-btn btn-outline" style="margin-top:5px; color:#ef4444;" onclick="changeStatus('${docId}', 'uj', event)">${t.btnCancelTake}</button>
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

  const t = translations[currentLang];
  const btn = event.target;
  const box = btn.closest('.delete-box-container');

  if (box) {
    box.innerHTML = `
      <div style="background:#fef2f2; padding:8px; border-radius:8px; border:1px solid #fecaca; text-align:center;">
        <span style="font-size:12px; color:#ef4444; font-weight:bold; display:block; margin-bottom:6px;">${t.deleteConfirmQuestion}</span>
        <div style="display:flex; gap:6px;">
          <button type="button" class="report-action-btn btn-danger" style="padding:6px; font-size:12px;" onclick="deleteReport('${docId}', event)">${t.btnYesDelete}</button>
          <button type="button" class="report-action-btn btn-outline" style="padding:6px; font-size:12px;" onclick="cancelDelete('${docId}', event)">${t.btnCancel}</button>
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

  const t = translations[currentLang];
  const btn = event.target;
  const box = btn.closest('.delete-box-container');

  if (box) {
    box.innerHTML = `<button type="button" class="report-action-btn btn-delete" onclick="showDeleteConfirm('${docId}', event)">${t.deleteBtn}</button>`;
  }
};

// FIRESTORE VÉGLEGES TÖRLESE
window.deleteReport = function(docId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const t = translations[currentLang];
  const elemek = document.querySelectorAll(`[data-report-id="${docId}"]`);
  elemek.forEach(elem => elem.remove());

  db.collection("bejelentesek").doc(docId).delete()
    .then(() => {
      console.log("Dokumentum törölve!");
      const sajatLista = document.getElementById("sajatUgyekLista");
      if (sajatLista && sajatLista.children.length === 0) {
        sajatLista.innerHTML = `<p style="color: #64748b;">${t.noMyCases}</p>`;
      }
    })
    .catch((error) => console.error("Hiba:", error));
};

// === SAJÁT ÜGYEIM LEKÉRDEZÉSE ===
let sajatUgyekUnsubscribe = null;

function betoltSajatUgyek() {
  const sajatLista = document.getElementById("sajatUgyekLista");
  const t = translations[currentLang];
  sajatLista.innerHTML = '<p style="color: #64748b;">⏳ Betöltés...</p>';

  if (sajatUgyekUnsubscribe) sajatUgyekUnsubscribe();

  sajatUgyekUnsubscribe = db.collection("bejelentesek").onSnapshot((snapshot) => {
    sajatLista.innerHTML = "";
    let talalat = false;

    snapshot.docs.forEach((doc) => {
      const adat = doc.data();
      const id = doc.id;

      if (adat.createrId === currentUserId || adat.vallaloId === currentUserId) {
        talalat = true;
        const szerep = adat.createrId === currentUserId ? t.myCreatedRole : t.myTakenRole;
        
        sajatLista.innerHTML += `
          <div style="margin-bottom: 4px; font-size:12px; font-weight:bold; color:#8b5cf6; text-align:left;">${szerep}</div>
          ${createReportCardHtml(id, adat)}
        `;
      }
    });

    if (!talalat) {
      sajatLista.innerHTML = `<p style="color: #64748b;">${t.noMyCases}</p>`;
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
  const t = translations[currentLang];
  const file = this.files[0];
  const uploadLabel = document.querySelector(".custom-file-upload");
  const uploadIcon = document.querySelector(".upload-icon");

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      imagePreviewBox.style.display = "block";
      
      uploadIcon.innerText = "✅";
      uploadLabelText.innerText = t.uploadSuccess;
      uploadLabel.classList.add("uploaded");
    };
    reader.readAsDataURL(file);
  }
});

removePhotoBtn.addEventListener("click", function() {
  const uploadLabel = document.querySelector(".custom-file-upload");
  const uploadIcon = document.querySelector(".upload-icon");
  const t = translations[currentLang];

  fotoInput.value = "";
  previewImage.src = "";
  imagePreviewBox.style.display = "none";
  
  uploadIcon.innerText = "📷";
  uploadLabelText.innerText = t.uploadPhotoText;
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
  const t = translations[currentLang];
  const keresoSzo = szervezetKeresoInput ? szervezetKeresoInput.value.toLowerCase().trim() : "";
  const kivalasztottKat = document.getElementById("kategoriaValaszto") ? document.getElementById("kategoriaValaszto").value : "Összes";
  
  szervezetekLista.innerHTML = "";

  const szurtLista = osszesSzervezetMemoria.filter((szervezet) => {
    const nev = (szervezet.nev || "").toLowerCase();
    const cim = (szervezet.cim || "").toLowerCase();
    const megye = (szervezet.megye || "").toLowerCase();
    const kategoria = szervezet.kategoria || "";

    const matcheliKeresest = nev.includes(keresoSzo) || cim.includes(keresoSzo) || megye.includes(keresoSzo);
    let matcheliKategoriat = (kivalasztottKat === "Összes") || (kategoria === kivalasztottKat);

    return matcheliKeresest && matcheliKategoriat;
  });

  if (szurtLista.length === 0) {
    szervezetekLista.innerHTML = `<p style="color: #ef4444; text-align: center; margin-top: 15px;">${t.noOrgFound}</p>`;
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
      kategoriaClass = "menhely"; ikonosNev = "🐕 " + szervezet.nev;
    }

    szervezetekLista.innerHTML += `
      <div class="info-card ${kategoriaClass}">
        <h3>${ikonosNev}</h3>
        <p>📍 ${szervezet.cim || szervezet.megye}</p>
        <p>📞 ${szervezet.telefon}</p>
        <a href="tel:${szervezet.telefon}" class="call-btn">${t.callOrgBtn}</a>
      </div>
    `;
  });
}

// Eseménykezelő a kategoriaValaszto-hoz
const kategoriaValaszto = document.getElementById("kategoriaValaszto");
if (kategoriaValaszto) {
  kategoriaValaszto.addEventListener("change", szurEsKirajzolSzervezetek);
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
    const t = translations[currentLang];
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
    document.getElementById("eredmeny").innerText = t.locationDefaultText;
  });
});

// === HELYSZÍN MEGADÁSA (GPS VAGY MANUÁLIS TÉRKEP) ===
document.getElementById("gpsButton").addEventListener("click", function() {
  const t = translations[currentLang];
  const eredmeny = document.getElementById("eredmeny");
  eredmeny.innerHTML = t.gpsSearching;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sikeresKereses, hibaKereses);
  } else {
    eredmeny.innerHTML = t.gpsNotSupported;
  }
});

document.getElementById("manualLocationBtn").addEventListener("click", function() {
  const t = translations[currentLang];
  if (!pontosLat || !pontosLon) {
    pontosLat = 47.4979;
    pontosLon = 19.0402;
  }
  document.getElementById("eredmeny").innerHTML = t.manualMapHint;
  megjelenitBejelentesTerkep(pontosLat, pontosLon, 12);
});

function sikeresKereses(pozicio) {
  const t = translations[currentLang];
  pontosLat = pozicio.coords.latitude;
  pontosLon = pozicio.coords.longitude;
  document.getElementById("eredmeny").innerHTML = t.gpsSuccess;
  megjelenitBejelentesTerkep(pontosLat, pontosLon, 16);
}

function hibaKereses() {
  const t = translations[currentLang];
  document.getElementById("eredmeny").innerHTML = t.gpsError;
}

function megjelenitBejelentesTerkep(lat, lon, zoomLevel) {
  const t = translations[currentLang];
  const mapDiv = document.getElementById("map");
  document.getElementById("mapSearchContainer").style.display = "flex";
  mapDiv.classList.add("mutasd");

  if (!userMap) {
    userMap = L.map('map').setView([lat, lon], zoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(userMap);
    
    userMarker = L.marker([lat, lon], { draggable: true }).addTo(userMap);
    userMarker.bindPopup(t.mapMarkerPopup).openPopup();

    userMarker.on('dragend', function(event) {
      const position = userMarker.getLatLng();
      pontosLat = position.lat;
      pontosLon = position.lng;
      document.getElementById("eredmeny").innerHTML = t.locationSaved;
    });

    userMap.on('click', function(event) {
      pontosLat = event.latlng.lat;
      pontosLon = event.latlng.lng;
      userMarker.setLatLng(event.latlng);
      document.getElementById("eredmeny").innerHTML = t.locationSaved;
    });

  } else {
    userMap.setView([lat, lon], zoomLevel);
    if (typeof userMarker !== "undefined") {
      userMarker.setLatLng([lat, lon]);
      userMarker.setPopupContent(t.mapMarkerPopup);
    }
  }

  setTimeout(() => { userMap.invalidateSize(); }, 300);
  document.getElementById("tovabb2").style.display = "block";
}

// === CÍM ALAPÚ KERESŐ (OPENSTREETMAP NOMINATIM) ===
document.getElementById("mapSearchBtn").addEventListener("click", async function() {
  const t = translations[currentLang];
  const query = document.getElementById("mapSearchInput").value.trim();
  const eredmenyDiv = document.getElementById("eredmeny");
  const searchBtn = document.getElementById("mapSearchBtn");

  if (!query) {
    eredmenyDiv.innerHTML = t.searchAddressError;
    return;
  }

  eredmenyDiv.innerHTML = t.searchSearching;
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
        userMarker.getPopup().setContent(t.mapMarkerPopup).openPopup();
      }

      const rovidCim = data[0].display_name.split(',')[0];
      eredmenyDiv.innerHTML = `${t.searchFound}<b>${rovidCim}</b>`;
    } else {
      eredmenyDiv.innerHTML = t.searchNotFound;
    }
  } catch (error) {
    console.error("Geocoding hiba:", error);
    eredmenyDiv.innerHTML = t.searchNetworkError;
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
  submitBtn.innerText = "⏳ Feltöltés...";
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
        <h2>Köszönjük! / Thank you!</h2>
        <p style="font-size: 14px; color: #64748b;">A bejelentésed és a fotó elmentve a központi szerverre.</p>

        <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 15px; border-radius: 12px; margin-top: 15px; text-align: left;">
          <p style="font-weight: bold; font-size: 14px; margin: 0 0 6px 0; color: #1e293b;">📢 Segíts, hogy még gyorsabban kiérjen a segítség!</p>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 12px 0;">Oszd meg a bejelentést Facebook csoportokban, Messengeren vagy Viberen:</p>
          
          <button type="button" id="shareBtn" class="btn btn-primary" style="background: #1877f2; border: none; font-size: 14px; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            📲 Bejelentés Megosztása / Share Report
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
          alert("📋 A bejelentés adatai másolva a vágólapra!");
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