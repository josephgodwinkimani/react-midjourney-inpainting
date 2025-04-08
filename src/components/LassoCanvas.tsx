import * as React from 'react';
import { Box, Paper, Typography, Button, Stack, CircularProgress, useTheme } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import ClearIcon from '@mui/icons-material/Clear';
import { loadImage, generateMask } from '../utils/imageUtils';
import { LassoCanvasProps, Point } from '../types';

const LassoCanvas: React.FC<LassoCanvasProps> = ({ imageUrl, onMaskGenerated }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
    const [currentPoints, setCurrentPoints] = React.useState<Point[]>([]);
    const [allSelections, setAllSelections] = React.useState<Point[][]>([]);
    const [image, setImage] = React.useState<HTMLImageElement | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!imageUrl) {
            setImage(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        loadImage(imageUrl)
            .then(img => {
                setImage(img);
                setIsLoading(false);

                setCurrentPoints([]); // reset
                setAllSelections([]);
            })
            .catch(err => {
                console.error('Failed to load image:', err);
                setError('Failed to load image. Please check the URL and try again.');
                setIsLoading(false);
            });
    }, [imageUrl]);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx || !image) return;

        const ratio = image.width / image.height;
        const maxWidth = 800;
        const maxHeight = 600;

        let canvasWidth = image.width;
        let canvasHeight = image.height;

        if (canvasWidth > maxWidth) {
            canvasWidth = maxWidth;
            canvasHeight = canvasWidth / ratio;
        }

        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = canvasHeight * ratio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        if (currentPoints.length > 1) {
            ctx.strokeStyle = 'rgba(94, 114, 228, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(currentPoints[0].x, currentPoints[0].y);

            for (let i = 1; i < currentPoints.length; i++) {
                ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
            }

            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
        ctx.lineWidth = 2;

        allSelections.forEach(points => {
            if (points.length < 3) return;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.closePath();
            ctx.stroke();
        });

        if (allSelections.length > 0) {
            const maskBase64 = generateMask(canvas, allSelections);
            onMaskGenerated(maskBase64);
        } else {
            onMaskGenerated('');
        }
    }, [image, currentPoints, allSelections, onMaskGenerated]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!image) return;

        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentPoints([{ x, y }]);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !image) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentPoints(prev => [...prev, { x, y }]);
    };

    const handleMouseUp = () => {
        if (!isDrawing || !image) return;

        if (currentPoints.length >= 3) {
            setAllSelections(prev => [...prev, [...currentPoints]]);
        }

        setCurrentPoints([]);
        setIsDrawing(false);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!image) return;
        e.preventDefault();

        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        setCurrentPoints([{ x, y }]);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !image) return;
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        setCurrentPoints(prev => [...prev, { x, y }]);
    };

    const handleTouchEnd = () => {
        handleMouseUp();
    };

    const handleUndo = () => {
        setAllSelections(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setAllSelections([]);
        setCurrentPoints([]);
    };

    const theme = useTheme();

    return (
        <Paper elevation={3} sx={{ p: 2, mb: 3, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Draw Selection
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
                    <Typography>{error}</Typography>
                </Box>
            ) : !image ? (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography color="text.secondary">
                        Enter an image URL to get started
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2,
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.default
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{
                                maxWidth: '100%',
                                touchAction: 'none',
                                cursor: 'crosshair',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        />
                    </Box>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<UndoIcon />}
                            onClick={handleUndo}
                            disabled={allSelections.length === 0}
                        >
                            Undo Last
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ClearIcon />}
                            onClick={handleClear}
                            disabled={allSelections.length === 0}
                        >
                            Clear All
                        </Button>
                    </Stack>
                </>
            )}
        </Paper>
    );
};

export default LassoCanvas;