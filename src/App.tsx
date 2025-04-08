import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Link, Paper, CssBaseline } from '@mui/material';
import ImageUrlInput from './components/ImageUrlInput';
import LassoCanvas from './components/LassoCanvas';
import MaskResult from './components/MaskResult';
import { useUrlParams } from './hooks/useUrlParams';

const App: React.FC = () => {
  const { urlParams, updateUrlParam } = useUrlParams();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [maskBase64, setMaskBase64] = useState<string>('');

  useEffect(() => {
    const urlImageParam: string | null = urlParams.get('imageUrl');
    if (urlImageParam) {
      setImageUrl(urlImageParam);
    }
  }, [urlParams]);

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    updateUrlParam('imageUrl', url);
    setMaskBase64('');
  };

  const handleMaskGenerated = (base64: string) => {
    setMaskBase64(base64);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Midjourney Inpainting Tool
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select regions of an image to create masks for inpainting
          </Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <ImageUrlInput initialUrl={imageUrl} onUrlChange={handleImageUrlChange} />
          <LassoCanvas imageUrl={imageUrl} onMaskGenerated={handleMaskGenerated} />
          <MaskResult maskBase64={maskBase64} />

          <Paper sx={{ mt: 4, p: 2, textAlign: 'center', width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Draw with the lasso tool to select areas for inpainting. The selected areas will appear in white in the mask.
              <br />
              Works with Midjourney's Vary (Region) feature.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default App;