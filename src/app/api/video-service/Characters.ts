export interface Character {
    name: string;
    short?: string;
    internal?: string; // So that front-end names can be different from backend
    abbr: string;
    ignition: boolean;
    wiki: string;
}

export const DefaultChar: Character = {
    name: '',
    abbr: 'all',
    ignition: false,
    wiki: ''
}

export const PlayableCharacters: Character[] = [
    {
        name: 'Akira Yuki',
        short: 'Akira',
        abbr: 'yak',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Akira_Yuki',
    },
    {
        name: 'Yuuki Konno',
        short: 'Yuuki',
        abbr: 'yuk',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Yuuki_Konno',
    },
    {
        name: 'Tatsuya Shiba',
        short: 'Tatsuya',
        abbr: 'oni',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Tatsuya_Shiba'
    },
    {
        name: 'Emi Yusa',
        short: 'Emi',
        abbr: 'emi',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Emi_Yusa',
    },
    {
        name: 'Yukina Himeragi',
        short: 'Yukina',
        abbr: 'ykn',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Yukina_Himeragi',
    },
    {
        name: 'Taiga Aisaka',
        short: 'Taiga',
        abbr: 'tgr',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Taiga_Aisaka',
    },
    {
        name: 'Kirito',
        abbr: 'krt',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Kirito',
    },
    {
        name: 'Shizuo Heiwajima',
        short: 'Shizuo',
        abbr: 'hiw',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Shizuo_Heiwajima',
    },
    {
        name: 'Kirino Kosaka',
        short: 'Kirino',
        abbr: 'krn',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Kirino_Kosaka',
    },
    {
        name: 'Shana',
        abbr: 'sha',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Shana',
    },
    {
        name: '',
        abbr: 'all',
        ignition: false,
        wiki: ''
    },
    {
        name: 'Asuna',
        abbr: 'asu',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Asuna'
    },
    {
        name: 'Mikoto Misaka',
        short: 'Mikoto',
        abbr: 'mis',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Mikoto_Misaka',
    },
    {
        name: 'Kuroyukihime',
        abbr: 'kur',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Kuroyukihime'
    },
    {
        name: 'Tomoka Minato',
        short: 'Tomoka',
        abbr: 'tmk',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Tomoka_Minato'
    },
    {
        name: 'Miyuki Shiba',
        short: 'Miyuki',
        abbr: 'sbm',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Miyuki_Shiba',
    },
    {
        name: 'Rentaro Satomi',
        short: 'Rentaro',
        abbr: 'stm',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Rentaro_Satomi',
    },
    {
        name: 'Qwenthur Barbotage',
        short: 'Qwenthur',
        internal: 'Quenser',
        abbr: 'qen',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Quenser',
    },
    {
        name: 'Kuroko Shirai',
        short: 'Kuroko',
        abbr: 'krk',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Kuroko_Shirai',
    },
    {
        name: 'Ako',
        abbr: 'ako',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Ako',
    },
    {
        name: 'Selvaria Bles',
        short: 'Selvaria',
        abbr: 'slv',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI/Selvaria_Bles',
    }
];

export const AssistCharacters: Character[] = [
    {
        name: '',
        abbr: 'all',
        ignition: false,
        wiki: '',
    },
    {
        name: 'Wilhelmina Carmel',
        short: 'Wilhelmina',
        abbr: 'wil',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Wilhelmina_Carmel',
    },
    {
        name: 'Leafa',
        abbr: 'lea',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Leafa',
    },
    {
        name: 'Touma Kamijou',
        short: 'Touma',
        abbr: 'tom',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Touma_Kamijou',
    },
    {
        name: 'Kuroneko',
        abbr: 'kro',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Kuroneko',
    },
    {
        name: 'Celty Sturluson',
        short: 'Celty',
        abbr: 'crt',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Celty_Sturluson',
    },
    {
        name: 'Haruyuki Arita',
        short: 'Haruyuki',
        abbr: 'har',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Haruyuki_Arita',
    },
    {
        name: 'Innocent Charm',
        abbr: 'ino',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Innocent_Charm',
    },
    {
        name: 'Holo',
        abbr: 'hol',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Holo',
    },
    {
        name: 'Kouko Kaga',
        short: 'Kouko',
        abbr: 'kgk',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Kouko_Kaga'
    },
    {
        name: 'Boogiepop',
        abbr: 'bog',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Boogiepop',
    },
    {
        name: 'Kino',
        abbr: 'kin',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Kino'
    },
    {
        name: 'Mashiro Shiina',
        short: 'Mashiro',
        abbr: 'mas',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Mashiro_Shiina',
    },
    {
        name: 'Erio Towa',
        short: 'Erio',
        abbr: 'ero',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Erio_Towa'
    },
    {
        name: 'Sadao Maou',
        short: 'Maou',
        internal: 'Sadao',
        abbr: 'mou',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Sadao_Maou',
    },
    {
        name: 'Tatsuya Shiba',
        short: 'Tatsuya',
        abbr: 'sbt',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Tatsuya_Shiba_(Assist)',
    },
    {
        name: 'Miyuki Shiba',
        short: 'Miyuki',
        abbr: 'smy',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Miyuki_Shiba_(Assist)',
    },
    {
        name: 'Ryuuji Takasu',
        short: 'Ryuuji',
        abbr: 'tks',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Ryuuji_Takasu'
    },
    {
        name: 'Kojou Akatsuki',
        short: 'Kojou',
        abbr: 'akj',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Kojou_Akatsuki',
    },
    {
        name: 'Enju Aihara',
        short: 'Enju',
        abbr: 'aen',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Enju_Aihara',
    },
    {
        name: 'Dokuro Mitsukai',
        short: 'Dokuro',
        abbr: 'dok',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Dokuro_Mitsukai',
    },
    {
        name: 'Accelerator',
        abbr: 'acr',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Accelerator',
    },
    {
        name: 'Izaya Orihara',
        short: 'Izaya',
        abbr: 'izy',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Izaya_Orihara',
    },
    {
        name: 'Froleytia Capistrano',
        short: 'Froleytia',
        abbr: 'fro',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Froleytia_Capistrano'
    },
    {
        name: 'Kana Iriya',
        short: 'Iriya',
        abbr: 'iry',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Kana_Iriya',
    },
    {
        name: 'Tomo Asama',
        short: 'Tomo',
        abbr: 'asm',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Tomo_Asama',
    },
    {
        name: 'Zero',
        abbr: 'zer',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Zero'
    },
    {
        name: 'Kazari Uiharu',
        short: 'Uiharu',
        abbr: 'uih',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Kazari_Uiharu'
    },
    {
        name: 'LLENN',
        abbr: 'ren',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Llenn',
    },
    {
        name: 'Rusian',
        abbr: 'rus',
        ignition: true,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Rusian'
    },
    {
        name: 'Pai Chan',
        short: 'Pai',
        abbr: 'pai',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Pai_Chan',
    },
    {
        name: 'Alicia Melchiott',
        short: 'Alicia',
        abbr: 'alc',
        ignition: false,
        wiki: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/Alicia_Melchiott',
    }
];