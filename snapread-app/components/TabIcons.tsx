import React from 'react';
import HomeGrey from '../assets/images/homegrey.svg';
import HomePurple from '../assets/images/homepurple.svg';
import FormationsGrey from '../assets/images/formationsgrey.svg';
import FormationsPurple from '../assets/images/formationspurple.svg';
import SettingsGrey from '../assets/images/settingsgrey.svg';
import SettingsPurple from '../assets/images/settingspurple.svg';
import SuccesGrey from '../assets/images/succesgrey.svg';
import SuccesPurple from '../assets/images/succespurple.svg';

interface TabIconProps {
  focused: boolean;
  size?: number;
}

export const HomeIcon = ({ focused, size = 24 }: TabIconProps) => {
  const Icon = focused ? HomePurple : HomeGrey;
  return <Icon width={size} height={size} />;
};

export const FormationsIcon = ({ focused, size = 24 }: TabIconProps) => {
  const Icon = focused ? FormationsPurple : FormationsGrey;
  return <Icon width={size} height={size} />;
};

export const SuccessIcon = ({ focused, size = 24 }: TabIconProps) => {
  const Icon = focused ? SuccesPurple : SuccesGrey;
  return <Icon width={size} height={size} />;
};

export const SettingsIcon = ({ focused, size = 24 }: TabIconProps) => {
  const Icon = focused ? SettingsPurple : SettingsGrey;
  return <Icon width={size} height={size} />;
}; 