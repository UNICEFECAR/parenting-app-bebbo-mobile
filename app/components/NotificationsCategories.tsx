import Icon from '@components/shared/Icon';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { FlexRow, FlexDirRow } from './shared/FlexBoxStyle';
const ButtonItem = (props: any) => {
  return (
    <Pressable
      onPress={() => {
        props.setbutton();
      }}
      style={[
        styles.item,
        {
          backgroundColor: props.data.isActivated ? props.data.activatedColor : '#FFF',
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
const NotificationsCategories = (props: any) => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const backgroundColor = themeContext.colors.PRIMARY_COLOR;
  const cgColor = themeContext.colors.CHILDGROWTH_COLOR;
  const cdColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const vcColor = themeContext.colors.VACCINATION_COLOR;
  const hcColor = themeContext.colors.HEALTHCHECKUP_COLOR;
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
      type:"cd",
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

  const handleChange = (id: number) => {
    let updated = products.map((item) => {
      if (id === item.id) {
        return {...item, isActivated: !item.isActivated};
      }
      return item;
    });
    setProducts(updated);
    props.onchange(updated);
  };
  return (
    <>
    <View style={{backgroundColor: backgroundColor,}}>
      <View
        style={{
          padding: 10,
          
          minHeight: 120,
          maxWidth:280,
          width:'100%',
          marginLeft:'auto'
          ,marginRight:'auto',
        }}>
        <FlexRow>
          <ButtonItem data={products[0]} setbutton={() => handleChange(0)} />
          <ButtonItem data={products[1]} setbutton={() => handleChange(1)} />
        </FlexRow>
        <FlexRow>
          <ButtonItem data={products[2]} setbutton={() => handleChange(2)} />
          <ButtonItem data={products[3]} setbutton={() => handleChange(3)} />
        </FlexRow>
      </View>
      </View>
    </>
  );
};
export default NotificationsCategories;
const styles = StyleSheet.create({
  item: {
    // backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 5,
    // padding: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 10,
    // padding: 5,
    margin: 0,
    flex: 2,
    width: 120,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
});
