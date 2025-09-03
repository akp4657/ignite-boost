export interface Video {
    _id?: string;
    matchDate: string;
    player1: string;
    char1: string;
    assist1: string;
    player2: string;
    char2: string;
    assist2: string;
    link: string;
    version: number; // DFC vs. DFCI
    createdData?: string;
    updatedAt?: string;
};

export interface ReplayInfo {
    player1: string;
    char1: string;
    assist1: string;
    player2: string;
    char2: string;
    assist2: string;
    timestamp: string;
};

export interface VideoSearch {
    player1?: string;
    player2?: string;
    char1?: string;
    char2?: string;
    assist1?: string;
    assist2?: string;
    version?: number;
    sort?: string;
};