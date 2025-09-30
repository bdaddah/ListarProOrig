import React, {useContext, useState} from 'react';

import {
  ApplicationContext,
  Button,
  Colors,
  Icon,
  InputDropDown,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Switch,
  Text,
} from '@passionui/components';
import {ListTitle, PopupPickerColor} from '@components';
import {View} from 'react-native';
import styles from './styles';
import {applicationActions, themeSelect} from '@redux';
import {useSelector} from 'react-redux';
import {Settings} from '@configs';

const SettingTheme: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const storageTheme = useSelector(themeSelect);
  const defaultCustom = {
    id: 'custom',
    primary: theme.colors.primary.default,
    secondary: theme.colors.secondary.default,
  };
  const [currentTheme, setCurrentTheme] = useState(
    Settings.themeSupport.find(i => i.id === storageTheme?.id),
  );
  const [custom, setCustom] = useState<any>(
    currentTheme ? undefined : defaultCustom,
  );

  /**
   * on apply theme
   */
  const onApply = () => {
    if (custom) {
      applicationActions.onChangeTheme({
        id: custom.id,
        primary: custom.primary,
        secondary: custom.secondary,
      });
    } else {
      applicationActions.onChangeTheme({
        id: currentTheme.id,
        primary: currentTheme.primary,
        secondary: currentTheme.secondary,
      });
    }
  };

  /**
   * On select theme
   */
  const onSelectTheme = () => {
    navigator?.showBottomSheet({
      title: translate('select_theme'),
      screen: () => (
        <SheetPicker
          data={Settings.themeSupport.map(i => {
            return {
              ...i,
              title: translate(i.id),
              value: i.id,
              icon: (
                <View
                  style={[styles.iconTheme, {backgroundColor: i.primary}]}
                />
              ),
            };
          })}
          selected={{title: currentTheme?.title, value: currentTheme?.id}}
          onSelect={index => {
            navigator?.pop();
            setCurrentTheme(Settings.themeSupport[index]);
          }}
          renderItem={undefined}
        />
      ),
    });
  };

  /**
   *
   * @param color
   * @param callback
   */
  const onSelectColor = (color: string, callback: (color: string) => void) => {
    navigator?.showModal({
      screen: () => <PopupPickerColor color={color} onResult={callback} />,
    });
  };

  /**
   * Build content
   */
  const buildContent = () => {
    if (custom) {
      return (
        <View
          style={[
            Shadow.light,
            Styles.row,
            {
              backgroundColor: theme.colors.background.surface,
              padding: Spacing.M,
              borderRadius: Radius.M,
            },
          ]}>
          <View style={Styles.flex}>
            <Text typography={'subhead'} fontWeight={'bold'}>
              {translate('primary_color')}
            </Text>
            <SizedBox height={Spacing.S} />
            <InputDropDown
              leading={
                <View
                  style={[styles.iconTheme, {backgroundColor: custom.primary}]}
                />
              }
              value={custom.primary}
              onPress={() =>
                onSelectColor(custom.primary, color => {
                  setCustom({...custom, primary: color});
                })
              }
            />
          </View>
          <SizedBox width={Spacing.M} />
          <View style={Styles.flex}>
            <Text typography={'subhead'} fontWeight={'bold'}>
              {translate('secondary_color')}
            </Text>
            <SizedBox height={Spacing.S} />
            <InputDropDown
              leading={
                <View
                  style={[
                    styles.iconTheme,
                    {backgroundColor: custom.secondary},
                  ]}
                />
              }
              value={custom.secondary}
              onPress={() =>
                onSelectColor(custom.secondary, color => {
                  setCustom({...custom, secondary: color});
                })
              }
            />
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <Text typography={'subhead'} fontWeight={'bold'}>
          {translate('select_theme')}
        </Text>
        <SizedBox height={Spacing.S} />
        <InputDropDown
          leading={
            currentTheme?.primary && (
              <View
                style={[
                  styles.iconTheme,
                  {
                    backgroundColor: currentTheme?.primary,
                  },
                ]}
              />
            )
          }
          placeholder={translate('select_theme')}
          value={translate(currentTheme?.id)}
          onPress={onSelectTheme}
        />
      </View>
    );
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('theme')}}
      style={Styles.paddingM}
      scrollable={true}
      footerComponent={<Button onPress={onApply} title={translate('apply')} />}>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.gold_08}]}>
              <Icon name={'format-color-fill'} color={Colors.gold_04} />
            </View>
          }
          title={translate('custom_color')}
          description={
            <Switch
              value={custom}
              onChange={() => {
                if (custom) {
                  setCustom(undefined);
                } else {
                  setCustom(defaultCustom);
                }
              }}
            />
          }
          descriptionPosition={'right'}
          onPress={() => {}}
        />
      </View>
      <SizedBox height={Spacing.M} />
      {buildContent()}
    </Screen>
  );
};

export {SettingTheme};
