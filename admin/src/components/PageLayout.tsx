import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface PageLayoutProps {
  title: string;
  description?: string;
  maxWidth?: number;
  children: ReactNode;
}

export default function PageLayout({ title, description, maxWidth = 960, children }: PageLayoutProps) {
  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1" sx={{ mb: description ? 1 : 3 }}>{title}</Typography>
      {description && <Typography color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>}
      {children}
    </Box>
  );
}
