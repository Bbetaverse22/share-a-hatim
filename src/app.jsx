const { useState, useEffect, useCallback, useMemo, useRef } = React;

// ── Juz data ─────────────────────────────────────────────────────────────────
const JUZ_DATA = [
  { n:1,  ar:"أَلَمْ",           tr:"Elif Lâm Mim",    start:1,   end:21  },
  { n:2,  ar:"سَيَقُولُ",        tr:"Seyekûlü",        start:22,  end:41  },
  { n:3,  ar:"تِلْكَ الرُّسُلُ", tr:"Tilker-Rusül",    start:42,  end:61  },
  { n:4,  ar:"لَن تَنَالُوا",    tr:"Len Tenâlû",      start:62,  end:81  },
  { n:5,  ar:"وَالْمُحْصَنَاتُ", tr:"Vel-Muhsanât",    start:82,  end:101 },
  { n:6,  ar:"لَا يُحِبُّ",      tr:"Lâ Yühıbbü",      start:102, end:121 },
  { n:7,  ar:"وَإِذَا سَمِعُوا", tr:"Ve İzâ Semi'û",   start:122, end:141 },
  { n:8,  ar:"وَلَوْ أَنَّنَا",  tr:"Ve Lev Ennenâ",   start:142, end:161 },
  { n:9,  ar:"قَالَ الْمَلَأُ",  tr:"Kâlel-Melê",      start:162, end:181 },
  { n:10, ar:"وَاعْلَمُوا",      tr:"Va'lemû",          start:182, end:201 },
  { n:11, ar:"يَعْتَذِرُونَ",    tr:"Ya'tezirûn",       start:202, end:221 },
  { n:12, ar:"وَمَا مِن دَابَّة",tr:"Ve Mâ Min Dâbbe",  start:222, end:241 },
  { n:13, ar:"وَمَا أُبَرِّئُ",  tr:"Ve Mâ Überiü",    start:242, end:261 },
  { n:14, ar:"رُّبَمَا",         tr:"Rübemâ",           start:262, end:281 },
  { n:15, ar:"سُبْحَانَ",        tr:"Sübhânellezi",     start:282, end:301 },
  { n:16, ar:"قَالَ أَلَمْ",     tr:"Kâle Elem",        start:302, end:321 },
  { n:17, ar:"اقْتَرَبَ",        tr:"İkterebe",         start:322, end:341 },
  { n:18, ar:"قَدْ أَفْلَحَ",    tr:"Kad Efleha",       start:342, end:361 },
  { n:19, ar:"وَقَالَ الَّذِينَ",tr:"Ve Kalellezine",   start:362, end:381 },
  { n:20, ar:"أَمَّنْ خَلَقَ",   tr:"Emmen Haleka",     start:382, end:401 },
  { n:21, ar:"اتْلُ مَا أُوحِيَ",tr:"Utlü Mâ Ûhıye",  start:402, end:421 },
  { n:22, ar:"وَمَن يَقْنُتْ",   tr:"Ve Men Yaknut",    start:422, end:441 },
  { n:23, ar:"وَمَا لِيَ",       tr:"Ve Mâ Li",         start:442, end:461 },
  { n:24, ar:"فَمَنْ أَظْلَمُ",  tr:"Femen Azlemü",     start:462, end:481 },
  { n:25, ar:"إِلَيْهِ يُرَدُّ", tr:"İleyhi Yüreddü",   start:482, end:501 },
  { n:26, ar:"حمٓ",              tr:"Hâ Mim",           start:502, end:521 },
  { n:27, ar:"قَالَ فَمَا",      tr:"Kâle Femâ",        start:522, end:541 },
  { n:28, ar:"قَدْ سَمِعَ",      tr:"Kad Semia",        start:542, end:561 },
  { n:29, ar:"تَبَارَكَ",        tr:"Tebâreke",         start:562, end:581 },
  { n:30, ar:"عَمَّ",            tr:"Amme",             start:582, end:604 },
];
const TOTAL_PAGES = 604;

// ── Cevşen data ──────────────────────────────────────────────────────────────
const CEVSEN_DATA = Array.from({length:10}, (_,i) => ({
  n: i+1,
  start: i*10+1,
  end: i*10+10,
  label: `${i*10+1}–${i*10+10}. Bölüm`,
}));

// ── Type config ───────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  quran: {
    label: 'Kuran Hatmi',
    emoji: '📖',
    sections: JUZ_DATA,
    totalItems: 604,
    itemLabel: 'sayfa',
    sectionLabel: 'CÜZ',
    getItemLink: n => `https://herkul.app/kuran-i-kerim/page/${n}`,
    linkLabel: '📖 Oku',
  },
  cevsen: {
    label: 'Cevşen Hatmi',
    emoji: '🌙',
    sections: CEVSEN_DATA,
    totalItems: 100,
    itemLabel: 'bölüm',
    sectionLabel: 'BÖLÜM',
    getItemLink: n => { const start = Math.floor((n-1)/10)*10+1; return `https://herkul.app/cevsen-sesli/${start}~${start+9}`; },
    linkLabel: '📖 Oku',
  },
};

// ── Büyük Cevşen template ────────────────────────────────────────────────────
// 170 readings, imported from the group's spreadsheet (names intentionally left out).
const BUYUK_CEVSEN_ITEMS = [
  {"label": "Yasin", "section": "Sûreler ve Dualar", "link": "https://www.islamveihsan.com/yasin-suresi-oku.html"},
  {"label": "Fetih", "section": "Sûreler ve Dualar", "link": "https://www.islamveihsan.com/fetih-suresi-oku-fetih-suresi-turkce-fetih-suresi-meali.html"},
  {"label": "Rahman", "section": "Sûreler ve Dualar", "link": "https://cetele.org/anasayfa/rahman-suresi/"},
  {"label": "Haşr sonu", "section": "Sûreler ve Dualar", "link": "https://www.islamveihsan.com/lev-enzelna-okunusu-ve-anlami.html"},
  {"label": "Mülk", "section": "Sûreler ve Dualar", "link": "https://www.islamveihsan.com/tebareke-mulk-suresi-arapca-turkce-okunusu-ve-meali.html"},
  {"label": "Nebe", "section": "Sûreler ve Dualar", "link": "https://www.islamveihsan.com/amme-suresi-arapca-turkce-okunusu-ve-meali-nebe-suresi-oku-arapca-turkce.html"},
  {"label": "Bakara son 2 âyet (Âmene’r-Resûlü)", "section": "Sûreler ve Dualar", "link": "https://onlinedua.org/buyuk-cevsen/52"},
  {"label": "Bab 1-10", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Bab 11-20", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/2"},
  {"label": "Bab 21-30", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/3"},
  {"label": "Bab 31-40", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/4"},
  {"label": "Bab 41-50", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/5"},
  {"label": "Bab 51-60", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/6"},
  {"label": "Bab 61-70", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/7"},
  {"label": "Bab 71-80", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/8"},
  {"label": "Bab 81-90", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/9"},
  {"label": "Bab 91-100", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/10"},
  {"label": "Duâsı (aşağı kaydırın)", "section": "Küçük Cevşen", "link": "https://hayirhah.com/cevsen/10"},
  {"label": "Sayfa 154", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/154"},
  {"label": "Sayfa 156", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/156"},
  {"label": "Sayfa 158", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/158"},
  {"label": "Sayfa 160", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/160"},
  {"label": "Sayfa 162", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/162"},
  {"label": "Sayfa 164", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/164"},
  {"label": "Sayfa 166", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/166"},
  {"label": "Sayfa 168", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/168"},
  {"label": "Sayfa 170", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/170"},
  {"label": "Sayfa 172", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/172"},
  {"label": "Sayfa 174", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/174"},
  {"label": "Sayfa 176", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/176"},
  {"label": "Sayfa 178", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/178"},
  {"label": "Sayfa 180", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/180"},
  {"label": "Sayfa 182", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/182"},
  {"label": "Sayfa 184", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/184"},
  {"label": "Sayfa 186", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/186"},
  {"label": "Sayfa 188", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/188"},
  {"label": "Sayfa 190", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/190"},
  {"label": "Sayfa 192", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/192"},
  {"label": "Sayfa 194", "section": "Evrâd-ı Kudsiye", "link": "https://onlinedua.org/buyuk-cevsen/194"},
  {"label": "Sayfa 202", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/202"},
  {"label": "Sayfa 204", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/204"},
  {"label": "Sayfa 206", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/206"},
  {"label": "Sayfa 208", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/208"},
  {"label": "Sayfa 210", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/210"},
  {"label": "Sayfa 212", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/212"},
  {"label": "Sayfa 214", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/214"},
  {"label": "Sayfa 216", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/216"},
  {"label": "Sayfa 218", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/218"},
  {"label": "Sayfa 220", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/220"},
  {"label": "Sayfa 222", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/222"},
  {"label": "Sayfa 224", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/224"},
  {"label": "Sayfa 226", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/226"},
  {"label": "Sayfa 228", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/228"},
  {"label": "Sayfa 230", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/230"},
  {"label": "Sayfa 232", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/232"},
  {"label": "Sayfa 234", "section": "Delâilü’n-Nur", "link": "https://onlinedua.org/buyuk-cevsen/234"},
  {"label": "1. okuma · 3 defa (2. sayfa dahil)", "section": "Sekîne", "link": "https://onlinedua.org/buyuk-cevsen/236"},
  {"label": "2. okuma · 3 defa (2. sayfa dahil)", "section": "Sekîne", "link": "https://onlinedua.org/buyuk-cevsen/236"},
  {"label": "3. okuma · 3 defa (2. sayfa dahil)", "section": "Sekîne", "link": "https://onlinedua.org/buyuk-cevsen/236"},
  {"label": "4. okuma · 3 defa (2. sayfa dahil)", "section": "Sekîne", "link": "https://onlinedua.org/buyuk-cevsen/236"},
  {"label": "5. okuma · 3 defa (2. sayfa dahil)", "section": "Sekîne", "link": "https://onlinedua.org/buyuk-cevsen/236"},
  {"label": "6. okuma · 3 defa (2. sayfa dahil)", "section": "Sekîne", "link": "https://onlinedua.org/buyuk-cevsen/236"},
  {"label": "7. okuma · 1 defa (2. sayfa dahil)", "section": "Sekîne", "link": "https://onlinedua.org/buyuk-cevsen/236"},
  {"label": "Sayfa 240", "section": "Hz. Veysel Karanî Münâcâtı", "link": "https://onlinedua.org/buyuk-cevsen/240"},
  {"label": "Sayfa 242", "section": "Hz. Veysel Karanî Münâcâtı", "link": "https://onlinedua.org/buyuk-cevsen/242"},
  {"label": "Sayfa 248", "section": "Duâ-i Tercüman-ı İsm-i A’zam", "link": "https://onlinedua.org/buyuk-cevsen/248"},
  {"label": "Sayfa 250", "section": "Duâ-i Tercüman-ı İsm-i A’zam", "link": "https://onlinedua.org/buyuk-cevsen/250"},
  {"label": "Sayfa 252", "section": "Duâ-i Tercüman-ı İsm-i A’zam", "link": "https://onlinedua.org/buyuk-cevsen/252"},
  {"label": "Sayfa 254", "section": "Duâ-i İsm-i A’zam", "link": "https://onlinedua.org/buyuk-cevsen/254"},
  {"label": "Sayfa 256", "section": "Duâ-i İsm-i A’zam", "link": "https://onlinedua.org/buyuk-cevsen/256"},
  {"label": "Sayfa 262", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/262"},
  {"label": "Sayfa 264", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/264"},
  {"label": "Sayfa 266", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/266"},
  {"label": "Sayfa 268", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/268"},
  {"label": "Sayfa 270", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/270"},
  {"label": "Sayfa 272", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/272"},
  {"label": "Sayfa 274", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/274"},
  {"label": "Sayfa 276", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/276"},
  {"label": "Sayfa 278", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/278"},
  {"label": "Sayfa 280", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/280"},
  {"label": "Sayfa 282", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/282"},
  {"label": "Sayfa 284", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/284"},
  {"label": "Sayfa 286", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/286"},
  {"label": "Sayfa 288", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/288"},
  {"label": "Sayfa 290", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/290"},
  {"label": "Sayfa 292", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/292"},
  {"label": "Sayfa 294", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/294"},
  {"label": "Sayfa 296", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/296"},
  {"label": "Sayfa 298", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/298"},
  {"label": "Sayfa 300", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/300"},
  {"label": "Sayfa 302", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/302"},
  {"label": "Sayfa 304", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/304"},
  {"label": "Sayfa 306", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/306"},
  {"label": "Sayfa 308", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/308"},
  {"label": "Sayfa 310", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/310"},
  {"label": "Sayfa 312", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/312"},
  {"label": "Sayfa 314", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/314"},
  {"label": "Sayfa 316", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/316"},
  {"label": "Sayfa 318", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/318"},
  {"label": "Sayfa 320", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/320"},
  {"label": "Sayfa 322", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/322"},
  {"label": "Sayfa 324", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/324"},
  {"label": "Sayfa 326", "section": "Münâcâtü’l-Kur’ân", "link": "https://onlinedua.org/buyuk-cevsen/326"},
  {"label": "Sayfa 330", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 332", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 334", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 336", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 338", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 340", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 342", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 344", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/1"},
  {"label": "Sayfa 346", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/2"},
  {"label": "Sayfa 348", "section": "Tahmîdiyye", "link": "https://hayirhah.com/cevsen/3"},
  {"label": "Sayfa 350", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/350"},
  {"label": "Sayfa 352", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/352"},
  {"label": "Sayfa 354", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/354"},
  {"label": "Sayfa 356", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/356"},
  {"label": "Sayfa 358", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/358"},
  {"label": "Sayfa 360", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/360"},
  {"label": "Sayfa 362", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/362"},
  {"label": "Sayfa 364", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/364"},
  {"label": "Sayfa 366", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/366"},
  {"label": "Sayfa 368", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/368"},
  {"label": "Sayfa 370", "section": "Tahmîdiyye", "link": "https://onlinedua.org/buyuk-cevsen/370"},
  {"label": "Sayfa 376", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/376"},
  {"label": "Sayfa 378", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/378"},
  {"label": "Sayfa 380", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/380"},
  {"label": "Sayfa 382", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/382"},
  {"label": "Sayfa 384", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/384"},
  {"label": "Sayfa 386", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/386"},
  {"label": "Sayfa 388", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/388"},
  {"label": "Sayfa 390", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/390"},
  {"label": "Sayfa 392", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/392"},
  {"label": "Sayfa 394", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/394"},
  {"label": "Sayfa 396", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/396"},
  {"label": "Sayfa 398", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/398"},
  {"label": "Sayfa 400", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/400"},
  {"label": "Sayfa 402", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/402"},
  {"label": "Sayfa 404", "section": "Hülâsatü’l-Hülâsa", "link": "https://onlinedua.org/buyuk-cevsen/404"},
  {"label": "Sayfa 408", "section": "Hz. Abdülkâdir Geylânî Münâcâtı", "link": "https://onlinedua.org/buyuk-cevsen/408"},
  {"label": "Sayfa 410", "section": "Hz. Abdülkâdir Geylânî Münâcâtı", "link": "https://onlinedua.org/buyuk-cevsen/410"},
  {"label": "Sayfa 412", "section": "Hz. Abdülkâdir Geylânî Münâcâtı", "link": "https://onlinedua.org/buyuk-cevsen/412"},
  {"label": "Sayfa 414", "section": "Hz. Abdülkâdir Geylânî Münâcâtı", "link": "https://onlinedua.org/buyuk-cevsen/414"},
  {"label": "Sayfa 416", "section": "Hz. Abdülkâdir Geylânî Münâcâtı", "link": "https://onlinedua.org/buyuk-cevsen/416"},
  {"label": "Sayfa 418", "section": "Bir Duâ", "link": "https://onlinedua.org/buyuk-cevsen/418"},
  {"label": "Sayfa 420", "section": "Bir Duâ", "link": "https://onlinedua.org/buyuk-cevsen/420"},
  {"label": "Sayfa 422", "section": "Bir Duâ", "link": "https://onlinedua.org/buyuk-cevsen/422"},
  {"label": "Sayfa 424", "section": "Bir Duâ", "link": "https://onlinedua.org/buyuk-cevsen/424"},
  {"label": "Sayfa 430", "section": "Şefaat Duâsı", "link": "https://onlinedua.org/buyuk-cevsen/430"},
  {"label": "Sayfa 432", "section": "Şefaat Duâsı", "link": "https://onlinedua.org/buyuk-cevsen/432"},
  {"label": "Sayfa 434", "section": "Şefaat Duâsı", "link": "https://onlinedua.org/buyuk-cevsen/434"},
  {"label": "Sayfa 436", "section": "Şefaat Duâsı", "link": "https://onlinedua.org/buyuk-cevsen/436"},
  {"label": "Sayfa 438", "section": "Şefaat Duâsı", "link": "https://onlinedua.org/buyuk-cevsen/438"},
  {"label": "Sayfa 440", "section": "Şefaat Duâsı", "link": "https://onlinedua.org/buyuk-cevsen/440"},
  {"label": "1. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/1"},
  {"label": "2. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/2"},
  {"label": "3. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/3"},
  {"label": "4. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/4"},
  {"label": "5. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/5"},
  {"label": "6. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/6"},
  {"label": "7. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/7"},
  {"label": "8. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/8"},
  {"label": "9. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/9"},
  {"label": "10. kısım", "section": "Celcelûtiye", "link": "https://onlinedua.org/celcelutiye/10"},
  {"label": "1-20", "section": "Tevhidnâme", "link": "https://onlinekeyfiyet.wordpress.com/tnm1-20/"},
  {"label": "21-40", "section": "Tevhidnâme", "link": "https://onlinekeyfiyet.wordpress.com/tnm21-40/"},
  {"label": "41-60", "section": "Tevhidnâme", "link": "https://onlinekeyfiyet.wordpress.com/tnm41-60/"},
  {"label": "61-80", "section": "Tevhidnâme", "link": "https://onlinekeyfiyet.wordpress.com/tnm61-80/"},
  {"label": "81-100", "section": "Tevhidnâme", "link": "https://onlinekeyfiyet.wordpress.com/tnm81-100/"},
  {"label": "101-122", "section": "Tevhidnâme", "link": "https://onlinekeyfiyet.wordpress.com/tnm101-122/"}
];

// ── Ashâb-ı Bedir & Şühedâ-i Uhud template (parts as in the group's spreadsheet) ─
const BEDIR_UHUD_ITEMS = [
  {"label": "Sayfa 1–3", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/1"},
  {"label": "Sayfa 4–6", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/4"},
  {"label": "Sayfa 7–9", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/7"},
  {"label": "Sayfa 10–12", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/10"},
  {"label": "Sayfa 13–15", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/13"},
  {"label": "Sayfa 16–18", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/16"},
  {"label": "Sayfa 19–21", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/19"},
  {"label": "Sayfa 22–24", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/22"},
  {"label": "Sayfa 25–27", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/25"},
  {"label": "Sayfa 28–30", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/28"},
  {"label": "Sayfa 31–32 ve Dua", "section": "Ashâb-ı Bedir", "link": "https://herkul.app/ashabibedir/31"},
  {"label": "Sayfa 1–2", "section": "Şühedâ-i Uhud", "link": "https://herkul.app/suhedaiuhud/1"},
  {"label": "Sayfa 3–4", "section": "Şühedâ-i Uhud", "link": "https://herkul.app/suhedaiuhud/3"},
  {"label": "Sayfa 5–6", "section": "Şühedâ-i Uhud", "link": "https://herkul.app/suhedaiuhud/5"},
  {"label": "Sayfa 7 ve Dua", "section": "Şühedâ-i Uhud", "link": "https://herkul.app/suhedaiuhud/7"}
];

// Templates offered in the create dialog. A template is stored as a normal hatim
// (Firebase rules only allow quran|cevsen as type) plus its own items list.
const HATIM_TEMPLATES = {
  buyukcevsen: { label: 'Büyük Cevşen', emoji: '📿', type: 'cevsen', items: BUYUK_CEVSEN_ITEMS },
  bediruhud: { label: 'Bedir & Uhud', emoji: '🕌', type: 'cevsen', items: BEDIR_UHUD_ITEMS },
};

// Custom-list hatims (e.g. Büyük Cevşen imported from a spreadsheet) carry their own
// item list: hatim.items = [{ label, section, link }]. Items are numbered from 1 in
// pageList, and consecutive items with the same section form one card.
function getTypeCfg(hatim) {
  const items = hatim && hatim.items ? Object.values(hatim.items) : null;
  if (!items || !items.length) return TYPE_CONFIG[hatim && hatim.type] || TYPE_CONFIG.quran;
  const sections = [];
  items.forEach((it, i) => {
    const last = sections[sections.length - 1];
    if (last && last.title === it.section) last.end = i + 1;
    else sections.push({ n: sections.length + 1, title: it.section, start: i + 1, end: i + 1 });
  });
  return {
    label: 'Liste Hatmi',
    emoji: hatim.emoji || '📿',
    sections,
    totalItems: items.length,
    itemLabel: 'okuma',
    sectionLabel: 'BÖLÜM',
    getItemLink: n => (items[n-1] && items[n-1].link) || '#',
    getItemName: n => (items[n-1] && items[n-1].label) || String(n),
    linkLabel: '📖 Oku',
  };
}

// done / in-progress counts for the header ring and dashboard card.
function getProgress(hatim, typeCfg) {
  const pl = Object.values(hatim.pageList || {});
  const done = pl.filter(e => e.completedAt).length;
  const claimed = pl.filter(e => e.claimedBy && !e.completedAt).length;
  return { done, claimed, pct: Math.round(done / typeCfg.totalItems * 100) };
}

// ── Themes ───────────────────────────────────────────────────────────────────
const THEMES = {
  zumrut: { bg:"oklch(96% 0.018 80)", surface:"oklch(99% 0.010 80)", surfaceAlt:"oklch(93% 0.022 80)", primary:"oklch(30% 0.09 160)", gold:"oklch(68% 0.13 75)", goldLight:"oklch(88% 0.08 80)", text:"oklch(18% 0.03 80)", textMuted:"oklch(52% 0.03 80)", border:"oklch(86% 0.020 80)", cardFree:"oklch(99% 0.010 80)", cardClaimed:"oklch(88% 0.06 165)", cardDone:"oklch(83% 0.09 160)", cardPartial:"oklch(90% 0.05 80)", shadow:"0 2px 12px oklch(0% 0 0 / 0.08)", shadowHover:"0 6px 24px oklch(0% 0 0 / 0.14)" },
  gece:   { bg:"oklch(12% 0.025 250)", surface:"oklch(17% 0.025 250)", surfaceAlt:"oklch(22% 0.025 250)", primary:"oklch(68% 0.13 75)", gold:"oklch(76% 0.14 75)", goldLight:"oklch(28% 0.06 75)", text:"oklch(92% 0.010 80)", textMuted:"oklch(62% 0.015 80)", border:"oklch(28% 0.020 250)", cardFree:"oklch(20% 0.025 250)", cardClaimed:"oklch(22% 0.04 160)", cardDone:"oklch(26% 0.06 155)", cardPartial:"oklch(23% 0.03 75)", shadow:"0 2px 12px oklch(0% 0 0 / 0.35)", shadowHover:"0 6px 24px oklch(0% 0 0 / 0.55)" },
  safran: { bg:"oklch(95% 0.025 55)", surface:"oklch(98% 0.015 55)", surfaceAlt:"oklch(91% 0.030 55)", primary:"oklch(46% 0.13 38)", gold:"oklch(68% 0.13 75)", goldLight:"oklch(90% 0.07 70)", text:"oklch(18% 0.025 55)", textMuted:"oklch(50% 0.025 55)", border:"oklch(85% 0.025 55)", cardFree:"oklch(98% 0.015 55)", cardClaimed:"oklch(88% 0.06 75)", cardDone:"oklch(82% 0.10 60)", cardPartial:"oklch(91% 0.04 55)", shadow:"0 2px 12px oklch(0% 0 0 / 0.07)", shadowHover:"0 6px 24px oklch(0% 0 0 / 0.12)" },
};

// ── Firebase ─────────────────────────────────────────────────────────────────
let _db = null;
function getDb() { return _db; }
function initFirebase(cfg) {
  try {
    if (firebase.apps.length) firebase.apps.forEach(a => a.delete());
    firebase.initializeApp(cfg);
    _db = firebase.database();
    return true;
  } catch(e) { console.error(e); return false; }
}

// ── Local utils ───────────────────────────────────────────────────────────────
function ls(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } }
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
// Hatims created on this device. Only the creator's device sees "delete for everyone".
function isOwnedHatim(token, hatim) {
  if (ls('sha_owned_hatims', []).includes(token)) return true;
  // Hatims created before ownership was tracked: fall back to matching the organizer name.
  const me = String(ls('sha_me', '') || ls('sha_user', '')).trim().toLowerCase();
  return !!(hatim && me && String(hatim.organizer || '').trim().toLowerCase() === me);
}
function markOwnedHatim(token) { const o = ls('sha_owned_hatims', []); if (!o.includes(token)) lsSet('sha_owned_hatims', [token, ...o]); }
// Soft delete: the data stays in Firebase with deletedAt set, so it can be restored.
function softDeleteHatim(token) { return getDb().ref(`hatimByToken/${token}/deletedAt`).set(Date.now()); }
function restoreHatim(token) { return getDb().ref(`hatimByToken/${token}/deletedAt`).remove(); }
/** 32 bytes hex — must match `database.rules.json` token pattern. */
function generateHatimToken() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const buf = new Uint8Array(12);
  crypto.getRandomValues(buf);
  return Array.from(buf, b => chars[b % 62]).join('');
}
function formatDate(ts) { if (!ts) return ''; return new Date(ts).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' }); }
// Hatim pages are #hatim/{token}. While one is open the URL also carries
// ?h={token}: iPhone's "Add to Home Screen" saves the page URL and may drop the
// #fragment, so the query keeps the home-screen icon pointing at this hatim.
function getHashRoute() {
  const h = window.location.hash;
  if (h.startsWith('#hatim/')) return { page:'hatim', id:h.slice(7) };
  if (!h) {
    const q = new URLSearchParams(window.location.search).get('h');
    if (q && /^[0-9a-zA-Z]{12}$/.test(q)) return { page:'hatim', id:q };
  }
  return { page:'dashboard' };
}
function syncHatimUrl(route) {
  const want = route.page === 'hatim'
    ? `${location.pathname}?h=${route.id}#hatim/${route.id}`
    : location.pathname + location.hash;
  if (location.pathname + location.search + location.hash !== want) history.replaceState(null, '', want);
}

// ── Firebase hooks ────────────────────────────────────────────────────────────
function useHatim(token) {
  const [hatim, setHatim] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!token || !_db) { setLoading(false); return; }
    const ref = _db.ref(`hatimByToken/${token}`);
    const unsub = ref.on('value', snap => { setHatim(snap.val()); setLoading(false); });
    return () => ref.off('value', unsub);
  }, [token]);
  return { hatim, loading };
}

function useMyHatimIds() {
  const [ids, setIds] = useState(() => {
    const stored = ls('sha_my_hatim_tokens', null);
    if (stored !== null) return stored;
    const legacy = ls('sha_my_hatims', []);
    const migrated = legacy.filter(t => /^[0-9a-f]{64}$/.test(String(t)));
    if (legacy.length) lsSet('sha_my_hatim_tokens', migrated);
    return migrated;
  });
  const add = useCallback(token => {
    setIds(prev => {
      const next = prev.includes(token) ? prev : [token, ...prev];
      lsSet('sha_my_hatim_tokens', next);
      return next;
    });
  }, []);
  const remove = useCallback(token => {
    setIds(prev => {
      const next = prev.filter(x => x !== token);
      lsSet('sha_my_hatim_tokens', next);
      return next;
    });
  }, []);
  return { ids, add, remove };
}

// ── Primitive UI ──────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'14px 0' }}>
      <div style={{ flex:1, height:1, background:'var(--gold)', opacity:0.4 }} />
      <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 8.5,5 13,5 9.5,7.8 11,12 7,9.5 3,12 4.5,7.8 1,5 5.5,5" fill="var(--gold)" opacity="0.9" /></svg>
      <div style={{ flex:1, height:1, background:'var(--gold)', opacity:0.4 }} />
    </div>
  );
}

function Btn({ children, variant='primary', small, onClick, disabled, style }) {
  const vs = { primary:{ background:'var(--primary)', color:'#fff' }, gold:{ background:'var(--gold)', color:'#fff' }, ghost:{ background:'transparent', color:'var(--text)', border:'1.5px solid var(--border)' }, danger:{ background:'oklch(55% 0.14 25)', color:'#fff' }, soft:{ background:'var(--surfaceAlt)', color:'var(--text)' } };
  return <button disabled={disabled} onClick={onClick} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, border:'none', cursor:disabled?'not-allowed':'pointer', fontFamily:'Nunito,sans-serif', fontWeight:700, transition:'opacity 0.15s', borderRadius:10, padding:small?'7px 16px':'11px 24px', fontSize:small?13:15, opacity:disabled?0.5:1, boxShadow:'var(--shadow)', ...vs[variant], ...style }} onMouseEnter={e=>{ if(!disabled)e.currentTarget.style.opacity='0.82'; }} onMouseLeave={e=>{ e.currentTarget.style.opacity=disabled?'0.5':'1'; }}>{children}</button>;
}

function Inp({ label, value, onChange, type='text', placeholder, required, max, min, hint }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      {label && <label style={{ fontSize:12, fontWeight:800, color:'var(--textMuted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} max={max} min={min}
        style={{ padding:'10px 14px', borderRadius:10, fontSize:16, border:'1.5px solid var(--border)', background:'var(--surface)', color:'var(--text)', fontFamily:'Nunito,sans-serif', outline:'none', transition:'border-color 0.2s' }}
        onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
      {hint && <div style={{ fontSize:11, color:'var(--textMuted)', lineHeight:1.5 }}>{hint}</div>}
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=5 }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      {label && <label style={{ fontSize:12, fontWeight:800, color:'var(--textMuted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</label>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ padding:'10px 14px', borderRadius:10, fontSize:13, border:'1.5px solid var(--border)', background:'var(--surface)', color:'var(--text)', fontFamily:'monospace', outline:'none', resize:'vertical', lineHeight:1.5 }}
        onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
    </div>
  );
}

function Modal({ children, onClose, title, subtitle, wide }) {
  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose&&onClose()}>
      <div className="scale-in" style={{ background:'var(--surface)', borderRadius:20, padding:28, width:'100%', maxWidth:wide?720:480, boxShadow:'0 20px 60px oklch(0% 0 0 / 0.28)', maxHeight:'90vh', overflowY:'auto' }}>
        {title && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
              <div>
                <h2 style={{ fontFamily:'Amiri,serif', fontSize:22, color:'var(--text)' }}>{title}</h2>
                {subtitle && <p style={{ fontSize:12, color:'var(--textMuted)', marginTop:2 }}>{subtitle}</p>}
              </div>
              {onClose && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:'var(--textMuted)', lineHeight:1, padding:4 }}>×</button>}
            </div>
            <GoldDivider />
          </>
        )}
        {children}
      </div>
    </div>
  );
}

function ProgressRing({ pct, size=72, stroke=6 }) {
  const r = (size-stroke)/2, circ = 2*Math.PI*r, dash = (pct/100)*circ;
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--gold)" strokeWidth={stroke} strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" style={{ transition:'stroke-dasharray 0.6s ease' }} />
    </svg>
  );
}

function Spinner() { return <div className="spinner"></div>; }

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ hatimToken, onClose }) {
  const url = `${window.location.origin}${window.location.pathname}#hatim/${hatimToken}`;
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2200); }); };
  return (
    <Modal title="Hatimi Paylaş" subtitle="Sadece bu gizli bağlantıya sahip olanlar hatimi görebilir ve cüz üstlenebilir" onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ background:'var(--surfaceAlt)', borderRadius:10, padding:'12px 16px', fontSize:12, wordBreak:'break-all', color:'var(--text)', fontFamily:'monospace' }}>{url}</div>
        <Btn onClick={copy} variant={copied?'ghost':'gold'}>{copied?'✓ Kopyalandı!':'📋 Linki Kopyala'}</Btn>
        <div style={{ display:'flex', gap:8 }}>
          <a href={`https://wa.me/?text=${encodeURIComponent('Hatim oluşturdum, cüz almak için: ' + url)}`} target="_blank" rel="noopener noreferrer" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 16px', borderRadius:10, background:'#25D366', color:'#fff', fontWeight:700, fontSize:13, textDecoration:'none' }}>
            WhatsApp
          </a>
        </div>
        <p style={{ fontSize:11, color:'var(--textMuted)', textAlign:'center', lineHeight:1.6 }}>Bağlantıyı paylaştığınız kişiler gerçek zamanlı güncellemeyi görebilir; bağlantı olmadan erişim yoktur.</p>
      </div>
    </Modal>
  );
}

// ── Add to home screen ───────────────────────────────────────────────────────
// Android/Chrome fires beforeinstallprompt; keep it so our button can open the
// native install dialog. iPhone has no such API, so we show instructions.
let _installPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); _installPrompt = e; });
window.addEventListener('appinstalled', () => { _installPrompt = null; });

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function devicePlatform() {
  const ua = navigator.userAgent || '';
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

// Point the web app manifest at the current hatim, so the home-screen icon
// opens this hatim (on iPhone the installed app has its own storage, so
// opening the dashboard there would show an empty list).
function useHatimManifest(hatimToken, title) {
  useEffect(() => {
    const link = document.querySelector('link[rel=manifest]');
    const appleTitle = document.querySelector('meta[name=apple-mobile-web-app-title]');
    if (!link || !hatimToken) return;
    let cancelled = false;
    fetch('manifest.json').then(r => r.json()).then(base => {
      if (cancelled) return;
      const abs = u => new URL(u, location.href).href;
      const url = abs(`./?h=${hatimToken}#hatim/${hatimToken}`);
      const name = title || base.name;
      const m = { ...base, name, short_name: name.length > 14 ? base.short_name : name, start_url: url, id: url, scope: abs('./'),
                  icons: base.icons.map(i => ({ ...i, src: abs(i.src) })) };
      link.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(m));
      if (appleTitle) appleTitle.content = m.short_name;
    }).catch(() => {});
    return () => { cancelled = true; link.href = 'manifest.json'; if (appleTitle) appleTitle.content = 'Hatim'; };
  }, [hatimToken, title]);
}

// Safari's share icon (square with an up arrow), drawn so people can match it.
function IosShareIcon() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" style={{ verticalAlign:'-5px', margin:'0 2px' }} aria-label="Paylaş simgesi">
      <path d="M10 2v13M5.5 6.5L10 2l4.5 4.5" fill="none" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 10H3.5v12h13V10h-3" fill="none" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstallModal({ onClose }) {
  const platform = devicePlatform();
  const step = (n, text) => (
    <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
      <div style={{ flex:'0 0 28px', height:28, borderRadius:14, background:'var(--primary)', color:'#fff', fontWeight:800, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>{n}</div>
      <div style={{ fontSize:15, color:'var(--text)', lineHeight:1.5, paddingTop:3 }}>{text}</div>
    </div>
  );
  const b = t => <strong>{t}</strong>;
  return (
    <Modal title="Telefona Ekle" subtitle="Bu hatim ana ekranınızda uygulama gibi durur, link kaybolmaz" onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {platform === 'ios' ? <>
          {step(1, <>Safari'nin {b('paylaş simgesine')} <IosShareIcon /> dokunun. Bu simge ekranın en altında, adres çubuğunun yanındadır.<div style={{ fontSize:13, color:'var(--textMuted)', marginTop:4 }}>Görmüyorsanız alttaki {b('⋯')} simgesine, sonra {b('Paylaş')}'a dokunun. <em>(Sayfadaki sarı "Paylaş" butonu değil.)</em></div></>)}
          {step(2, <>Açılan listeyi yukarı kaydırın ve {b('Ana Ekrana Ekle')}'yi seçin<div style={{ fontSize:13, color:'var(--textMuted)', marginTop:4 }}>Görmüyorsanız {b('Daha Fazla')}'ya dokunun.</div></>)}
          {step(3, <>Sağ üstteki {b('Ekle')}'ye dokunun</>)}
        </> : platform === 'android' ? <>
          {step(1, <>Sağ üstteki {b('⋮')} menüsüne dokunun</>)}
          {step(2, <>{b('Ana ekrana ekle')} ya da {b('Uygulamayı yükle')}'yi seçin</>)}
          {step(3, <>{b('Ekle')} / {b('Yükle')}'ye dokunun</>)}
        </> : <>
          {step(1, <>Bu sayfayı telefonunuzda açın</>)}
          {step(2, <>Tarayıcının menüsünden {b('Ana Ekrana Ekle')}'yi seçin</>)}
        </>}
        <div style={{ background:'var(--goldLight)', borderRadius:12, padding:'12px 14px', fontSize:13, color:'var(--text)', lineHeight:1.55 }}>
          💡 Linki <strong>WhatsApp'ın içinde</strong> açtıysanız bu seçenek görünmez. Önce sayfayı {platform === 'ios' ? <strong>Safari</strong> : <strong>Chrome</strong>}'da açın: sağ üstteki {platform === 'ios' ? <strong>⋯ / pusula</strong> : <strong>⋮</strong>} simgesi → <strong>{platform === 'ios' ? "Safari'de Aç" : 'Tarayıcıda aç'}</strong>.
        </div>
        <Btn onClick={onClose}>Tamam</Btn>
      </div>
    </Modal>
  );
}

function InstallButton({ onShowHelp }) {
  if (isStandalone()) return null;
  const onClick = async () => {
    if (_installPrompt) {
      const ev = _installPrompt; _installPrompt = null;
      try { ev.prompt(); await ev.userChoice; return; } catch {}
    }
    onShowHelp();
  };
  return <Btn small variant="ghost" onClick={onClick}>📲 Telefona Ekle</Btn>;
}

// ── Page Modal ────────────────────────────────────────────────────────────────
function JuzPageModal({ juz, pageList, onClaimPages, onCompletePages, onUnclaimPage, onClose, typeCfg }) {
  typeCfg = typeCfg || TYPE_CONFIG.quran;
  const [nameInput, setNameInput] = useState('');
  const [selected, setSelected] = useState([]);

  const pages = useMemo(() => { const ps = []; for(let p=juz.start;p<=juz.end;p++) ps.push(p); return ps; }, [juz]);
  const getState = p => { const e = pageList[p]; if (!e) return 'free'; return e.completedAt ? 'done' : 'claimed'; };
  const toggleSelect = p => {
    if (getState(p) !== 'free') return;
    setSelected(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);
  };

  const done = pages.filter(p=>getState(p)==='done').length;
  const claimed = pages.filter(p=>getState(p)==='claimed').length;
  const free = pages.filter(p=>getState(p)==='free').length;
  const bgMap = { free:'var(--cardFree)', claimed:'var(--cardClaimed)', done:'var(--cardDone)' };
  const { itemLabel, getItemLink, linkLabel } = typeCfg;

  const claimAll = () => {
    if (!nameInput.trim()) return;
    const freePgs = pages.filter(p => getState(p)==='free');
    onClaimPages(freePgs, nameInput.trim());
    onClose();
  };
  const claimSelected = () => {
    if (!nameInput.trim() || !selected.length) return;
    onClaimPages(selected, nameInput.trim());
    setSelected([]);
  };

  return (
    <Modal title={juz.title || `${juz.n}. ${typeCfg.sectionLabel.charAt(0) + typeCfg.sectionLabel.slice(1).toLowerCase()}`} subtitle={juz.title ? `${pages.length} ${typeCfg.itemLabel}` : `${typeCfg.itemLabel.charAt(0).toUpperCase() + typeCfg.itemLabel.slice(1)} ${juz.start}–${juz.end}`} onClose={onClose} wide>
      <div style={{ display:'flex', gap:12, marginBottom:14 }}>
        {[['Tamam',done,'var(--primary)'],['Okunuyor',claimed,'var(--gold)'],['Boş',free,'var(--textMuted)']].map(([l,v,c])=>(
          <div key={l} style={{ flex:1, background:'var(--surfaceAlt)', borderRadius:10, padding:'10px 0', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:11, color:'var(--textMuted)' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'flex-end', flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:180 }}>
          <Inp label="Adınız / Your Name" value={nameInput} onChange={setNameInput} placeholder="Ahmed..." />
        </div>
        <Btn variant="gold" small onClick={claimAll} disabled={!nameInput.trim()||free===0}>Tümünü Üstlen</Btn>
      </div>
      {selected.length > 0 && (
        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10, padding:'8px 12px', background:'var(--goldLight)', borderRadius:10 }}>
          <span style={{ flex:1, fontSize:14, fontWeight:700, color:'var(--text)' }}>{selected.length} {typeCfg.itemLabel} seçildi</span>
          <Btn variant="primary" small onClick={claimSelected} disabled={!nameInput.trim()}>Üstlen</Btn>
          <Btn variant="ghost" small onClick={()=>setSelected([])}>İptal</Btn>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill, minmax(${typeCfg.getItemName ? 130 : 78}px, 1fr))`, gap:6 }}>
        {pages.map(p => {
          const st = getState(p); const e = pageList[p]||{}; const isSel = selected.includes(p);
          return (
            <div key={p} onClick={()=>st==='free'&&toggleSelect(p)}
              style={{ background:isSel?'var(--gold)':bgMap[st], border:`1.5px solid ${isSel?'var(--gold)':'var(--border)'}`, borderRadius:10, padding:'8px 6px', textAlign:'center', cursor:st==='free'?'pointer':'default', transition:'transform 0.15s' }}
              onMouseEnter={ev=>{ if(st==='free') ev.currentTarget.style.transform='scale(1.07)'; }}
              onMouseLeave={ev=>{ ev.currentTarget.style.transform='none'; }}
            >
              {typeCfg.getItemName
                ? <div style={{ fontSize:13, fontWeight:800, color:isSel?'#fff':'var(--text)', lineHeight:1.25, wordBreak:'break-word' }}>{typeCfg.getItemName(p)}</div>
                : <>
                    <div style={{ fontSize:17, fontWeight:800, color:isSel?'#fff':'var(--text)', lineHeight:1 }}>{p}</div>
                    <div style={{ fontSize:11, color:isSel?'rgba(255,255,255,0.7)':'var(--textMuted)', marginTop:1 }}>{itemLabel}</div>
                  </>}
              {st==='claimed' && <div style={{ fontSize:12, color:'var(--primary)', fontWeight:800, marginTop:3, lineHeight:1.2, wordBreak:'break-word' }}>{e.claimedBy}</div>}
              {st==='done' && <div style={{ fontSize:12, color:'var(--primary)', fontWeight:800, marginTop:3, lineHeight:1.2, wordBreak:'break-word' }}>✓ {e.claimedBy}</div>}
              <a href={getItemLink(p)} target="_blank" rel="noopener noreferrer" onClick={ev=>ev.stopPropagation()}
                style={{ display:'block', fontSize:11, color:isSel?'rgba(255,255,255,0.9)':'var(--gold)', fontWeight:700, marginTop:4, textDecoration:'none' }}>{linkLabel}</a>
              {st==='claimed' && (
                <div style={{ display:'flex', gap:4, marginTop:5, justifyContent:'center' }}>
                  <button onClick={ev=>{ev.stopPropagation();onCompletePages([p]);}} style={{ fontSize:12, padding:'4px 9px', borderRadius:5, border:'none', cursor:'pointer', background:'var(--primary)', color:'#fff', fontWeight:700 }}>✓</button>
                  <button onClick={ev=>{ev.stopPropagation();onUnclaimPage(p);}} style={{ fontSize:12, padding:'4px 9px', borderRadius:5, cursor:'pointer', background:'transparent', color:'var(--textMuted)', border:'1px solid var(--border)' }}>✕</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize:12, color:'var(--textMuted)', marginTop:12, textAlign:'center' }}>
        Birden fazla {typeCfg.itemLabel} seçmek için üzerine dokunun.
      </p>
    </Modal>
  );
}

// ── Juz Card ──────────────────────────────────────────────────────────────────
function JuzCard({ juz, pageList, onOpenPages, typeCfg }) {
  typeCfg = typeCfg || TYPE_CONFIG.quran;
  const pages = useMemo(()=>{ const ps=[]; for(let p=juz.start;p<=juz.end;p++) ps.push(p); return ps; },[juz]);
  const pageDone = pages.filter(p=>pageList[p]?.completedAt).length;
  const pageClaimed = pages.filter(p=>pageList[p]?.claimedBy&&!pageList[p]?.completedAt).length;
  const pageFree = pages.length - pageDone - pageClaimed;
  const pagePct = Math.round((pageDone/pages.length)*100);
  const state = pageDone===pages.length?'done':(pageDone>0||pageClaimed>0)?'partial':'free';
  const bgMap = { free:'var(--cardFree)', partial:'var(--cardPartial)', done:'var(--cardDone)' };
  const names = useMemo(() => {
    const seen = new Set();
    pages.forEach(p => { if (pageList[p]?.claimedBy) seen.add(pageList[p].claimedBy); });
    return [...seen];
  }, [pages, pageList]);
  const namesLabel = names.length <= 3 ? names.join(', ') : `${names.slice(0,3).join(', ')} +${names.length-3}`;
  return (
    <div className="fade-in" style={{ background:bgMap[state], border:'1.5px solid var(--border)', borderRadius:14, padding:'14px 11px', display:'flex', flexDirection:'column', gap:5, cursor:'pointer', transition:'transform 0.18s, box-shadow 0.18s', boxShadow:'var(--shadow)', position:'relative', overflow:'hidden', animationDelay:`${(juz.n-1)*0.016}s` }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadowHover)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow)';}}
      onClick={()=>onOpenPages(juz)}
    >
      {state==='done'&&<div style={{ position:'absolute', top:0, right:0, background:'var(--primary)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 8px', borderBottomLeftRadius:9 }}>✓ Tamam</div>}
      {state==='partial'&&<div style={{ position:'absolute', top:0, right:0, background:'var(--gold)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 8px', borderBottomLeftRadius:9 }}>Devam</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:6, marginTop:14 }}>
        <span style={{ fontSize:11, fontWeight:800, color:'var(--textMuted)', letterSpacing:'0.06em' }}>{juz.title ? juz.title.toLocaleUpperCase('tr-TR') : `${juz.n}. ${typeCfg.sectionLabel}`}</span>
        <span style={{ fontSize:11, color:'var(--textMuted)', whiteSpace:'nowrap' }}>{juz.title ? pages.length : `${juz.start}–${juz.end}`}</span>
      </div>
      <div style={{ marginTop:4 }}>
        <div style={{ height:3, borderRadius:3, background:'var(--border)', overflow:'hidden', marginBottom:4 }}>
          <div style={{ height:'100%', width:`${pagePct}%`, background:'var(--gold)', transition:'width 0.5s ease', borderRadius:3 }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--textMuted)' }}>
          <span style={{ color:'var(--primary)', fontWeight:700 }}>✓ {pageDone}</span>
          <span>📖 {pageClaimed}</span>
          <span>○ {pageFree}</span>
        </div>
        {names.length > 0 && (
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', marginTop:5, lineHeight:1.3, textAlign:'center', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', wordBreak:'break-word' }}>{namesLabel}</div>
        )}
        <div style={{ textAlign:'center', fontSize:12, color:'var(--gold)', fontWeight:700, marginTop:5 }}>
          {state==='done'?'🌙 Tamamlandı':`→ Aç`}
        </div>
      </div>
    </div>
  );
}

// ── Create Modal ──────────────────────────────────────────────────────────────
function CreateModal({ onCreate, onClose }) {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState('quran');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!title.trim()||!organizer.trim()) return;
    setError('');
    setSaving(true);
    try {
      const tpl = HATIM_TEMPLATES[type];
      const data = { title:title.trim(), organizer:organizer.trim(), deadline, type: tpl ? tpl.type : type, createdAt:Date.now() };
      if (tpl) {
        data.emoji = tpl.emoji;
        if (tpl.items) data.items = tpl.items;
      }
      await onCreate(data);
    } catch (e) {
      console.error(e);
      const msg = (e && (e.message || e.code)) ? `${e.code ? e.code + ': ' : ''}${e.message || ''}` : 'Kayıt sırasında hata oluştu.';
      setError(msg);
    }
    setSaving(false);
  };

  return (
    <Modal title="Yeni Hatim Oluştur" subtitle="Create a New Hatim" onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[...Object.entries(TYPE_CONFIG), ...Object.entries(HATIM_TEMPLATES)].map(([key, cfg]) => (
            <div key={key} onClick={()=>setType(key)} style={{ flex:1, padding:'12px', borderRadius:12, border:`2px solid ${type===key?'var(--gold)':'var(--border)'}`, cursor:'pointer', background:type===key?'var(--goldLight)':'var(--surfaceAlt)', transition:'all 0.18s', textAlign:'center' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{cfg.emoji}</div>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{cfg.label}</div>
            </div>
          ))}
        </div>
        <Inp label="Hatim Başlığı / Title" value={title} onChange={setTitle} placeholder={{ quran:'Ramazan Hatmi...', cevsen:'Ramazan Cevşeni...', buyukcevsen:'Büyük Cevşen Hatmi...', bediruhud:'Bedir & Uhud...' }[type]} required />
        <Inp label="Organizatör Adı / Your Name" value={organizer} onChange={setOrganizer} placeholder="Ahmed..." required />
        <Inp label="Son Tarih / Deadline (opsiyonel)" value={deadline} onChange={setDeadline} type="date" />
        {error && (
          <div style={{ padding:'10px 12px', borderRadius:10, background:'oklch(95% 0.04 25)', color:'oklch(40% 0.15 25)', fontSize:12, fontWeight:700, lineHeight:1.5 }}>
            {error}
          </div>
        )}
        <Btn onClick={handle} disabled={!title.trim()||!organizer.trim()||saving}>{saving?'Oluşturuluyor...':'✦ Hatim Oluştur'}</Btn>
      </div>
    </Modal>
  );
}

// ── My Pages Panel ───────────────────────────────────────────────────────────
function MyPagesPanel({ pageList, currentUser, typeCfg, onCompletePages }) {
  if (!currentUser) return null;

  const myPending = Object.entries(pageList)
    .filter(([_, e]) => e.claimedBy === currentUser && !e.completedAt)
    .map(([p]) => Number(p))
    .sort((a, b) => a - b);

  const myDoneCount = Object.entries(pageList)
    .filter(([_, e]) => e.claimedBy === currentUser && e.completedAt)
    .length;

  if (myPending.length === 0 && myDoneCount === 0) return null;

  const { getItemLink, itemLabel } = typeCfg;

  return (
    <div className="fade-in" style={{ background:'var(--surface)', borderRadius:20, padding:22, marginBottom:24, boxShadow:'var(--shadow)', border:'1.5px solid var(--gold)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', color:'var(--gold)', marginBottom:3 }}>BENİM SAYFALARIM / MY PAGES</div>
          <div style={{ fontSize:13, color:'var(--textMuted)' }}>
            {myPending.length > 0 && <span>{myPending.length} okunacak</span>}
            {myPending.length > 0 && myDoneCount > 0 && <span> · </span>}
            {myDoneCount > 0 && <span style={{ color:'var(--primary)', fontWeight:700 }}>✓ {myDoneCount} tamamlandı</span>}
          </div>
        </div>
      </div>
      {myPending.length > 0 ? (
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {myPending.map(p => (
            <div key={p} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--cardClaimed)', border:'1.5px solid var(--border)', borderRadius:10, padding:'7px 10px' }}>
              {typeCfg.getItemName
                ? <span style={{ fontSize:12, fontWeight:800, color:'var(--text)' }}>{typeCfg.sections.find(sec=>p>=sec.start&&p<=sec.end)?.title} · {typeCfg.getItemName(p)}</span>
                : <><span style={{ fontSize:14, fontWeight:800, color:'var(--text)' }}>{p}</span>
                   <span style={{ fontSize:10, color:'var(--textMuted)' }}>{itemLabel}</span></>}
              <a href={getItemLink(p)} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:10, color:'var(--gold)', fontWeight:700, textDecoration:'none' }}>📖 Oku</a>
              <button onClick={() => onCompletePages([p])}
                style={{ fontSize:10, padding:'3px 8px', borderRadius:6, border:'none', cursor:'pointer', background:'var(--primary)', color:'#fff', fontWeight:700 }}>✓</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'10px 0', color:'var(--primary)', fontFamily:'Amiri,serif', fontSize:17 }}>
          🌙 Tüm sayfalarını tamamladın. الحمد لله
        </div>
      )}
    </div>
  );
}

// ── Hatim Page ────────────────────────────────────────────────────────────────
function HatimPage({ hatimToken, addMyHatim, goBack, currentUser, setCurrentUser }) {
  const { hatim, loading } = useHatim(hatimToken);
  const [openJuz, setOpenJuz] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  useHatimManifest(hatim && !hatim.deletedAt ? hatimToken : null, hatim && hatim.title);

  // Add to my list on first visit
  useEffect(() => { if (hatim) addMyHatim(hatimToken); }, [hatim, hatimToken, addMyHatim]);

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><Spinner /></div>;
  if (!hatim) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ fontFamily:'Amiri,serif', fontSize:44, color:'var(--gold)', opacity:0.5 }}>☽</div>
      <p style={{ color:'var(--textMuted)' }}>Hatim bulunamadı.</p>
      <Btn variant="ghost" small onClick={goBack}>← Geri</Btn>
    </div>
  );

  if (hatim.deletedAt) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, padding:20, textAlign:'center' }}>
      <div style={{ fontFamily:'Amiri,serif', fontSize:44, color:'var(--gold)', opacity:0.5 }}>☽</div>
      <p style={{ color:'var(--textMuted)' }}><strong style={{ color:'var(--text)' }}>"{hatim.title}"</strong> hatimi organizatör tarafından silindi.</p>
      <div style={{ display:'flex', gap:10 }}>
        {isOwnedHatim(hatimToken, hatim) && <Btn small onClick={()=>restoreHatim(hatimToken)}>↺ Geri Al</Btn>}
        <Btn variant="ghost" small onClick={goBack}>← Geri</Btn>
      </div>
    </div>
  );

  const pageList = hatim.pageList || {};
  const typeCfg = getTypeCfg(hatim);
  const { done: doneCount, claimed: claimedCount, pct } = getProgress(hatim, typeCfg);
  const daysLeft = hatim.deadline ? Math.ceil((new Date(hatim.deadline)-new Date())/86400000) : null;

  const db = getDb();

  const claimPages = (pageNums, name) => {
    // Only remember a name as "me" after asking, so pages taken for someone else
    // never become this device's name. Asked again only when the name differs.
    if (name !== currentUser && window.confirm(`"${name}" sizin adınız mı?\n\nEvet derseniz bu sayfalar "Benim Sayfalarım" bölümünde görünür. Başkası adına aldıysanız İptal'e basın.`)) setCurrentUser(name);
    const updates = {};
    pageNums.forEach(p => { if (!pageList[p]) updates[`hatimByToken/${hatimToken}/pageList/${p}`] = { claimedBy:name, claimedAt:Date.now() }; });
    db.ref().update(updates);
  };

  const completePages = (pageNums) => {
    const updates = {};
    pageNums.forEach(p => { if (pageList[p]) updates[`hatimByToken/${hatimToken}/pageList/${p}/completedAt`] = Date.now(); });
    db.ref().update(updates);
  };

  const unclaimPage = (p) => { db.ref(`hatimByToken/${hatimToken}/pageList/${p}`).remove(); };

  return (
    <div style={{ maxWidth:1040, margin:'0 auto', padding:'24px 20px 60px' }}>
      <div className="fade-in" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <button onClick={goBack} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--textMuted)', fontSize:14, fontFamily:'Nunito', fontWeight:600 }}>← Dashboard</button>
        <div style={{ display:'flex', gap:8 }}>
          <InstallButton onShowHelp={()=>setShowInstall(true)} />
          <Btn small variant="gold" onClick={()=>setShowShare(true)}>📤 Paylaş</Btn>
        </div>
      </div>

      {/* Info card */}
      <div className="fade-in" style={{ background:'var(--surface)', borderRadius:20, padding:26, marginBottom:24, boxShadow:'var(--shadow)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', color:'var(--gold)', marginBottom:3 }}>HATİM</div>
            <h1 style={{ fontFamily:'Amiri,serif', fontSize:28, color:'var(--text)', lineHeight:1.2, marginBottom:6 }}>{hatim.title}</h1>
            <div style={{ fontSize:12, color:'var(--textMuted)' }}>Organizatör: <strong style={{ color:'var(--text)' }}>{hatim.organizer}</strong> · {formatDate(hatim.createdAt)}</div>
            {daysLeft!==null && <div style={{ marginTop:8, fontSize:12, fontWeight:700, color:daysLeft<3?'oklch(55% 0.14 25)':'var(--primary)' }}>{daysLeft>0?`⏳ ${daysLeft} gün kaldı`:daysLeft===0?'⚠️ Bugün son gün!':'⚠️ Süre doldu'}</div>}
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ position:'relative', width:82, height:82, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ProgressRing pct={pct} size={82} stroke={7} />
              <div style={{ position:'absolute', textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:800, color:'var(--text)', lineHeight:1 }}>{pct}%</div>
                <div style={{ fontSize:9, color:'var(--textMuted)', fontWeight:700 }}>Tamam</div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, textAlign:'center' }}>
              {[['✓',doneCount,'var(--primary)'],['📖',claimedCount,'var(--gold)'],['○',typeCfg.totalItems-doneCount-claimedCount,'var(--textMuted)']].map(([l,v,c])=>(
                <div key={l}><div style={{ fontSize:16, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:9, color:'var(--textMuted)' }}>{l}</div></div>
              ))}
            </div>
            <div style={{ fontSize:10, color:'var(--textMuted)' }}>{doneCount}/{typeCfg.totalItems} {typeCfg.itemLabel}</div>
          </div>
        </div>
        {doneCount===typeCfg.totalItems && (
          <div style={{ marginTop:14, background:'var(--goldLight)', border:'1.5px solid var(--gold)', borderRadius:12, padding:'12px 20px', textAlign:'center', fontFamily:'Amiri,serif', fontSize:20, color:'var(--primary)' }}>
            🌙 Mâşaallah! Hatim tamamlandı. الحمد لله 🌙
          </div>
        )}
      </div>

      <MyPagesPanel pageList={pageList} currentUser={currentUser} typeCfg={typeCfg} onCompletePages={completePages} />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(138px, 1fr))', gap:10 }}>
        {typeCfg.sections.map(j => <JuzCard key={j.n} juz={j} pageList={pageList} onOpenPages={setOpenJuz} typeCfg={typeCfg} />)}
      </div>

      {openJuz && <JuzPageModal juz={openJuz} pageList={pageList}
        onClaimPages={claimPages} onCompletePages={completePages} onUnclaimPage={unclaimPage}
        onClose={()=>setOpenJuz(null)} typeCfg={typeCfg} />}
      {showShare && <ShareModal hatimToken={hatimToken} onClose={()=>setShowShare(false)} />}
      {showInstall && <InstallModal onClose={()=>setShowInstall(false)} />}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardHatimCard({ id, onOpen, onRemove }) {
  const { hatim, loading } = useHatim(id);
  const [confirmDel, setConfirmDel] = useState(false);
  const [confirmEveryone, setConfirmEveryone] = useState(false);
  const closeDel = () => { setConfirmDel(false); setConfirmEveryone(false); };

  if (loading) return <div style={{ background:'var(--surface)', borderRadius:16, padding:'18px 22px', boxShadow:'var(--shadow)', border:'1.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:80 }}><Spinner /></div>;
  if (!hatim) return null;
  const owned = isOwnedHatim(id, hatim);

  if (hatim.deletedAt) return (
    <div className="fade-in" style={{ background:'var(--surface)', borderRadius:16, padding:'14px 22px', border:'1.5px dashed var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, opacity:0.8 }}>
      <div style={{ fontSize:13, color:'var(--textMuted)' }}><strong style={{ color:'var(--text)' }}>{hatim.title}</strong> · silindi</div>
      <div style={{ display:'flex', gap:8 }}>
        {owned && <Btn small onClick={()=>restoreHatim(id)}>↺ Geri Al</Btn>}
        <Btn small variant="ghost" onClick={()=>onRemove(id)}>Listemden kaldır</Btn>
      </div>
    </div>
  );

  const pageList = hatim.pageList || {};
  const typeCfg = getTypeCfg(hatim);
  const { done, claimed, pct } = getProgress(hatim, typeCfg);

  const removeFromList = () => { closeDel(); onRemove(id); };
  const deleteForEveryone = () => { closeDel(); softDeleteHatim(id); };

  return (
    <>
      <div className="fade-in" style={{ background:'var(--surface)', borderRadius:16, padding:'18px 22px', cursor:'pointer', boxShadow:'var(--shadow)', border:'1.5px solid var(--border)', transition:'transform 0.18s, box-shadow 0.18s', position:'relative' }}
        onClick={()=>onOpen(id)}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadowHover)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow)';}}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
              <div style={{ fontFamily:'Amiri,serif', fontSize:19, color:'var(--text)' }}>{hatim.title}</div>
              <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'var(--surfaceAlt)', color:'var(--textMuted)', fontWeight:700 }}>{typeCfg.emoji}</span>
            </div>
            <div style={{ fontSize:10, color:'var(--textMuted)' }}>{formatDate(hatim.createdAt)} · {hatim.organizer}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
            <div style={{ position:'relative', width:50, height:50, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ProgressRing pct={pct} size={50} stroke={5} />
              <div style={{ position:'absolute', fontSize:11, fontWeight:800, color:'var(--text)' }}>{pct}%</div>
            </div>
            <div style={{ fontSize:9, color:'var(--textMuted)' }}>{done}/{typeCfg.totalItems}</div>
            <button onClick={e=>{e.stopPropagation();setConfirmDel(true);}} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'var(--textMuted)', padding:'2px 4px', opacity:0.45, transition:'opacity 0.15s', marginTop:2 }}
              onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.45'}>🗑</button>
          </div>
        </div>
        <div style={{ marginTop:8, height:3, borderRadius:3, background:'var(--surfaceAlt)', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'var(--gold)', borderRadius:3, transition:'width 0.6s ease' }} />
        </div>
        <div style={{ display:'flex', gap:14, marginTop:6, fontSize:10, color:'var(--textMuted)', alignItems:'center' }}>
          <span style={{ color:'var(--primary)', fontWeight:700 }}>✓ {done} tamamlandı</span>
          <span>📖 {claimed} okunuyor</span>
          <span>○ {typeCfg.totalItems-done-claimed} boş</span>
        </div>
      </div>
      {confirmDel && (
        <Modal title="Hatimi Kaldır" onClose={closeDel}>
          {!confirmEveryone ? (
            <>
              <p style={{ fontSize:14, color:'var(--textMuted)', marginBottom:20, lineHeight:1.6 }}>
                <strong style={{ color:'var(--text)' }}>"{hatim.title}"</strong> hatimini listenizden kaldırmak istiyor musunuz? Diğer katılımcılar etkilenmez, link açılmaya devam eder.
              </p>
              <div style={{ display:'flex', gap:10 }}>
                <Btn onClick={removeFromList} style={{ flex:1 }}>Listemden Kaldır</Btn>
                <Btn variant="ghost" onClick={closeDel} style={{ flex:1 }}>İptal</Btn>
              </div>
              {owned && (
                <button onClick={()=>setConfirmEveryone(true)} style={{ marginTop:16, width:'100%', background:'none', border:'none', cursor:'pointer', fontSize:12, color:'oklch(55% 0.14 25)', textDecoration:'underline' }}>
                  Organizatör olarak herkes için sil…
                </button>
              )}
            </>
          ) : (
            <>
              <p style={{ fontSize:14, color:'var(--textMuted)', marginBottom:20, lineHeight:1.6 }}>
                <strong style={{ color:'var(--text)' }}>"{hatim.title}"</strong> hatimi <strong style={{ color:'var(--text)' }}>herkes için</strong> kapanacak. Linki açan herkes "silindi" mesajı görecek. Gerekirse bu cihazdan geri alabilirsiniz.
              </p>
              <div style={{ display:'flex', gap:10 }}>
                <Btn variant="danger" onClick={deleteForEveryone} style={{ flex:1 }}>Evet, Herkes İçin Sil</Btn>
                <Btn variant="ghost" onClick={closeDel} style={{ flex:1 }}>İptal</Btn>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

function Dashboard({ myHatimIds, addMyHatim, removeMyHatim, goToHatim }) {
  const [showCreate, setShowCreate] = useState(false);

  const onCreate = async (data) => {
    const token = generateHatimToken();
    const ref = getDb().ref(`hatimByToken/${token}`);
    await ref.set(data);
    markOwnedHatim(token);
    addMyHatim(token);
    setShowCreate(false);
    goToHatim(token);
  };

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'40px 20px 80px' }}>
      <div className="fade-in" style={{ textAlign:'center', marginBottom:36 }}>
        <h1 style={{ fontFamily:'Amiri,serif', fontSize:34, color:'var(--text)', marginBottom:8 }}>Hatim Paylaşım</h1>
        <p style={{ color:'var(--textMuted)', fontSize:13, lineHeight:1.7, maxWidth:380, margin:'0 auto' }}>
          Birlikte Kuran okumak için hatim oluştur ve paylaş.<br/>
          <em style={{ fontSize:12 }}>Create and share a hatim for collective Quran reading.</em>
        </p>
        <GoldDivider />
        <Btn onClick={()=>setShowCreate(true)} style={{ marginTop:6 }}>✦ Yeni Hatim Oluştur</Btn>
      </div>

      {myHatimIds.length === 0 ? (
        <div style={{ textAlign:'center', padding:'50px 20px', color:'var(--textMuted)' }}>
          <div style={{ fontFamily:'Amiri,serif', fontSize:52, color:'var(--gold)', opacity:0.4, marginBottom:10 }}>☽</div>
          <p style={{ fontSize:15 }}>Henüz hatim yok. Yukarıdan oluşturun.</p>
          <p style={{ fontSize:12, marginTop:6 }}>Veya birisinin paylaştığı linki açın.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <h2 style={{ fontSize:12, fontWeight:800, letterSpacing:'0.08em', color:'var(--textMuted)', textTransform:'uppercase' }}>Hatimlerim</h2>
          {myHatimIds.map(id => (
            <DashboardHatimCard key={id} id={id} onOpen={goToHatim} onRemove={removeMyHatim} />
          ))}
        </div>
      )}
      {showCreate && <CreateModal onCreate={onCreate} onClose={()=>setShowCreate(false)} />}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
function App() {
  const [configured, setConfigured] = useState(false);
  // This device's own name ("me"). Stored under a new key: the old sha_user
  // held whichever name was typed last, often someone else's.
  const [currentUser, setCurrentUser] = useState(() => ls('sha_me', ''));
  const [route, setRoute] = useState(getHashRoute);
  const { ids: myHatimIds, add: addMyHatim, remove: removeMyHatim } = useMyHatimIds();

  // Persist current user
  useEffect(() => { lsSet('sha_me', currentUser); }, [currentUser]);

  // Theme
  useEffect(() => {
    const t = THEMES.zumrut;
    const root = document.documentElement;
    Object.entries(t).forEach(([k,v]) => typeof v==='string' && root.style.setProperty('--'+k, v));
    document.body.style.background = t.bg;
    document.body.style.color = t.text;
  }, []);

  // Hash routing
  useEffect(() => {
    const onChange = () => setRoute(getHashRoute());
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => { window.removeEventListener('hashchange', onChange); window.removeEventListener('popstate', onChange); };
  }, []);

  // Initialize Firebase from baked-in config
  useEffect(() => {
    const cfg = window.FIREBASE_CONFIG;
    if (cfg && cfg.databaseURL) {
      const ok = initFirebase(cfg);
      if (ok) setConfigured(true);
    }
  }, []);

  useEffect(() => { syncHatimUrl(route); }, [route]);

  const goToHatim = (id) => { window.location.hash = `hatim/${id}`; };
  const goBack = () => { history.pushState(null, '', location.pathname); setRoute({ page:'dashboard' }); };

  if (!configured) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14 }}>
        <div style={{ fontFamily:'Amiri,serif', fontSize:44, color:'var(--gold)' }}>☽</div>
        <Spinner />
        <p style={{ color:'var(--textMuted)', fontSize:13 }}>Bağlanıyor…</p>
      </div>
    );
  }

  return (
    <>
      {route.page==='dashboard'
        ? <Dashboard myHatimIds={myHatimIds} addMyHatim={addMyHatim} removeMyHatim={removeMyHatim} goToHatim={goToHatim} />
        : <HatimPage hatimToken={route.id} addMyHatim={addMyHatim} goBack={goBack} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      }
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
