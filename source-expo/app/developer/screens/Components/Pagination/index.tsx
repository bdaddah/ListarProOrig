import {Container, Screen, ScreenContainerProps} from '@passionui/components';
import React from 'react';

const PaginationUsage: React.FC<ScreenContainerProps> = ({navigation}) => {
  return (
    <Screen navigation={navigation} options={{title: 'Components'}}>
      <Container padding={12} gutter={8} />
    </Screen>
  );
};

export default PaginationUsage;
