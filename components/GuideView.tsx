import React, { useState, useRef } from 'react';
import { speakText, playRawPCM } from '../services/geminiService';

const WAZU_NIYYAH = {
  arabic: "نَوَيْتُ أَنْ أَتَوضَّأَ لِلَّهِ تَعَالَى تَقَرُّبًا إِلَيْهِ",
  english: "I intend to perform Wazu for the sake of Allah, the Almighty, to seek His closeness.",
  bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  bismillahTrans: "(In the name of Allah, the Most Gracious, the Most Merciful)"
};

const WAZU_DUA_FINISH = {
  arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
  roman: "Ashhadu alla ilaha illallah wahdahu la sharika lahu wa ashhadu anna Muhammadan 'abduhu wa rasuluhu. Allahummaj 'alni minat-tawwabina waj 'alni minal-mutatahhirin.",
  english: "I bear witness that there is no god but Allah, alone without partner, and I bear witness that Muhammad is His servant and Messenger. O Allah, make me among those who turn to You in repentance and make me among those who are purified."
};

const WAZU_STEPS = [
  { 
    name: "Hands", 
    detail: "Wash hands up to the wrists 3 times, rubbing between fingers.", 
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اَلْحَمْدُ لِلَّهِ الَّذِي جَعَلَ الْمَاءَ طَهُورًا وَ جَعَلَ الْإِسْلَامَ نُورًا",
    roman: "Bismillahir Rahmanir Raheem. Alhamdu lillahilladhi ja'alal ma'a tahuran wa ja'alal islama nuran.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-wash-hands.png" 
  },
  { 
    name: "Mouth", 
    detail: "Rinse the mouth thoroughly 3 times.", 
    arabic: "اَللَّهُمَّ أَعِنِّي عَلَى تِلَاوَةِ الْقُرْآنِ وَ ذِكْرِكَ وَ شُكْرِكَ وَ حُسْنِ عِبَادَتِكَ",
    roman: "Allahumma a'inni 'ala tilawatil Qur'ani wa dhikrika wa shukrika wa husni 'ibadatik.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-rinse-mouth.png" 
  },
  { 
    name: "Nose", 
    detail: "Sniff water into the nostrils 3 times.", 
    arabic: "اَللَّهُمَّ أَرِحْنِي رَائِحَةَ الْجَنَّةِ وَ أَنْزِلْ عَلَيَّ مِنْ بَرَكَاتِكَ",
    roman: "Allahumma arihni ra'ihatal jannati wa anta 'anni radin.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-into-nose.png" 
  },
  { 
    name: "Face", 
    detail: "Wash the entire face 3 times.", 
    arabic: "اَللَّهُمَّ بَيِّضْ وَجْهِي يَوْمَ تَبْيَضُّ وُجُوهٌ وَ تَسْوَدُّ وُجُوهٌ",
    roman: "Allahumma bayyid wajhi yawma tabyaddu wujuhun wa taswaddu wujuh.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-wash-face.png" 
  },
  { 
    name: "Right Arm", 
    detail: "Wash up to the elbow 3 times.", 
    arabic: "اَللَّهُمَّ أَعْطِنِي كِتَابِي بِيَمِينِي وَ حَاسِبْنِي حِسَابًا يَسِيرًا",
    roman: "Allahumma a'tini kitabi biyamini wa hasibni hisaban yasira.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-wash-arms.png" 
  },
  { 
    name: "Left Arm", 
    detail: "Wash up to the elbow 3 times.", 
    arabic: "اَللَّهُمَّ لَا تُعْطِنِي كِتَابِي بِشِمَالِي وَ لَا مِنْ وَرَاءِ ظَهْرِي",
    roman: "Allahumma la tu'tini kitabi bishimali wa la min wara'i dhahri.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-wash-arms.png" 
  },
  { 
    name: "Head (Masah)", 
    detail: "Wipe wet hands over the head once.", 
    arabic: "اَللَّهُمَّ غَشِّنِي بِرَحْمَتِكَ وَ أَنْزِلْ عَلَيَّ مِنْ بَرَكَاتِكَ",
    roman: "Allahumma ghashshini birahmatika wa anzil 'alayya min barakatik.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-wash-hair.png" 
  },
  { 
    name: "Feet", 
    detail: "Wash feet up to the ankles 3 times.", 
    arabic: "اَللَّهُمَّ ثَبِّتْ قَدَمَيَّ عَلَى الصِّرَاطِ يَوْمَ تَزِلُّ فِيهِ الْأَعْلَى",
    roman: "Allahumma thabbit qadamayya 'alas-sirati yawma tazillu fihil aqdam.",
    img: "https://www.mymasjid.ca/wp-content/uploads/2016/10/wudu-wash-feet.png" 
  },
];

const SURAHS = [
  {
    name: "Surah Al Fatiha",
    meaning: "The Opening",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)",
    roman: "Bismillahir Rahmaanir Raheem. Alhamdu lillaahi Rabbil 'aalameen. Ar-Rahmaanir-Raheem. Maaliki Yawmid-Deen. Iyyaaka na'budu wa lyyaaka nasta'een. Ihdinas-Siraatal-Mustaqeem. Siraatal-ladheena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daalleen."
  },
  {
    name: "Surah Attahiyyatu lillahi was-salawatu",
    meaning: "Tashahhud",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنْ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    roman: "Attahiyyatu lillahi was-salawatu wat-tayyibatu, as-salamu 'alaika ayyuhan-nabiyyu wa rahmatullahi wa barakatuhu, as-salamu 'alaina wa 'ala 'ibadillahis-salihin, ashhadu alla ilaha illallah wa ashhadu anna Muhammadan 'abduhu wa rasuluhu."
  },
  {
    name: "Durood e Ibrahim",
    meaning: "Salutations on the Prophet",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    roman: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallaita 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin kama barakta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum Majid."
  },
  {
    name: "Surah Masoora",
    meaning: "Dua e Masoora",
    arabic: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أنتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
    roman: "Allahumma inni zalamtu nafsi zulman kathira wala yaghfiru dhunuba illa Anta faghfirli maghfiratan min 'Indika war-hamni innaka Antal Ghafurur Rahim."
  },
  {
    name: "Dua e qunoot",
    meaning: "Dua for Witr",
    arabic: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَکْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ. اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ نَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
    roman: "Allahumma inna nasta'inuka wa nastaghfiruka wa nu'minu bika wa natawakkalu 'alaika wa nuthni 'alaikal-khaira wa nashkuruka wala nakfuruka wa nakhla'u wa natruku man yafjuruk. Allahumma lyyaka na'budu wa laka nusalli wa nasjudu wa lyaika nas'a wa nahfidu narju rahmataka wa nakhsha 'adhabaka inna 'adhabaka bil-kuffari mulhiq."
  },
  {
    name: "Surah An-Nas",
    meaning: "The Mankind",
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ (1) مَلِكِ النَّاسِ (2) إِلَهِ النَّاسِ (3) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (4) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (5) مِنَ الْجِنَّةِ وَالنَّاسِ (6)",
    roman: "Qul a'oodhu birabbin naas. Malikin naas. Ilaahin naas. Min sharril waswaasil khannaas. Alladhee yuwaswisu fee sudoorin naas. Minal jinnati wannaas."
  },
  {
    name: "Surah Al-Falaq",
    meaning: "The Daybreak",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1) مِن شَرِّ مَا خَلَقَ (2) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (3) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (4) وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (5)",
    roman: "Qul a'oodhu birabbil falaq. Min sharri maa khalaq. Wa min sharri ghaasiqin idhaa waqab. Wa min sharrin-naffaathaati fil 'uqad. Wa min sharri haasidin idhaa hasad."
  },
  {
    name: "Surah Al-Ikhlas",
    meaning: "The Sincerity",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ (1) اللَّهُ الصَّمَدُ (2) لَمْ يَلِدْ وَلَمْ يُولَدْ (3) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (4)",
    roman: "Qul huwal laahu ahad. Allahus samad. Lam yalid wa lang yoolad. Wa lakum yakul lahoo kufuwan ahad."
  },
  {
    name: "Surah Al-Masad",
    meaning: "The Palm Fiber",
    arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ (1) مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ (2) سَيَصْلَى نَارًا ذَاتَ لَهَبٍ (3) وَامْرَأَتُهُ حَمَّالَةَ الْقُطَبِ (4) فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ (5)",
    roman: "Tabbat yadaaa abee lahabiw wa tabb. Maa aghnaa 'anhu maaluhoo wa maa khab. Saiyaslaa naaran dhaata lahab. Wamra'atuhoo hammaalatal hatab. Fee jeedihaa hablum mim masad."
  },
  {
    name: "Surah An-Nasr",
    meaning: "The Divine Support",
    arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ (1) وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا (2) فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا (3)",
    roman: "Idhaa jaaa'a nasrul laahi wal fath. Wa ra'aitan naasa yadkhuloona fee deenil laahi afwaajaa. Fasabbih bihamdi rabbika wastaghfirh; innahoo kaana tawwaaba."
  },
  {
    name: "Surah Al-Kafirun",
    meaning: "The Disbelievers",
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ (1) لَا أَعْبُدُ مَا تَعْبُدُونَ (2) وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ (3) وَلَا أَنَا عَابِدٌ مَّا عَدَتُّمْ (4) وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ (5) لَكُمْ دِينُكُمْ وَلِيَ دِينِ (6)",
    roman: "Qul yaa ayyuhal kaafiroon. Laa a'budu maa ta'budoon. Wa laa antum 'aabidoona maaa a'bud. Wa laaa ana 'aabidum maa 'abattum. Wa laaa antum 'aabidoona maaa a'bud. Lakum deenukum wa liya deen."
  },
  {
    name: "Surah Al-Kauthar",
    meaning: "The Abundance",
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ (1) فَصَلِّ لِرَبِّكَ وَانْحَرْ (2) إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ (3)",
    roman: "Innaaa a'tainaakal kauthar. Fasalli lirabbika wanhar. Inna shaani'aka huwal abtar."
  },
  {
    name: "Surah Al-Ma'un",
    meaning: "Small Kindnesses",
    arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ (1) فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ (2) وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ (3) فَوَيْلٌ لِّلْمُصَلِّينَ (4) الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ (5) الَّذِينَ هُمْ يُرَاءُونَ (6) وَيَمْنَعُونَ الْمَاعُونَ (7)",
    roman: "Ara'aytal ladhee yukadhdhibu biddeen. Fadhaalikal ladhee yadu'ul yateem. Wa laa yahuddu 'alaa ta'aamil miskeen. Fawailul lil musalleen. Alladheena hum 'an salaatihim saahoon. Alladheena hum yuraaa'oon. Wa yamna'oonal maa'oon."
  },
  {
    name: "Surah Quraish",
    meaning: "The Quraish",
    arabic: "لِإِيلَافِ قُرَيْشٍ (1) إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ (2) فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ (3) الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ (4)",
    roman: "Li eelaafi quraish. Eelaafihim rihlatash shitaaa'i wassaif. Falya'budoo rabba haadhal bait. Alladhee at'amahum min joo'inw wa aamanahum min khauf."
  },
  {
    name: "Surah Al-Fil",
    meaning: "The Elephant",
    arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ (1) أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ (2) وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ (3) تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ (4) فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ (5)",
    roman: "Alam tara kaifa fa'ala rabbuka bi ashaabil feel. Alam yaj'al kaidahum fee tadleel. Wa arsala 'alaihim tairan abaabeel. Tarmeehim bihijaaratim min sijjeel. Faja'alahum ka'asfim m'akool."
  },
  {
    name: "Surah Al-Humazah",
    meaning: "The Scorner",
    arabic: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ (1) الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ (2) يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ (3) كَلَّا لَيُنبَذَنَّ فِي الْحُطَمَةِ (4) وَما أَدْراكَ مَا الْحُطَمَةُ (5) نَارُ اللَّهِ الْمُوقَدَةُ (6)",
    roman: "Wailul likulli humazatil lumazah. Alladhee jama'a maalanw wa 'addadah. Yahsabu anna maalahooo akhladah. Kallaa layumbadhanna fil hutamah. Wa maaa adraaka mal hutamah. Naarul laahil mooqadah."
  },
  {
    name: "Surah Al-Asr",
    meaning: "The Time",
    arabic: "وَالْعَصْرِ (1) إِنَّ الْإِنسَانَ لَفِي خُسْرٍ (2) إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ (3)",
    roman: "Wal 'asr. Innal insaana lafee khusr. Illal ladheena aamanoo wa 'amilus saalihaati wa tawaasaw bilhaqqi wa tawaasaw bissabr."
  },
  {
    name: "Surah At-Takathur",
    meaning: "The Rivalry",
    arabic: "أَلْهَاكُمُ التَّكَاثُرُ (1) حَتَّى زُرْتُمُ الْمَقَابِرَ (2) كَلَّا سَوْفَ تَعْلَمُونَ (3) ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ (4) كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ (5)",
    roman: "Al haakumut takaathur. Hattaa zurtumul maqaabir. Kallaa saufa ta'lamoon. Thumma kallaa saufa ta'lamoon. Kallaa lau ta'lamoona 'ilmal yaqeen."
  },
  {
    name: "Surah Al-Qari'ah",
    meaning: "The Striking Hour",
    arabic: "الْقَارِعَةُ (1) مَا الْقَارِعَةُ (2) وَمَا أَدْرَاكَ مَا الْقَارِعَةُ (3) يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ (4) وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنْفُوشِ (5)",
    roman: "Al qaari'ah. Mal qaari'ah. Wa maaa adraaka mal qaari'ah. Yauma yakoonun naasu kalfaraashil mabthooth. Wa takeonul jibaalu kal'ihnil manfoosh."
  },
  {
    name: "Surah Al-Adiyat",
    meaning: "The Chargers",
    arabic: "وَالْعَادِيَاتِ ضَبْحًا (1) فَالْمُورِيَاتِ قَدْحًا (2) فَالْمُغِيرَاتِ صُبْحًا (3) فَأَثَرْنَ بِهِ نَقْعًا (4) فَوَسَطْنَ بِهِ جَمْعًا (5)",
    roman: "Wal 'aadiyaati dabha. Fal mooriyaati qadha. Fal mugheeraati subha. Fa atharna bihee naq'aa. Fawasatna bihee jam'aa."
  },
  {
    name: "Surah Az-Zalzalah",
    meaning: "The Earthquake",
    arabic: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا (1) وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا (2) وَقَالَ الْإِنسَانُ مَا لَهَا (3) يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا (4)",
    roman: "Idhaa zulzilatil ardu zilzaalahaa. Wa akhrajatil ardu athqaalahaa. Wa qaalal insaanu maa lahaa. Yauma'idhin tuhaddithu akhbaarahaa."
  },
  {
    name: "Surah Al-Bayyinah",
    meaning: "The Clear Evidence",
    arabic: "لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنفَكِّينَ حَتَّى تَأْتِيَهُمُ الْبَيِّنَةُ (1) رَسُولٌ مِّنَ اللَّهِ يَتْلُو صُحُفًا مُّطَهَّرَةً (2)",
    roman: "Lam yakunil ladheena kafaroo min ahlil kitaabi wal mushrikeena munfakkeena hattaa ta'tiyahumul baiyinah. Rasoolum minal laahi yetloo suhufam mutahharah."
  },
  {
    name: "Surah Al-Qadr",
    meaning: "The Power",
    arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ (1) وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ (2) لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ (3)",
    roman: "Innaaa anzalnaahu fee lailatil qadr. Wa maaa adraaka maa lailatul qadr. Lailatul qadri khairum min alfee shahr."
  }
];

const DAILY_PRAYERS = [
  {
    name: "Tahiyyatul-wazu",
    time: "After Wazu",
    rakats: "2 Rakat Nafl (Dugana)",
    niyyah: {
      arabic: "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى رَكْعَتَيْنِ صَلَاةَ تَحِيَّةِ الْوُضُوءِ، شُكْرًا لِلَّهِ تَعَالَى مُتَابِعَةَ الْمَهْدِيِّ الْمَوْعُودِ مُتَوَجِّهًا إِلَى جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      english: "I intend to perform 2 Rakats of Tahiyyatul-wazu as gratitude to Allah, following the Mahdi Al-Mau'ood (A.S.), facing the Honorable Kaaba."
    },
    tariqa: [
      { step: "Facing Qibla & Niyyath", detail: "Stand facing the Qibla and make the intention (Niyyath) in your heart or tongue.", recitation: "نَوَيْتُ أَنْ أُصَلِّيَ..." },
      { step: "Takbeer-e-Awwal", detail: "Raise hands like a duck's feet (fingers open naturally, palms to Qibla) so thumbs touch the earlobes.", recitation: "الله أكبر" },
      { step: "Standing (Qiyam) & Sana", detail: "Fold hands below the navel, right hand over left wrist, and recite the Sana.", recitation: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ" },
      { 
        step: "1st Rakat Recitation", 
        detail: "Recite Surah Al-Fatiha followed by Ayah 135 of Surah Aal-Imran: وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنْفُسَهُمْ ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ وَمَنْ يَغْفِرُ الذُّنُوبَ إِلَّا اللَّهُ وَلَمْ يُصِرُّوا عَلَىٰ مَا فَعَلُوا وَهُمْ يَعْلَمُونَ", 
        recitation: "وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنْفُسَهُمْ ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ وَمَنْ يَغْفِرُ الذُّنُوبَ إِلَّا اللَّهُ وَلَمْ يُصِرُّوا عَلَىٰ مَا فَعَلُوا وَهُمْ يَعْلَمُونَ"
      },
      { 
        step: "2nd Rakat Recitation", 
        detail: "Recite Surah Al-Fatiha followed by Ayah 110 of Surah An-Nisa: وَمَنْ يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَحِيمًا", 
        recitation: "وَمَنْ يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَحِيمًا"
      },
      { step: "Completion", detail: "Finish with standard Tashahhud, Durood, and Salam.", recitation: "اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ" }
    ],
    sajdaDua: [
      { 
        step: "Sajda-e-Dua", 
        detail: "After Salam, perform one Sajda and recite the following combined supplication.", 
        recitation: "اللَّهُمَّ لَكَ سَجَدَ جِسْمِي، وَبِكَ آمَنَ قَلْبِي، وَلِسَانِي أَقَرَّ بِكَ. اللَّهُمَّ إِنِّي قَدْ أَذْنَبْتُ ذَنْبًا عَظِيمًا، وَلَا يَغْفِرُ الذَّنْبَ الْعَظِيمَ إِلَّا الرَّبُّ الْعَظِيمُ، لَا إِلَهَ إِلَّا الرَّبُّ الْعَظِيمُ.\n\nاللَّهُمَّ كَفَانِي مِنْ نَعِيمِ الدُّنْيَا مَحَبَّتُكَ وَالشَّوْقُ إِلَيْكَ وَذِكْرُكَ، وَكَفَانِي مِنْ نَعِيمِ الْآخِرَةِ رُؤْيَتُكَ وَرِضْوَانُكَ بِفَضْلِكَ وَكَرَمِكَ، يَا أَكْرَمَ الْأَكْرَمِينَ.",
        roman: "Allahumma laka sajada jismi, wa bika amana qalbi, wa lisani aqarra bika. Allahumma inni qad adhnabtu dhanban 'azeeman, wa la yaghfiru adh-dhanba al-'azeema illa ar-Rabbu al-'Azeem, la ilaha illa ar-Rabbu al-'Azeem. Allahumma kafani min na'eemi ad-dunya mahabbatuka wash-shawqu ilayka wa dhikruka, wa kafani min na'eemi al-akhirati ruyatuka wa ridwanuka bi-fadlika wa karamika, ya akrama al-akrameen.",
        meaning: "O Allah, my body has prostrated to You, my heart has believed in You, and my tongue has testified to You. O Allah, I am in a state where I have committed a great sin, and none can forgive a great sin except the Great Lord; there is no god but the Great Lord. O Allah, sufficient for me as a blessing in this world is Your love, the longing for You, and Your remembrance. And sufficient for me as a blessing in the Hereafter is the vision of You and Your pleasure, by Your grace and Your generosity, O Most Generous of the generous."
      }
    ]
  },
  { 
    name: "Fajr", 
    time: "Before Sunrise", 
    rakats: "2 Sunnah, 2 Fard", 
    niyyah: {
      arabic: "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى رَكْعَتَيْنِ صَلَاةَ الْفَجْرِ فَرْضُ اللهِ تَعَالَى مُتَوَجِّهًا إِلَى الْكَعْبَةِ الْمُشَرَّفَةِ",
      english: "I intend to perform 2 Rakats of Fajr Fard for the sake of Allah, facing the Honorable Kaaba."
    },
    tariqa: [
      { step: "Takbir Tahrimah", detail: "Raise hands to ears and say 'Allahu Akbar' to start.", recitation: "الله أكبر" },
      { step: "Qiyam", detail: "Recite Sana, Al-Fatiha, and a Surah.", recitation: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ" },
      { step: "Ruku", detail: "Bowing with back level.", recitation: "سُبْحَانَ رَبِّيَ الْعَظِيمِ" },
      { step: "Sajdah", detail: "Prostration on the ground.", recitation: "سُبْحَانَ رَبِّيَ الْأَعْلَى" },
      { step: "Tashahhud", detail: "Final sitting for Dua and Salams.", recitation: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ" }
    ]
  },
  { 
    name: "Dhuhr", 
    time: "After Noon", 
    rakats: "4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl", 
    niyyah: {
      arabic: "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى أَرْبَعَ رَكَعَاتٍ صَلَاةَ الظُّهْرِ فَرْضُ اللهِ تَعَالَى مُتَوَجِّهًا إِلَى الْكَعْبَةِ الْمُشَرَّفَةِ",
      english: "I intend to perform 4 Rakats of Dhuhr Fard for the sake of Allah, facing the Honorable Kaaba."
    },
    tariqa: [
      { step: "1st & 2nd Rakats", detail: "Include Fatiha and a Surah.", recitation: "سُورَةُ الْفَاتِحَةِ" },
      { step: "Middle Sitting", detail: "Sit for Tashahhud after 2nd Rakat.", recitation: "التَّحِيَّاتُ لِلَّهِ" },
      { step: "3rd & 4th Rakats", detail: "Only recite Al-Fatiha in Fard.", recitation: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
      { step: "Final Sitting", detail: "Sit for Tashahhud, Durood, and Salam.", recitation: "اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ" }
    ]
  },
  { 
    name: "Asr", 
    time: "Late Afternoon", 
    rakats: "4 Sunnah, 4 Fard", 
    niyyah: {
      arabic: "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى أَرْبَعَ رَكَعَاتٍ صَلَاةَ الْعَصْرِ فَرْضُ اللهِ تَعَالَى مُتَوَجِّهًا إِلَى الْكَعْبَةِ الْمُشَرَّفَةِ",
      english: "I intend to perform 4 Rakats of Asr Fard for the sake of Allah, facing the Honorable Kaaba."
    },
    tariqa: [
      { step: "Performance", detail: "Perform 4 Rakats silently, similar to Dhuhr.", recitation: "الله أكبر" },
      { step: "Final Completion", detail: "Complete with Tashahhud and Salam.", recitation: "اَلسَّلَامُ عَلَيْكُمْ" }
    ]
  },
  { 
    name: "Maghrib", 
    time: "Sunset", 
    rakats: "3 Fard, 2 Sunnah, 2 Nafl", 
    niyyah: {
      arabic: "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى ثَلَاثَ رَكَعَاتٍ صَلَاةَ الْمَغْرِبِ فَرْضُ اللهِ تَعَالَى مُتَوَجِّهًا إِلَى الْكَعْبَةِ الْمُشَرَّفَةِ",
      english: "I intend to perform 3 Rakats of Maghrib Fard for the sake of Allah, facing the Honorable Kaaba."
    },
    tariqa: [
      { step: "1st & 2nd Rakats", detail: "Audible recitation of Fatiha and Surah.", recitation: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
      { step: "3rd Rakat", detail: "Rise for one more Rakat (silent Fatiha only).", recitation: "بِسْمِ اللَّهِ" },
      { step: "Completion", detail: "Tashahhud and Salam after 3rd Rakat.", recitation: "اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ" }
    ]
  },
  { 
    name: "Isha", 
    time: "Night", 
    rakats: "4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl, 3 Witr, 2 Nafl", 
    niyyah: {
      arabic: "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى أَرْبَعَ رَكَعَاتٍ صَلَاةَ الْعِشَاءِ فَرْضُ اللهِ تَعَالَى مُتَوَجِّهًا إِلَى الْكَعْبَةِ الْمُشَرَّفَةِ",
      english: "I intend to perform 4 Rakats of Isha Fard for the sake of Allah, facing the Honorable Kaaba."
    },
    tariqa: [
      { step: "Fard 4 Rakats", detail: "Perform as usual for 4 Rakat prayers.", recitation: "الله أكبر" },
      { step: "Witr 3 Rakats", detail: "Includes Dua-e-Qunut in 3rd Rakat.", recitation: "اَللّٰهُمَّ إنا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ" }
    ]
  },
];

const GuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wazu' | 'prayers' | 'surahs'>('wazu');
  const [selectedPrayerIdx, setSelectedPrayerIdx] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSpeak = async (text: string, id: string) => {
    if (loadingAudio) return;
    setLoadingAudio(id);

    try {
      // AudioContext initialization and API call handled centrally in the service
      const audio = await speakText(text);
      if (audio) {
        await playRawPCM(audio);
      }
    } catch (err: any) {
      console.error("Recitation error:", err);
      // Inform the user about the failure with the specific error message
      alert(`Recitation failed: ${err.message || "Please check your internet connection or API key selection."}`);
    } finally {
      setLoadingAudio(null);
    }
  };

  const handleVideoError = () => {
    let msg = "The guide video could not be loaded.";
    const videoElement = videoRef.current;
    if (videoElement && videoElement.error) {
        const error = videoElement.error;
        const errorMsg = error.message ? String(error.message) : "Network or file issue";
        msg = `Video Error (Code ${error.code}): ${errorMsg}`;
        console.error("Video Error Details:", error);
    }
    setVideoErrorMessage(msg);
    setVideoError(true);
  };

  const selectedPrayer = DAILY_PRAYERS[selectedPrayerIdx];

  return (
    <div className="max-w-5xl mx-auto w-full py-8 space-y-8 px-4 flex flex-col min-h-screen">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tighter">Spiritual Guide</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Knowledge • Practice • Devotion</p>
      </div>

      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl shrink-0 shadow-2xl">
        {['wazu', 'prayers', 'surahs'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:text-white'}`}
          >
            {tab === 'wazu' ? 'Wazu' : tab === 'prayers' ? 'Prayers' : 'Surahs'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-32">
        {activeTab === 'wazu' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="glass rounded-3xl p-8 border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent flex flex-col items-center space-y-6">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Niyyah</h3>
              <p className="text-4xl md:text-5xl font-serif text-white rtl text-center leading-relaxed">{WAZU_NIYYAH.arabic}</p>
              <p className="text-sm text-slate-400 italic">"{WAZU_NIYYAH.english}"</p>
              <button onClick={() => handleSpeak(WAZU_NIYYAH.arabic, 'wazu-niyyah')} className="px-4 py-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                {loadingAudio === 'wazu-niyyah' ? 'Reciting...' : 'Recite Niyyah'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {WAZU_STEPS.map((step, i) => (
                <div key={i} className="glass rounded-3xl p-6 border border-white/5 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">{i+1}</span>
                      <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">{step.name}</h4>
                    </div>
                    <button onClick={() => handleSpeak(step.arabic, `wazu-step-${i}`)} className="p-2 rounded-lg bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all">
                      {loadingAudio === `wazu-step-${i}` ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>}
                    </button>
                  </div>
                  <img src={step.img} className="w-full h-48 object-contain bg-black/20 rounded-2xl p-4" alt={step.name} />
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.detail}</p>
                  <p className="text-lg font-serif text-white rtl text-right leading-relaxed border-t border-white/5 pt-4">{step.arabic}</p>
                  <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">{step.roman}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-3xl p-8 border border-emerald-500/20 bg-emerald-500/5 space-y-6 text-center">
              <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Dua After Wazu</h3>
              <p className="text-3xl md:text-4xl font-serif text-white rtl leading-relaxed">{WAZU_DUA_FINISH.arabic}</p>
              <p className="text-sm text-slate-400 italic">"{WAZU_DUA_FINISH.english}"</p>
              <button onClick={() => handleSpeak(WAZU_DUA_FINISH.arabic, 'wazu-dua-end')} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-emerald-900/40">
                {loadingAudio === 'wazu-dua-end' ? 'Reciting...' : 'Recite Complete Dua'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'prayers' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
            {/* Prayer Selection Bar: Horizontal Scroll on Mobile */}
            <div className="flex flex-row flex-nowrap overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-6 md:overflow-x-visible md:pb-0 snap-x scrollbar-hide">
              {DAILY_PRAYERS.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedPrayerIdx(i)}
                  className={`relative glass rounded-2xl p-6 border transition-all text-left group overflow-hidden shrink-0 w-[200px] md:w-auto snap-center ${selectedPrayerIdx === i ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/20'}`}
                >
                  <h4 className="text-lg font-black text-white leading-tight">{p.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">{p.time}</p>
                  <p className="text-[9px] text-indigo-400 font-black">{p.rakats}</p>
                  {selectedPrayerIdx === i && <div className="absolute top-2 right-2 text-indigo-500 animate-bounce"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"/></svg></div>}
                </button>
              ))}
            </div>

            <div className="glass rounded-3xl p-10 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent flex flex-col items-center space-y-6">
              <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest">{selectedPrayer.name} Intention</span>
              <p className="text-4xl md:text-5xl font-serif text-white rtl text-center leading-relaxed transition-all duration-500">{selectedPrayer.niyyah.arabic}</p>
              <p className="text-sm text-slate-400 italic text-center">"{selectedPrayer.niyyah.english}"</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tariqa for {selectedPrayer.name}</h3>
              {selectedPrayer.tariqa.map((step, i) => (
                <div key={i} className="glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-500/30 animate-in fade-in zoom-in duration-300">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-indigo-400">{i+1}</span>
                      <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{step.step}</h3>
                    </div>
                    <p className="text-sm text-slate-500 ml-12 font-medium leading-relaxed">{step.detail}</p>
                    
                    {/* Arabic version of specific ayahs directly in the Tariqa steps */}
                    {selectedPrayer.name === "Tahiyyatul-wazu" && (step.step.includes("Recitation")) && (
                      <div className="ml-12 mt-4 p-6 bg-indigo-900/20 rounded-2xl border border-indigo-500/20 shadow-xl overflow-hidden animate-in zoom-in duration-500">
                         <p className="text-2xl md:text-4xl font-serif text-white rtl text-right leading-[1.8] whitespace-pre-wrap">
                           {step.recitation}
                         </p>
                         <div className="flex items-center gap-2 mt-4 text-indigo-400">
                           <div className="h-px flex-1 bg-indigo-500/20"></div>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Full Arabic Text to Recite</span>
                           <div className="h-px flex-1 bg-indigo-500/20"></div>
                         </div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleSpeak(step.recitation, `${selectedPrayer.name}-step-${i}`)} className="px-6 py-3 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 h-fit">
                    {loadingAudio === `${selectedPrayer.name}-step-${i}` ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Recite'}
                  </button>
                </div>
              ))}
              
              {/* Sajda-e-Dua Section */}
              {selectedPrayer.sajdaDua && (
                <div className="mt-12 space-y-4">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-8">
                     <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Post-Namaz Sajda-e-Dua</span>
                     <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  {selectedPrayer.sajdaDua.map((step, i) => (
                    <div key={`sajda-${i}`} className="glass rounded-2xl p-6 border border-emerald-500/10 flex flex-col gap-6 group hover:border-emerald-500/30 bg-emerald-500/[0.02]">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="space-y-2">
                           <div className="flex items-center gap-4">
                             <span className="w-8 h-8 rounded-full bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400">{i+1}</span>
                             <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{step.step}</h3>
                           </div>
                           <p className="text-sm text-slate-500 ml-12 font-medium">{step.detail}</p>
                         </div>
                         <button onClick={() => handleSpeak(step.recitation, `sajda-${i}`)} className="px-6 py-3 rounded-xl bg-slate-900 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shrink-0 self-start md:self-center">
                           {loadingAudio === `sajda-${i}` ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Recite Full Dua'}
                         </button>
                       </div>
                       
                       <div className="space-y-4 border-t border-white/5 pt-4">
                          <p className="text-2xl md:text-3xl font-serif text-white rtl text-right leading-loose whitespace-pre-wrap">{step.recitation}</p>
                          {step.roman && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Transliteration</p>
                              <p className="text-xs text-slate-400 italic leading-relaxed">{step.roman}</p>
                            </div>
                          )}
                          {step.meaning && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Meaning</p>
                              <p className="text-xs text-slate-300 font-medium leading-relaxed">{step.meaning}</p>
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tariqa Video Section */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Salah Method (Tareeka) Video</h3>
                <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Visual Instructional Guide</p>
              </div>
              <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative aspect-video bg-black flex flex-col justify-center group">
                {videoError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md text-slate-400 p-8 text-center gap-4 border border-white/5 animate-in fade-in duration-700 overflow-y-auto">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-indigo-400 mb-2">
                       <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                     </div>
                     <div>
                       <h4 className="text-lg font-bold text-white mb-1">Instructional Video Unavailable</h4>
                       <p className="text-sm text-slate-500">{videoErrorMessage || "The guide video could not be loaded."}</p>
                     </div>
                     
                     <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 text-left max-w-md mx-auto">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Developer Note</p>
                        <p className="text-xs text-slate-400 font-mono leading-relaxed">
                          Please ensure the file <span className="text-indigo-400">Hazrat-Peer-o-Murshid-practical-tareeqe.mp4</span> exists in your <span className="text-white">public/videos/</span> directory.
                          <br/><br/>
                          Note: Filenames are case-sensitive.
                        </p>
                     </div>

                     <button 
                       onClick={() => { setVideoError(false); setVideoErrorMessage(null); if(videoRef.current) { videoRef.current.load(); } }} 
                       className="mt-4 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all"
                     >
                       Retry Connection
                     </button>
                  </div>
                ) : (
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    onError={handleVideoError}
                    src="videos/Hazrat-Peer-o-Murshid-practical-tareeqe.mp4"
                    poster="https://images.unsplash.com/photo-1590076214667-c0f33b98c44a?auto=format&fit=crop&w=1200&q=80"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest mt-6">Complete step-by-step demonstration for all believers.</p>
            </div>
          </div>
        )}

        {activeTab === 'surahs' && (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom duration-500">
            {SURAHS.map((surah, i) => (
              <div key={i} className="glass rounded-3xl p-8 border border-white/5 space-y-6 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">{surah.name}</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{surah.meaning}</p>
                  </div>
                  <button 
                    onClick={() => handleSpeak(surah.arabic, `surah-${i}`)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    {loadingAudio === `surah-${i}` ? 'Reciting...' : 'Recite'}
                  </button>
                </div>
                <p className="text-3xl md:text-4xl font-serif text-white rtl text-right leading-loose">{surah.arabic}</p>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Roman Transliteration</p>
                  <p className="text-xs text-slate-400 leading-relaxed italic">{surah.roman}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideView;