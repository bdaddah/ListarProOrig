import React, {FC, useContext, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';

import {PickerItem, SheetPickerProps} from './types';
import styles from './styles';
import {
  ApplicationContext,
  InputSearch,
  Radio,
  SizedBox,
  Spacing,
  Styles,
  Text,
} from '../index';

const SheetPicker: FC<SheetPickerProps> = ({
  data,
  selected,
  onSelect,
  renderItem,
}) => {
  const {theme} = useContext(ApplicationContext);
  const [search, setSearch] = useState('');

  const defaultRenderItem = ({item}: any) => {
    const index = data?.findIndex(i => i.value === item.value);
    let borderColor = theme.colors.border.default;
    if (item.value === selected?.value) {
      borderColor = theme.colors.primary.default;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          onSelect?.(index);
        }}
        style={[
          styles.item,
          {
            borderColor,
            backgroundColor: theme.colors.background.surface,
          },
        ]}>
        {!!item.icon && (
          <>
            {item.icon}
            <SizedBox width={Spacing.S} />
          </>
        )}
        <View style={Styles.flex}>
          <Text typography={'subhead'} fontWeight={'bold'}>
            {item.title}
          </Text>
          {item.subTitle && (
            <Text typography={'caption2'} fontWeight={'medium'}>
              {item.subTitle}
            </Text>
          )}
        </View>
        <Radio
          value={item.value}
          groupValue={selected?.value}
          onChange={() => onSelect?.(index)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.flex}>
      <View style={Styles.paddingM}>
        <InputSearch
          placeholder={'Search option'}
          defaultValue={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        renderItem={renderItem ?? defaultRenderItem}
        style={Styles.flex}
        contentContainerStyle={Styles.paddingHorizontalM}
        data={data.filter((item: PickerItem) => {
          return item.title.toUpperCase().includes(search.toUpperCase());
        })}
        ItemSeparatorComponent={() => <View style={{height: Spacing.S}} />}
        keyExtractor={item => item.title}
      />
    </View>
  );
};

export {SheetPicker};
