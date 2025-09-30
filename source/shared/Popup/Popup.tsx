import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ApplicationContext,
  Button,
  Image,
  PopupProps,
  Radius,
  Spacing,
  Styles,
  Text,
} from '../index';

const Popup: React.FC<PopupProps> = ({
  image,
  title = 'Title',
  description,
  information,
  secondary,
  primary = {title: 'Primary', onPress: () => {}},
  buttonDirection = 'row',
}) => {
  const {theme, navigator} = useContext(ApplicationContext);

  /**
   * on action popup
   * @param callback
   */
  const onAction = (callback?: () => void) => {
    navigator?.pop();
    callback?.();
  };

  /**
   *  build main action of popup
   */
  const buildAction = () => {
    const renderRow = () => {
      return (
        <View style={Styles.rowCenter}>
          {!!secondary?.title && (
            <>
              <View style={Styles.flex}>
                <Button
                  title={secondary?.title}
                  type="text"
                  size="medium"
                  onPress={() => {
                    onAction(secondary?.onPress);
                  }}
                />
              </View>
              <View style={styles.buttonSpace} />
            </>
          )}
          <View style={Styles.flex}>
            <Button
              title={primary.title}
              size="medium"
              onPress={() => {
                onAction(primary.onPress);
              }}
            />
          </View>
        </View>
      );
    };
    const renderColumn = () => {
      return (
        <View style={Styles.columnCenter}>
          <Button
            title={primary.title}
            size="medium"
            onPress={() => {
              onAction(primary.onPress);
            }}
          />
          {!!secondary?.title && (
            <>
              <View style={styles.buttonSpace} />
              <Button
                title={secondary?.title}
                type="text"
                size="medium"
                onPress={() => {
                  onAction(secondary?.onPress);
                }}
              />
            </>
          )}
        </View>
      );
    };

    if (buttonDirection === 'auto') {
      if (
        secondary?.title &&
        (secondary.title.length > 12 || primary.title.length > 12)
      ) {
        return renderColumn();
      }
      return renderRow();
    }
    if (buttonDirection === 'row') {
      return renderRow();
    }
    return renderColumn();
  };

  /**
   * build description
   */
  const buildDescription = () => {
    if (typeof description === 'string') {
      return (
        <Text typography={'subhead'} numberOfLines={3}>
          {description}
        </Text>
      );
    }

    return description;
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.surface},
      ]}>
      {!!image && <Image source={{uri: image}} style={styles.image} />}
      <View style={styles.content}>
        <Text typography={'callout'} fontWeight={'bold'} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.description}>{buildDescription()}</View>
        {!!information && (
          <View style={styles.information}>
            <Text
              typography={'caption2'}
              color={theme.colors.text.hint}
              numberOfLines={1}>
              {information}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.contentAction}>{buildAction()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.M,
    minWidth: '100%',
  },
  image: {
    width: '100%',
    borderTopLeftRadius: Radius.M,
    borderTopRightRadius: Radius.M,
    aspectRatio: 2,
  },
  content: {padding: Spacing.XL},
  description: {
    marginTop: Spacing.S,
  },
  information: {
    marginTop: Spacing.S,
  },
  contentAction: {
    paddingHorizontal: Spacing.XL,
    paddingBottom: Spacing.XL,
  },
  buttonSpace: {
    width: Spacing.S,
    height: Spacing.S,
  },
});

export default Popup;
