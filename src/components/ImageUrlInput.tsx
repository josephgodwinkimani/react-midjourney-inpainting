import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    InputAdornment,
    IconButton,
    useTheme,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import { ImageUrlInputProps } from '../types';

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ initialUrl, onUrlChange }) => {
    const [url, setUrl] = useState(initialUrl);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUrlChange(url);
    };

    const handleClear = () => {
        setUrl('');
        onUrlChange('');
    };

    const theme = useTheme();

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Image URL
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: { xs: 2, sm: 1 }
                }}
            >
                <TextField
                    fullWidth
                    placeholder="https://cdn-here-with-my/image.png"
                    variant="outlined"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LinkIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: url ? (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="clear input"
                                    onClick={handleClear}
                                    edge="end"
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                        sx: {
                            backgroundColor: theme.palette.background.default
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!url}
                    sx={{
                        minWidth: { xs: '100%', sm: 100 },
                        height: { sm: '56px' }
                    }}
                >
                    Load
                </Button>
            </Box>
        </Paper>
    );
};

export default ImageUrlInput;