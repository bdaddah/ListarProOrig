import React, {useContext, useEffect} from 'react';
import {ApplicationContext, ScreenContainerProps} from '@passionui/components';
import {useSelector} from 'react-redux';
import {settingSelect} from '@redux';
import {HomeBasic} from './HomeBasic';
import {HomeWidget} from './HomeWidget';
import {OnBoarding} from '../OnBoarding';

const Home: React.FC<ScreenContainerProps> = props => {
  const {navigator} = useContext(ApplicationContext);
  const setting = useSelector(settingSelect);

  useEffect(() => {
    setTimeout(() => {
      navigator?.present({screen: OnBoarding});
    }, 1000);
  }, [navigator]);

  if (setting?.useLayoutWidget) {
    return <HomeWidget {...props} />;
  }
  return <HomeBasic {...props} />;
};

export {Home};
