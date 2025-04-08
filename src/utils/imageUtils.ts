const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

// simple hacky way
const generateMask = (
    canvas: HTMLCanvasElement,
    selections: { x: number; y: number }[][]
): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Make a temporary canvas for the mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return '';

    // Fill with black (background)
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // draw white for the selected areas
    maskCtx.fillStyle = 'white';
    selections.forEach(points => {
        if (points.length < 3) return;

        maskCtx.beginPath();
        maskCtx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            maskCtx.lineTo(points[i].x, points[i].y);
        }

        maskCtx.closePath();
        maskCtx.fill();
    });

    // Convert to base64 WebP
    return maskCanvas.toDataURL('image/webp');
};

export { loadImage, generateMask }