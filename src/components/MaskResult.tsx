import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    Divider,
    useTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MaskResultProps } from '../types';

const MaskResult: React.FC<MaskResultProps> = ({ maskBase64 }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(maskBase64).then(() => {
            setCopied(true);
        });
    };

    const handleSnackbarClose = () => {
        setCopied(false);
    };

    if (!maskBase64) {
        return null;
    }

    const displayedBase64 = maskBase64.length > 100
        ? `${maskBase64.substring(0, 60)}...${maskBase64.substring(maskBase64.length - 30)}`
        : maskBase64;

    const theme = useTheme();

    return (
        <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Mask Result
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom align="center">
                    Preview:
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: '#000',
                        minHeight: '150px'
                    }}
                >
                    {maskBase64 ? (
                        <img
                            src={maskBase64}
                            alt="Generated mask"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        />
                    ) : (
                        <Typography color="text.secondary">No mask generated</Typography>
                    )}
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom align="center">
                Base64 WebP Mask:
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                value={displayedBase64}
                InputProps={{
                    readOnly: true,
                }}
                multiline
                rows={2}
                sx={{
                    mb: 2,
                    fontFamily: 'monospace',
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.background.default
                    }
                }}
            />

            <Button
                variant="contained"
                color="primary"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ width: '100%' }}
            >
                Copy to Clipboard
            </Button>

            <Snackbar open={copied} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Mask copied to clipboard!
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default MaskResult;