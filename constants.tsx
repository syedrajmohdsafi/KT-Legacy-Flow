
import { Person, ShajraItem, ShajraLine } from './types';

const uid = () => Math.random().toString(36).substr(2, 9);

export const PATERNAL_ANCESTRY: Person = {
  id: 'root-shasha-miya',
  name: 'Hazrat Pir-o-Murshid Syed Shah Shasha Miya Sahab (R.A.)',
  urduName: 'حضرت پیر و مرشد سید شاہ شاشہ میاں صاحب رحمتہ اللہ علیہ',
  spouse: 'Hazrath Syeda Sabira Bano (alias Sabni Bi)',
  role: 'Root',
  spouseRole: 'W',
  image: 'https://images.unsplash.com/photo-1590076214667-c0f33b98c44a?auto=format&fit=crop&w=1000&q=80',
  children: [
    {
      id: 'branch-a-meerasa',
      name: 'Hazrat Pir-o-Murshid Syed Meerasa Miya (R.A.)',
      role: 'S',
      spouse: 'Hazrath Sahab Khan Bi (alias Dadi Bi)',
      spouseRole: 'W',
      children: [
        {
          id: uid(),
          name: 'Hazrat Syed Asadullah Miya',
          role: 'S',
          spouse: 'Hazrath Rajna Bi',
          spouseRole: 'W',
          children: [
            { id: uid(), name: 'Syed Abid Miya', role: 'S', spouse: 'Syeda Waheeda Bano', spouseRole: 'W' },
            { id: uid(), name: 'Syeda Qamar Bano', role: 'D', spouse: 'Syed Sarfraz Mujtahedi', spouseRole: 'H' }
          ]
        },
        {
          id: uid(),
          name: 'Hazrat Pir-o-Murshid Syed Ibrahim Badshah Miya',
          role: 'S',
          spouse: 'Hazrath Syeda Kubra Bano',
          spouseRole: 'W',
          children: [
            {
              id: uid(),
              name: 'Syeda Qamar-ul-Nisa (alias Chandu Bi Bi)',
              role: 'D',
              spouse: 'Syed Ajmal Mehmoodi',
              spouseRole: 'H',
              children: [
                {
                  id: uid(),
                  name: 'Syed Khundmir Najeeb',
                  role: 'S',
                  spouse: 'Syeda Arifa Bano',
                  spouseRole: 'W',
                  children: [
                    { id: uid(), name: 'Yaqoob', role: 'S' },
                    { id: uid(), name: 'Khurshid', role: 'S' },
                    { id: uid(), name: 'Daughter', role: 'D' }
                  ]
                },
                { id: uid(), name: 'Syed Meeran Muneer', role: 'S', spouse: 'Syeda Zikra Bano', spouseRole: 'W' },
                { 
                  id: uid(), 
                  name: 'Syeda Najma Bano', 
                  role: 'D', 
                  spouse: 'Syed Abul Qasim Ishaqi', 
                  spouseRole: 'H',
                  children: [
                    { id: uid(), name: 'Son 1', role: 'S' },
                    { id: uid(), name: 'Son 2', role: 'S' },
                    { id: uid(), name: 'Daughter 1', role: 'D' },
                    { id: uid(), name: 'Daughter 2', role: 'D' },
                    { id: uid(), name: 'Daughter 3', role: 'D' }
                  ]
                },
                { id: uid(), name: 'Syeda Khair-un-Nisa (Nahid Bano)', role: 'D', spouse: 'Syed Alam Mehdi', spouseRole: 'H' },
                { id: uid(), name: 'Syeda Majida Bano', role: 'D', spouse: 'Syed Shabab Miya', spouseRole: 'H' }
              ]
            },
            {
              id: uid(),
              name: 'Syeda Sabira Bano',
              role: 'D',
              spouse: 'Syed Muhammad Miya',
              spouseRole: 'H',
              children: [
                { id: uid(), name: 'Syed Dilawar Khundmiri', role: 'S', spouse: 'Khoonza Gohar Farheen', spouseRole: 'W' },
                { 
                  id: uid(), 
                  name: 'Syed Noor Muhammad Tehseen Khundmiri', 
                  role: 'S', 
                  spouse: 'Syeda Hina Ambreen', 
                  spouseRole: 'W',
                  children: [
                    { id: uid(), name: 'Son 1', role: 'S' },
                    { id: uid(), name: 'Son 2', role: 'S' },
                    { id: uid(), name: 'Son 3', role: 'S' },
                    { id: uid(), name: 'Daughter', role: 'D' }
                  ]
                },
                { id: uid(), name: 'Syeda Noor-un-Nisa (Shakira Bano)', role: 'D', spouse: 'Syed Mushtaq Miya', spouseRole: 'H' }
              ]
            }
          ]
        },
        { id: uid(), name: 'Syed Accha Miya', role: 'S' },
        { id: uid(), name: 'Hazrata Syeda Machhan Bi', role: 'D', spouse: 'Dadan Miya Sahab', spouseRole: 'H' },
        {
          id: uid(),
          name: 'Hazrata Syeda Meher-un-Nisa',
          role: 'D',
          spouse: 'Syed Alam Miya',
          spouseRole: 'H',
          children: [
            { id: uid(), name: 'Syed Abid Miya', role: 'S' },
            { id: uid(), name: 'Syeda Khamar Banu', role: 'D' }
          ]
        }
      ]
    },
    {
      id: 'branch-b-haji',
      name: 'Hazrat Syed Haji Miya Sahab (R.A.)',
      role: 'S',
      spouse: 'Mohtar-ma Syeda Masa Bibi Sahaba (Wife 1)',
      spouseRole: 'W',
      children: [
        {
          id: uid(),
          name: 'Hazrat Syed Qasim (alias Qasu Miya)',
          role: 'S',
          spouse: 'Hazrata Syeda Ilha Dadi',
          spouseRole: 'W',
          children: [
            {
              id: uid(),
              name: 'Hazrath Syed Ahmed Yedullahi (alias Badshah Miya)',
              role: 'S',
              spouse: 'Hazrath Syeda Khalida Bano (Khuda-zadi Bi)',
              spouseRole: 'W',
              children: [
                { id: uid(), name: 'Hazrath Syed Irfan Yedullahi', role: 'S' },
                { id: uid(), name: 'Syed Farhan Yedullahi', role: 'S', spouse: 'Syeda Sumera', spouseRole: 'W', children: [{ id: uid(), name: 'Son', role: 'S' }] },
                { id: uid(), name: 'Syed Rehan Yedullahi', role: 'S' },
                { id: uid(), name: 'Syed Rizwan Yedullahi', role: 'S', spouse: 'Syeda Shafteen', spouseRole: 'W', children: [{ id: uid(), name: 'Son', role: 'S' }, { id: uid(), name: 'Daughter 1', role: 'D' }, { id: uid(), name: 'Daughter 2', role: 'D' }] },
                { id: uid(), name: 'Syed Suleman Yedullahi', role: 'S', spouse: 'Syeda Zeba', spouseRole: 'W', children: [{ id: uid(), name: 'Son 1', role: 'S' }, { id: uid(), name: 'Son 2', role: 'S' }] },
                { id: uid(), name: 'Syed Faizan Yedullahi', role: 'S', spouse: 'Syeda Shafaqat', spouseRole: 'W', children: [{ id: uid(), name: 'Daughter 1', role: 'D' }, { id: uid(), name: 'Daughter 2', role: 'D' }] },
                { id: uid(), name: 'Syeda Mateen', role: 'D' },
                { id: uid(), name: 'Syeda Nousheen', role: 'D' },
                { id: uid(), name: 'Syeda Ambreen', role: 'D' },
                { id: uid(), name: 'Syeda Sabreen', role: 'D' },
                { id: uid(), name: 'Syeda Noreen', role: 'D' }
              ]
            },
            {
              id: uid(),
              name: 'Hazrath Syed Muhammad Taqi Yeduallahi (Sardar Miya)',
              role: 'S',
              spouse: 'Hazrath Syeda Khadija Bano',
              spouseRole: 'W',
              children: [
                { id: uid(), name: 'Syed Alam Shaji Yedullahi', role: 'S', spouse: 'Syeda Seema Fatima', spouseRole: 'W', children: [{ id: uid(), name: 'Syed Ali Naimath Muqashif', role: 'S' }, { id: uid(), name: 'Syed Abdul Khader Munqashif', role: 'S' }, { id: uid(), name: 'Syeda Ushna Fatima', role: 'D' }, { id: uid(), name: 'Syeda Afifa Fatima', role: 'D' }] },
                { id: uid(), name: 'Syed Mahmood Sami', role: 'S', spouse: 'Syeda Sheeba Tahmeen', spouseRole: 'W', children: [{ id: uid(), name: 'Syed Mohammed Dilshad', role: 'S' }, { id: uid(), name: 'Syeda Raziya Fatima (Tayyaba)', role: 'D' }] },
                { id: uid(), name: 'Syed Ibrahim Zakee', role: 'S', spouse: 'Syeda Rayeesa Banu', spouseRole: 'W', children: [{ id: uid(), name: 'Syed Huzer Mehdi', role: 'S' }, { id: uid(), name: 'Syeda Faseeha Farzeen', role: 'D' }] },
                { id: uid(), name: 'Syed Rajmohammed Safi', role: 'S', spouse: 'Syeda Rimaz (Ruqayya)', spouseRole: 'W', children: [{ id: uid(), name: 'Syeda Waseena Eiwaz', role: 'D' }, { id: uid(), name: 'Syeda Zainab Tamseela', role: 'D' }, { id: uid(), name: 'Syeda Fatima Tanzila', role: 'D' }] },
                { 
                  id: uid(), 
                  name: 'Syeda Majida Tarannum', 
                  role: 'D', 
                  spouse: 'Syed Ismail Nizami', 
                  spouseRole: 'H',
                  children: [
                    { id: uid(), name: 'Syed Mohd Ayaan', role: 'S' },
                    { id: uid(), name: 'Syeda Gazala Nizami', role: 'D', spouse: 'Syed Ahmed Mujahid', spouseRole: 'H' },
                    { id: uid(), name: 'Syeda Saima Nizami', role: 'D' },
                    { id: uid(), name: 'Syeda Sania Nizami', role: 'D' },
                    { id: uid(), name: 'Syeda Samia Nizami', role: 'D' },
                    { id: uid(), name: 'Syeda Zubia Nizami', role: 'D' }
                  ]
                },
                { id: uid(), name: 'Syeda Wajeeda Tabassum', role: 'D', spouse: 'Syed Siddique Ahmed', spouseRole: 'H', children: [{ id: uid(), name: 'Syed Ahmed Shayaan', role: 'S' }, { id: uid(), name: 'Syed Dilawar Adnan', role: 'S' }, { id: uid(), name: 'Syeda Shaiza Rhushinaz', role: 'D' }] },
                { id: uid(), name: 'Syeda Rakshinda Munajjum (Raj Banu)', role: 'D', spouse: 'Syed Mujtaba Mehdi', spouseRole: 'H', children: [{ id: uid(), name: 'Syed Amaan', role: 'S' }, { id: uid(), name: 'Syed Abdullah', role: 'S' }, { id: uid(), name: 'Syeda Maryam', role: 'D' }, { id: uid(), name: 'Syeda Maira', role: 'D' }] },
                { id: uid(), name: 'Syeda Javida Mujassum', role: 'D', spouse: 'Syed Rafathullah Mashood Khundmiri', spouseRole: 'H', children: [{ id: uid(), name: 'Syed Mahmood Hussain Khundmiri', role: 'S' }, { id: uid(), name: 'Syeda Akhtar Banu', role: 'D' }, { id: uid(), name: 'Syeda Hidayathullah Hadanji Malkaan', role: 'D' }, { id: uid(), name: 'Syeda Maryam Saira', role: 'D' }, { id: uid(), name: 'Syeda Amina Saher', role: 'D' }] }
              ]
            },
            {
              id: uid(),
              name: 'Syed Mustafa Haji Miya',
              role: 'S',
              spouse: 'Hazrath Syeda Qamar Siddiqa Bano',
              spouseRole: 'W',
              children: [
                { id: uid(), name: 'Unknown Son', role: 'S' },
                { id: uid(), name: 'Syed Tanweer', role: 'S', spouse: 'Syeda Afshan', spouseRole: 'W', children: [{ id: uid(), name: 'Son', role: 'S' }, { id: uid(), name: 'Daughter 1', role: 'D' }, { id: uid(), name: 'Daughter 2', role: 'D' }, { id: uid(), name: 'Daughter 3', role: 'D' }, { id: uid(), name: 'Daughter 4', role: 'D' }] },
                { id: uid(), name: 'Syed Hussain Tauqeer', role: 'S' },
                { id: uid(), name: 'Syeda Shanoor', role: 'D', spouse: 'Syed Nizam', spouseRole: 'H', children: [{ id: uid(), name: 'Son 1', role: 'S' }, { id: uid(), name: 'Son 2', role: 'S' }, { id: uid(), name: 'Daughter 1', role: 'D' }, { id: uid(), name: 'Daughter 2', role: 'D' }] },
                { id: uid(), name: 'Late Syeda Sharooq', role: 'D', spouse: 'Syed Nazeer', spouseRole: 'H', children: [{ id: uid(), name: 'Son', role: 'S' }] },
                { id: uid(), name: 'Syeda Shagufta', role: 'D', spouse: 'Hazrath Syed Jawad Miya', spouseRole: 'H', children: [{ id: uid(), name: 'Son 1', role: 'S' }, { id: uid(), name: 'Son 2', role: 'S' }] }
              ]
            },
            { id: uid(), name: 'Syed Ahmed (Badshah Miya)', role: 'S' },
            { id: uid(), name: 'Syed Munawwar (Murshid Miya)', role: 'S' },
            { id: uid(), name: 'Syed Munawwar (Mahboob Miya)', role: 'S' },
            {
              id: uid(),
              name: 'Syeda Shahida Bano',
              role: 'D',
              spouse: 'Syed Aziz Miya',
              spouseRole: 'H',
              children: [
                { id: uid(), name: 'Syed Shaker', role: 'S', spouse: 'Syeda Mehween', spouseRole: 'W', children: [{ id: uid(), name: 'Son 1', role: 'S' }, { id: uid(), name: 'Son 2', role: 'S' }, { id: uid(), name: 'Daughter', role: 'D' }] },
                { id: uid(), name: 'Syed Amir', role: 'S', spouse: 'Late Syeda', spouseRole: 'W', children: [{ id: uid(), name: 'Son 1', role: 'S' }, { id: uid(), name: 'Son 2', role: 'S' }, { id: uid(), name: 'Son 3', role: 'S' }] },
                { id: uid(), name: 'Late Syed Zakir', role: 'S', spouse: 'Syeda', spouseRole: 'W', children: [{ id: uid(), name: 'Daughter', role: 'D' }] },
                { id: uid(), name: 'Syed Ahmer', role: 'S', spouse: 'Syeda', spouseRole: 'W', children: [{ id: uid(), name: 'Son 1', role: 'S' }, { id: uid(), name: 'Son 2', role: 'S' }, { id: uid(), name: 'Daughter', role: 'D' }] },
                { id: uid(), name: 'Syed Zubair', role: 'S', spouse: 'Syeda Ifath', spouseRole: 'W', children: [{ id: uid(), name: 'Daughter', role: 'D' }] },
                { id: uid(), name: 'Syed Saber', role: 'S', spouse: 'Syeda', spouseRole: 'W', children: [{ id: uid(), name: 'Son 1', role: 'S' }, { id: uid(), name: 'Son 2', role: 'S' }] },
                { 
                  id: uid(), 
                  name: 'Late Syeda Zahida Banu', 
                  role: 'D', 
                  spouse: 'Syed Amjad', 
                  spouseRole: 'H',
                  children: [
                    { id: uid(), name: 'Syed Sarshar Mehdi', role: 'S' },
                    { id: uid(), name: 'Syeda Ashkar Mehvish', role: 'D', spouse: 'Syed Adil', spouseRole: 'H', children: [{ id: uid(), name: 'Son', role: 'S' }, { id: uid(), name: 'Daughter 1', role: 'D' }, { id: uid(), name: 'Daughter 2', role: 'D' }, { id: uid(), name: 'Daughter 3', role: 'D' }] },
                    { id: uid(), name: 'Syeda Abshar Mehvish', role: 'D', spouse: 'Syed', spouseRole: 'H' }
                  ]
                },
                { id: uid(), name: 'Syeda Mehdiya Tabassum', role: 'D', spouse: 'Syed Jaleel', spouseRole: 'H' }
              ]
            }
          ]
        },
        { id: uid(), name: 'Raja Miya Sahab (Son of Wife 2)', role: 'S' },
        { id: uid(), name: 'Channu Miya Sahab (Son of Wife 3)', role: 'S' }
      ]
    }
  ]
};

export const MATERNAL_ANCESTRY: Person = {
  id: 'root-maternal-mahdi',
  name: "Hazrat Syed Muhammad Mahdi Al-Mau'ood (Alayhis Salam)",
  role: 'کے فرزند',
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
  children: [
    {
      id: uid(),
      name: "Hazrat Syedna Shah Mahmood Sani Al-Mahdi (Radi Allahu Ta'ala Anhu)",
      role: "کے فرزند",
      children: [
        {
          id: uid(),
          name: "Hazrat Syedna Shah Yaqub Hasan Wilayat (Radi Allahu Ta'ala Anhu)",
          role: "کے فرزند",
          children: [
            {
               id: uid(),
               name: "Hazrat Syedna Shah Khundmir Barah Bani Israel (Rehmatullah Alaih)",
               role: "کے فرزند",
               children: [
                 {
                   id: uid(),
                   name: "Hazrat Syed Jalal (Rehmatullah Alaih)",
                   role: "کے فرزند",
                   children: [
                     {
                       id: uid(),
                       name: "Hazrat Syed Musa (Rehmatullah Alaih)",
                       role: "کے فرزند",
                       children: [
                         {
                           id: uid(),
                           name: "Hazrat Syed Yadullah Bade Shah Miyan (Rehmatullah Alaih)",
                           role: "کے فرزند",
                           children: [
                             {
                               id: uid(),
                               name: "Hazrat Peer-o-Murshid Syed Zain-ul-Abideen (Rehmatullah Alaih)",
                               role: "کے فرزند",
                               children: [
                                 {
                                   id: uid(),
                                   name: "Hazrat Peer-o-Murshid Syed Abdul Karim (Rehmatullah Alaih)",
                                   role: "کے فرزند",
                                   children: [
                                     {
                                       id: uid(),
                                       name: "Hazrat Peer-o-Murshid Syed Mustafa Shaheed (Rehmatullah Alaih)",
                                       role: "کے فرزند",
                                       children: [
                                         {
                                           id: uid(),
                                           name: "Hazrat Peer-o-Murshid Miyan Syed Umar (Rehmatullah Alaih)",
                                           role: "کے فرزند",
                                           children: [
                                             {
                                               id: uid(),
                                               name: "Hazrat Peer-o-Murshid Syed Ibrahim, also known as Khamosh Bawa Sa Miyan (Rehmatullah Alaih)",
                                               role: "کے فرزند",
                                               children: [
                                                 {
                                                   id: uid(),
                                                   name: "Hazrat Peer-o-Murshid Miyan Syed Shah Shah Miyan (Rehmatullah Alaih)",
                                                   role: "کے فرزند",
                                                   children: [
                                                     {
                                                       id: uid(),
                                                       name: "Hazrat Miyan Syed Haji Miyan Sahib (Rehmatullah Alaih)",
                                                       role: "کے فرزند",
                                                       children: [
                                                         {
                                                           id: uid(),
                                                           name: "Hazrat Miyan Syed Qasim, also known as Qasu Miyan Sahib (Rehmatullah Alaih)",
                                                           role: "کے فرزند",
                                                           children: [
                                                             {
                                                               id: uid(),
                                                               name: "Hazrat Syed Muhammad Taqi, also known as Sardar Miyan Sahib (Rehmatullah Alaih)",
                                                               role: "کے فرزند",
                                                               children: [
                                                                 { id: uid(), name: "Syed Alam Shaji", role: "کے فرزند" },
                                                                 { id: uid(), name: "Syed Mahmood Sami", role: "کے فرزند" },
                                                                 { id: uid(), name: "Syed Ibrahim Zaki", role: "کے فرزند" },
                                                                 { id: uid(), name: "Syed Raj Muhammad Safi", role: "کے فرزند" }
                                                               ]
                                                             }
                                                           ]
                                                         }
                                                       ]
                                                     }
                                                   ]
                                                 }
                                               ]
                                             }
                                           ]
                                         }
                                       ]
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         }
                       ]
                     }
                   ]
                 }
               ]
            }
          ]
        }
      ]
    }
  ]
};

// --- SPIRITUAL SILSILA CHAIN ---
export const SHAJRA_DATA: ShajraItem[] = [
  {
    type: 'chain',
    title: 'Spiritual Intro & Chain',
    lines: [
      { arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", roman: "Bismillahir Rahmanir Raheem", urdu: "اللہ کے نام سے شروع جو بڑا مہربان نہایت رحم والا ہے" },
      { arabic: "تن من اس تن مرشد، دل من اس دل مرشد، روح من اس روح مرشد، ظاہر من اس ظاہر مرشد، باطن من اس باطن مرشد، نظر من اس نظر مرشد۔", roman: "Tan man as tan Murshid, dil man as dil Murshid, ruh man as ruh Murshid, zahir man as zahir Murshid, batin man as batin Murshid, nazar man as nazar Murshid.", urdu: "میرا جسم مرشد کا جسم ہے، میرا دل مرشد کا دل ہے، میری روح مرشد کی روح ہے، میرا ظاہر مرشد کا ظاہر ہے، میرا باطن مرشد کا باطن ہے، میری نظر مرشد کی نظر ہے۔" },
      { arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ - أَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مَوْلَانَا مُحَمَّدٍ سَيِّدِ الْعَاشِقِينَ، أَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مَوْلَانَا مُحَمَّدٍ سَيِّدِ مَاشُوقِينَا، أَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مَوْلَانَا مُحَمَّدٍ سَيِّدِ الْمُجِيبِينَ، أَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مَوْلَانَا مُحَمَّدٍ سَيِّدِ الْمُحِبِّينَ، أَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مَوْلَانَا مُحَمَّدٍ سَيِّدِ الْمُرْسَلِينَ، أَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مَوْلَانَا مُحَمَّدٍ سَيِّدِ الْمُسْتَقِيمِينَ، أَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مَوْلَانَا مُحَمَّدٍ سَيِّدِ الذَّاكِرِينَ.", roman: "Bismillahir Rahmanir Raheem - Allahumma salli ala Sayyidina Maulana Muhammadin Sayyid al-Ashiqina, Mashuqina, Sayyidil Mujibina, Sayyidil Muhibbina, Sayyidil Mursalina, Sayyidil Mustaqimina, Sayyidil Zakirina.", urdu: "بسم اللہ الرحمن الرحیم - اے اللہ! درود بھیج ہمارے سردار محمدؐ پر جو عاشقوں کے سردار ہیں، معشوقوں کے سردار ہیں، دعا قبول کرنے والوں کے سردار ہیں، محبت کرنے والوں کے سردار ہیں، رسولوں کے سردار ہیں، سیدھے راستے والوں کے سردار ہیں، اور ذکر کرنے والوں کے سردار ہیں۔" },
      
      // Chain of Prophets
      { arabic: "إِلٰهِي بِحُرْمَةِ لَا إِلٰهَ إِلَّا اللهُ آدَمُ صَفِيُّ اللهِ صَلَوَاتُ اللهِ عَلَيْهِ", roman: "Ilahi bihurmat La ilaha illallah Adam Safiyullah salawatullahi alayh", urdu: "الہی بحرمت لا الہ الا اللہ آدم صفی اللہ صلوات اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ لَا إِلٰهَ إِلَّا اللهُ نُوحُ نَجِيُّ اللهِ صَلَوَاتُ اللهِ عَلَيْهِ", roman: "Ilahi bihurmat La ilaha illallah Nuh Najiyullah salawatullahi alayh", urdu: "الہی بحرمت لا الہ الا اللہ نوح نجی اللہ صلوات اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ لَا إِلٰهَ إِلَّا اللهُ إِبْرَاهِيمُ خَلِيلُ اللهِ صَلَوَاتُ اللهِ عَلَيْهِ", roman: "Ilahi bihurmat La ilaha illallah Ibrahim Khalilullah salawatullahi alayh", urdu: "الہی بحرمت لا الہ الا اللہ ابراہیم خلیل اللہ صلوات اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ لَا إِلٰهَ إِلَّا اللهُ مُوسَى كَلِيمُ اللهِ صَلَوَاتُ اللهِ عَلَيْهِ", roman: "Ilahi bihurmat La ilaha illallah Musa Kalimullah salawatullahi alayh", urdu: "الہی بحرمت لا الہ الا اللہ موسی کلیم اللہ صلوات اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ لَا إِلٰهَ إِلَّا اللهُ عِيسَى رُوحُ اللهِ صَلَوَاتُ اللهِ عَلَيْهِ", roman: "Ilahi bihurmat La ilaha illallah Isa Ruhullah salawatullahi alayh", urdu: "الہی بحرمت لا الہ الا اللہ عیسی روح اللہ صلوات اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ صَلَوَاتُ اللهِ عَلَيْهِ", roman: "Ilahi bihurmat La ilaha illallah Muhammadur Rasulullah salawatullahi alayh", urdu: "الہی بحرمت لا الہ الا اللہ محمد رسول اللہ صلوات اللہ علیہ" },
      
      // Chain of Masters
      { arabic: "إِلٰهِي بِحُرْمَةِ لَا إِلٰهَ إِلَّا اللهُ حَضْرَت مِيرا سَيّد مُحَمّد مَهدي مَوْعُود آخِر الزَمَان عَلَيْهِ السَّلَام", roman: "Ilahi bihurmat La ilaha illallah Hazrat Meera Syed Muhammad Mahdi Mauood Akhir-uz-Zaman Alayhis Salam", urdu: "الہی بحرمت لا الہ الا اللہ حضرت میراں سید محمد مہدی موعود آخر الزماں علیہ السلام" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد مَحْمُود ثَانِي مَهدي رَضِيَ اللهُ عَنْهُ", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Mahmood Sani Mahdi (R.A)", urdu: "الہی بحرمت حضرت بندگی میاں سید محمود ثانی مہدی رضی اللہ عنہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں شَاه يَعْقُوب حَسَنِي وِلَايَت رَضِيَ اللهُ عَنْهُ", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Shah Yaqub Hasani Wilayat (R.A)", urdu: "الہی بحرمت حضرت بندگی میاں شاہ یعقوب حسنی ولایت رضی اللہ عنہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد خُنْدْمِير بَارَه بَنِي اِسْرَائِيل رَضِيَ اللهُ عَنْهُ", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Khundmir Bara Banisrail (R.A)", urdu: "الہی بحرمت حضرت بندگی میاں سید خندmir بارہ بنی اسرائیل رضی اللہ عنہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں شَاه نُصْرَت مَخْصُوص زَمَان رَضِيَ اللهُ عَنْهُ", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Shah Nusrat Makhsoos-uz-Zaman (R.A)", urdu: "الہی بحرمت حضرت بندگی میاں شاہ نصرت مخصوص زماں رضی اللہ عنہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد شَرِيف رَضِيَ اللهُ عَنْهُ", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Sharif (R.A)", urdu: "الہی بحرمت حضرت بندگی میاں سید شریف رضی اللہ عنہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد مُبَارَك رَضِيَ اللهُ عَنْهُ", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Mubarak (R.A)", urdu: "الہی بحرمت حضرت بندگی میاں سید مبارک رضی اللہ عنہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد خُدَا بَخْش رَحْمَةُ اللهِ عَلَيْه", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Khuda Bakhsh (R.H)", urdu: "الہی بحرمت حضرت بندگی میاں سید خدا بخش رحمتہ اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد نَجْمُ الدِّين شَهِيد اَكْبَر رَحْمَةُ اللهِ عَلَيْه", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Najmuddin Shaheed Akbar (R.H)", urdu: "الہی بحرمت حضرت بندگی میاں سید نجم الدین شہید اکبر رحمتہ اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد اَٹَان شَهِيد فِی سَبِيلِ الله رَحْمَةُ اللهِ عَلَيْه", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Atan Shaheed-fi-Sabilillah (R.H)", urdu: "الہی بحرمت حضرت بندگی میاں سید اٹاں شہید فی سبیل اللہ رحمتہ اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد يَعْقُوب رَحْمَةُ اللهِ عَلَيْه", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Yaqub (R.H)", urdu: "الہی بحرمت حضرت بندگی میاں سید یعقوب رحمتہ اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَنْدگی مِيَاں سَيّد نُصْرَت رَحْمَةُ اللهِ عَلَيْه", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Nusrat (R.H)", urdu: "الہی بحرمت حضرت بندگی میاں سید نصرت رحمتہ اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد شَهَابُ الدِّين رَحْمَةُ اللهِ عَلَيْه", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Shahabuddin (R.H)", urdu: "الہی بحرمت حضرت بندگی میاں سید شہاب الدین رحمتہ اللہ علیہ" },
      { arabic: "إِلٰهِي بِحُرْمَةِ حَضْرَت بَانْدگی مِيَاں سَيّد اَٹَان شَهَاب مَهْدَوِي رَحْمَةُ اللهِ عَلَيْه", roman: "Ilahi bihurmat Hazrat Bandagi Miyan Syed Atan Shahab Mahdavi (R.H)", urdu: "الہی بحرمت حضرت بندگی میاں سید اٹاں شہاب مہدوی رحمتہ اللہ علیہ" },
      { arabic: "إِلَّا الله تُو هے لَا إِلٰه هُوں نَہِيں", roman: "Illallah tu hai La ilaha hoon nahi", urdu: "الا اللہ تو ہے، لا الہ ہوں نہیں" }
    ]
  }
];
