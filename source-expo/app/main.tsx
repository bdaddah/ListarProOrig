import React, {useContext} from 'react';
import {
  ApplicationContext,
  BottomTab,
  BottomTabItemProps,
  ScreenContainerProps,
} from '@passionui/components';
import {
  Account,
  Authentication,
  Blog,
  Discovery,
  Home,
  WishList,
} from '@screens';

const Main: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {translate} = useContext(ApplicationContext);
  const tabs: BottomTabItemProps[] = [
    {
      name: 'Home',
      title: translate('home'),
      icon: 'home-outline',
      screen: Home,
    },
    {
      name: 'Discovery',
      title: translate('discovery'),
      icon: 'map-marker-outline',
      screen: Discovery,
    },
    {
      name: 'Blog',
      title: translate('blog'),
      icon: 'post-outline',
      screen: Blog,
    },
    {
      name: 'WishList',
      title: translate('wish_list'),
      icon: 'bookmark-outline',
      screen: props => (
        <Authentication
          {...props}
          screen={WishList}
          options={{headerLeft: null}}
        />
      ),
    },
    {
      name: 'Account',
      title: translate('account'),
      icon: 'account-outline',
      screen: props => (
        <Authentication
          {...props}
          screen={Account}
          options={{headerLeft: null}}
        />
      ),
    },
  ];

  return <BottomTab tabs={tabs} navigation={navigation} />;
};

export default Main;
