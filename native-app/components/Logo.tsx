import React from 'react';

import LogoLight from '../assets/images/icon.png';
import LogoDark from '../assets/images/adaptive-icon.png';
import { Image } from 'react-native';

type Props = {
  height?: number;
  width?: number;
  variant?: 'light' | 'dark';
};
export const Logo: React.FC<Props> = ({ variant = 'dark', width,height }) => {
  if (variant === 'light') return <Image source={LogoLight} style={{width,height}} />
  return <Image source={LogoDark}  style={{width,height}}/>
};
