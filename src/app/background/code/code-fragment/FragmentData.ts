export interface Fragment {
    src: string,
    width: number,
    height: number
};

export interface FragmentComponent {
    xPos: number,
    yPos: number,
    scale: number,
    fragmentId: number,
    fragmentIndex: number,
    travelX: boolean,
    moveDir: boolean,
};

export const Fragments: Fragment[] = [
    {
        src: '/assets/code/code_fragment_1.webp',
        width: 464,
        height: 336
    },
    {
        src: '/assets/code/code_fragment_2.webp',
        width: 304,
        height: 336
    },
    {
        src: '/assets/code/code_fragment_3.webp',
        width: 464,
        height: 128
    }
];