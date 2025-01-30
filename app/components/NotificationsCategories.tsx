import Icon from '@components/shared/Icon';
import { bgcolorWhite2 } from '@styles/style';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { FlexRow } from './shared/FlexBoxStyle';
const styles = StyleSheet.create({
  containerView: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '100%',
    minHeight: 120,
    padding: 10
    , width: '100%',
  },
  iconStyle: {
    flex: 1,
    marginLeft: 10,
    textAlign: 'left'
  },
  item: {
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
  },
  title: {
    flex: 4,
    fontSize: 10,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    margin: 0,
    textAlign: 'left',
  }
});
const ButtonItem = (props: any): any => {
  return (
    <Pressable
      onPress={(): any => {
        props.setbutton();
      }}
      style={[
        styles.item,
        {
          backgroundColor: props.data.isActivated ? props.data.activatedColor : bgcolorWhite2,
        },
      ]}>
      <Icon
        style={styles.iconStyle}
        name={props.data.iconName}
        size={20}
        color="#000"
      />
      <Text style={styles.title}>{props.data.displayName}</Text>
    </Pressable>
  );
};
const NotificationsCategories = (props: any): any => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const backgroundColor = themeContext?.colors.PRIMARY_COLOR;
  const cgColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const cdColor = themeContext?.colors.CHILDDEVELOPMENT_COLOR;
  const vcColor = themeContext?.colors.VACCINATION_COLOR;
  const hcColor = themeContext?.colors.HEALTHCHECKUP_COLOR;
  const allbuttons = [
    {
      id: 0,
      iconName: 'ic_growth',
      displayName: t('drawerMenucgTxt'),
      activatedColor: cgColor,
      isActivated: false,
      type: "gw",
    },
    {
      id: 1,
      iconName: 'ic_milestone',
      displayName: t('drawerMenucdTxt'),
      activatedColor: cdColor,
      isActivated: false,
      type: "cd",
    },
    {
      id: 2,
      iconName: 'ic_vaccination',
      displayName: t('drawerMenuvcTxt'),
      activatedColor: vcColor,
      isActivated: false,
      type: "vc",
    },
    {
      id: 3,
      iconName: 'ic_doctor_chk_up',
      displayName: t('drawerMenuhcTxt'),
      activatedColor: hcColor,
      isActivated: false,
      type: "hc",
    },
  ];
  const [products, setProducts] = useState(allbuttons);

  const handleChange = (id: number): any => {
    const updated = products.map((item) => {
      if (id === item.id) {
        return { ...item, isActivated: !item.isActivated };
      }
      return item;
    });
    setProducts(updated);
    props.onchange(updated);
  };
  return (
    <>
      <View style={{ backgroundColor: backgroundColor }}>
        <View
          style={styles.containerView}>
          <FlexRow>
            <ButtonItem data={products[0]} setbutton={(): any => handleChange(0)} />
            <ButtonItem data={products[1]} setbutton={(): any => handleChange(1)} />
          </FlexRow>
          <FlexRow>
            <ButtonItem data={products[2]} setbutton={(): any => handleChange(2)} />
            <ButtonItem data={products[3]} setbutton={(): any => handleChange(3)} />
          </FlexRow>
        </View>
      </View>
    </>
  );
};
export default NotificationsCategories;
