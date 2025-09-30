import React, {useContext, useRef, useState} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from './styles';
import {
  ApplicationContext,
  Button,
  InputSearch,
  Screen,
  ScreenContainerProps,
  SizedBox,
  Spacing,
  Styles,
  Tag,
  Text,
} from '@passionui/components';
import {listingActions} from '@redux';
import {CategoryModel} from '@models+types';

const PickerTags: React.FC<ScreenContainerProps> = ({
  navigation,
  items,
  onChange,
}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const searchRef = useRef();
  const timerRef = useRef<any>();

  const [keyword, setKeyword] = useState((items ?? []).join(','));
  const [suggestion, setSuggestion] = useState([]);
  const [searching, setSearching] = useState(false);

  /**
   * on apply data
   */
  const onApply = () => {
    if (keyword) {
      onChange?.(keyword.split(','));
      navigator?.pop();
    }
  };

  /**
   * on change search
   * @param value
   */
  const onChangeSearch = (value: string) => {
    setSearching(true);
    setKeyword(value);
    clearTimeout(timerRef.current);
    if (value) {
      timerRef.current = setTimeout(() => {
        setSearching(false);
        const arrList = value.split(',');
        listingActions.onLoadTags(arrList?.[arrList.length - 1], data => {
          setSuggestion(data);
        });
      }, 500);
    } else {
      setSuggestion([]);
      setSearching(false);
    }
  };

  /**
   * on select
   * @param item
   */
  const onSelectSuggestion = (item: CategoryModel) => {
    const arrList = keyword.split(',');
    arrList[arrList.length - 1] = item.title;
    setKeyword(arrList.join(','));
  };

  /**
   * on remove
   */
  const onRemove = (item: string) => {
    const arrList = keyword.split(',');
    const list = arrList.filter((i: string) => i !== item);
    setKeyword(list.join(','));
  };

  /**
   * render selected
   */
  const renderSelected = () => {
    const data = keyword.split(',');
    if (keyword && data.length > 0) {
      return (
        <>
          <View style={styles.selectionContent}>
            {data.map?.((item: string) => {
              return (
                <TouchableOpacity key={item} onPress={() => onRemove(item)}>
                  <Tag label={item} size={'large'} />
                </TouchableOpacity>
              );
            })}
          </View>
          <SizedBox height={Spacing.M} />
        </>
      );
    }
    return null;
  };

  return (
    <Screen
      navigation={navigation}
      options={{
        title: translate('choose_tags'),
      }}
      footerComponent={<Button title={translate('apply')} onPress={onApply} />}>
      <View style={Styles.paddingM}>
        <InputSearch
          ref={searchRef}
          value={keyword}
          placeholder={translate('search')}
          onChangeText={onChangeSearch}
          icon={
            searching && (
              <ActivityIndicator
                color={theme.colors.primary.default}
                size={16}
              />
            )
          }
        />
        <SizedBox height={4} />
        <Text typography="caption1">{translate('separate_tag')}</Text>
      </View>
      <ScrollView style={[Styles.flex, Styles.paddingHorizontalM]}>
        {renderSelected()}
        {suggestion && suggestion.length > 0 && (
          <View style={styles.selectionContent}>
            {suggestion?.map?.((item: CategoryModel) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelectSuggestion(item)}>
                  <Tag label={item.title} size={'large'} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

export {PickerTags};
