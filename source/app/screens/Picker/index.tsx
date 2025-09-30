import {TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  ApplicationContext,
  Button,
  Screen,
  ScreenContainerProps,
  Styles,
  Tag,
} from '@passionui/components';
import styles from './styles';

const Picker: React.FC<ScreenContainerProps> = ({
  navigation,
  options,
  data,
  selected,
  multiple = false,
  onChange,
}) => {
  const {translate, navigator, theme} = useContext(ApplicationContext);
  const [picked, setPicked] = useState(selected ? [...selected] : []);
  /**
   * on apply
   */
  const onApply = () => {
    navigator?.pop();
    onChange?.(picked);
  };

  /**
   * on select item
   * @param item
   */
  const onSelect = (item: any) => {
    const exist = picked?.some((i: any) => i.id === item.id);
    if (multiple) {
      if (!exist) {
        setPicked([...picked, item]);
      } else {
        setPicked(picked?.filter((i: any) => i.id !== item.id));
      }
    } else {
      setPicked([item]);
    }
  };

  return (
    <Screen
      navigation={navigation}
      scrollable={true}
      options={options}
      footerComponent={
        <Button
          title={translate('apply')}
          onPress={onApply}
          type={picked ? 'primary' : 'disabled'}
        />
      }
      style={Styles.paddingM}>
      <View style={styles.wrapLine}>
        {data?.map((item: any) => {
          const exist = picked?.some((i: any) => i.id === item.id);
          return (
            <TouchableOpacity onPress={() => onSelect(item)} key={item.id}>
              <Tag
                label={item.title}
                size={'large'}
                color={exist ? theme.colors.primary.default : undefined}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Screen>
  );
};

export {Picker};
