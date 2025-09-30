import React, {useContext} from 'react';
import {
  ApplicationContext,
  Container,
  Item,
  Shadow,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '@passionui/components';
import {FlatList, ScrollView, View} from 'react-native';
import {PreviewProps} from './types';

const Preview: React.FC<PreviewProps> = ({component, data}) => {
  const {theme} = useContext(ApplicationContext);
  const Component = component;
  return (
    <ScrollView contentContainerStyle={Styles.paddingVerticalM}>
      {Object.keys(data).map((key, index) => {
        const item = data[key];
        return (
          <View key={`Preview item ${key}`}>
            {index !== 0 && <SizedBox height={Spacing.M} />}
            <Container
              padding={12}
              gutter={8}
              style={[
                Shadow.light,
                {
                  borderRadius: Spacing.M,
                  backgroundColor: theme.colors.background.surface,
                },
              ]}>
              <Item>
                <Text typography="headline" fontWeight="bold">
                  {item.title}
                </Text>
              </Item>
              <Item>
                <FlatList
                  data={item?.value}
                  horizontal={item.direction === 'row'}
                  scrollEnabled={false}
                  renderItem={({item: propsInfo}) => {
                    let props: {[key: string]: string} = {};
                    props[key] = propsInfo.value;
                    return <Component {...props} {...propsInfo.props} />;
                  }}
                  ItemSeparatorComponent={() => (
                    <SizedBox width={8} height={8} />
                  )}
                  keyExtractor={i => JSON.stringify(i)}
                />
              </Item>
            </Container>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Preview;
