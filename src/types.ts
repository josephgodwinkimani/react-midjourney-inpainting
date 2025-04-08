export interface MaskResultProps {
    maskBase64: string;
}

export interface LassoCanvasProps {
    imageUrl: string;
    onMaskGenerated: (maskBase64: string) => void;
}

export interface Point {
    x: number;
    y: number;
}

export interface ImageUrlInputProps {
    initialUrl: string;
    onUrlChange: (url: string) => void;
}