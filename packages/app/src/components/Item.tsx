import * as React from 'react';
import { Box } from '@mui/material';

export interface ItemProps {
  description: string;
  title: string;
  price: number;
  thumbnail: string;
  image: string;
}

export const Item: React.FC<ItemProps> = (props) => {
  // view detail for item
  return (
    <Box
      height={1}
      style={{ background: props.image }}
      display="flex"
      flexDirection="row"
    >
      <Box height={0.9} style={{ background: props.image }} />
      <Box height={0.1} display="flex" flexDirection="column">
        <Box width={0.8}>{props.title}</Box>
        <Box width={0.2}>{props.price}</Box>
      </Box>
    </Box>
  );
};
