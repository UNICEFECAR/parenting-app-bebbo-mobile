import {
  ButtonTextMdLine,
  ButtonEditPress,
} from "@components/shared/ButtonGlobal";
import { BannerContainer1 } from "@components/shared/Container";
import {
  FDirRowStart,
  Flex1,
  Flex_5,
  Flex2,
  Flex3,
  FlexColEnd,
  FlexDirColStart,
  FlexDirRowEnd,
  FlexDirRowSpace,
  FlexDirRowSpaceStart,
} from "@components/shared/FlexBoxStyle";
import Icon, {
  IconViewAlert,
  OuterIconLeft,
  OuterIconRow,
} from "@components/shared/Icon";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import { PrematureTagGrowth } from "@components/shared/PrematureTag";
import { useNavigation } from "@react-navigation/native";
import {
  Heading2,
  Heading3,
  Heading4,
  Heading4Centerr,
  Heading4Regular,
  Heading5,
  Heading5Bold,
  ShiftFromTop20,
} from "../../instances/bebbo/styles/typography";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-svg";
import { useAppSelector } from "../../../App";
import useDigitConverter from "../../customHooks/useDigitConvert";
import { MeasuresEntity } from "../../database/schema/ChildDataSchema";
import { getCurrentChildAgeInYears } from "../../services/childCRUD";
import { formatStringDate } from "../../services/Utils";
const styles = StyleSheet.create({
  buttonTextDecoration: {
    textDecorationLine: "none",
  },
  headingFlexShrink: {
    flexShrink: 1,
  },
});
const LastChildMeasure = (): any => {
  const { t } = useTranslation();
  const { convertDigits } = useDigitConverter();
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ""
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : []
  );
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  let measures: any = [];
  if (activeChild?.measures.length > 0) {
    measures = activeChild.measures.filter(
      (item: any) => item.isChildMeasured == true
    );
  }

  let measurementDate: DateTime = DateTime.local();
  let childmeasures = measures.map((item: MeasuresEntity) => {
    if (item.measurementDate) {
      measurementDate = DateTime.fromJSDate(new Date(item.measurementDate));
    }

    let month: any = 0;

    if (activeChild?.birthDate) {
      const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
      month = Math.round(measurementDate.diff(birthDay, "month").months);
    }
    return {
      uuid: item.uuid,
      weight: item.weight ? parseFloat(item.weight) : 0,
      height: item.height ? parseFloat(item.height) : 0,
      measurementDate: formatStringDate(item?.measurementDate),
      dateToMilis: measurementDate?.toMillis(),
      isChildMeasured: item.isChildMeasured,
      titleDateInMonth: month,
      measurementPlace: item.measurementPlace,
      doctorComment: item.doctorComment,
      didChildGetVaccines: item.didChildGetVaccines,
      vaccineIds: item.vaccineIds,
    };
  });

  childmeasures = childmeasures.sort(
    (a: any, b: any) => a.dateToMilis - b.dateToMilis
  );
  const lastmeasurementDate = DateTime.fromMillis(
    childmeasures[childmeasures.length - 1]?.dateToMilis || 0
  );
  console.log(lastmeasurementDate, "..lastmeasurementDate..");
  const date = DateTime.fromISO(activeChild.birthDate);
  const convertInDays = lastmeasurementDate.diff(date, "days").days;
  console.log(convertInDays, "..convertInDays..");
  let days = 0;
  if (convertInDays !== undefined) {
    days = Math.round(convertInDays);
  }
  console.log(
    days,
    "....",
    activeChild.taxonomyData.days_from,
    activeChild.taxonomyData.days_to
  );
  const weight = childmeasures[childmeasures.length - 1]?.weight;
  const height = childmeasures[childmeasures.length - 1]?.height;
  return (
    <>
      <BannerContainer1>
        <FlexDirRowSpaceStart>
          <Flex3>
            <View>
              <Heading3>{t("growthScreensubHeading")}</Heading3>
              <Heading5>
                {t("growthScreenlastMeasureText", {
                  measureDate:
                    childmeasures[childmeasures.length - 1]?.measurementDate,
                })}
              </Heading5>
            </View>
          </Flex3>
          <Flex2>
            <FlexColEnd>
              {activeChild.isPremature === "true" ? (
                <Pressable onPress={(): any => setModalVisible(true)}>
                  <PrematureTagGrowth>
                    <Heading5Bold>
                      {t("growthScreenprematureText")}
                    </Heading5Bold>
                  </PrematureTagGrowth>
                </Pressable>
              ) : null}
              <Pressable
                onPress={(e): any => {
                  e.stopPropagation();
                  navigation.navigate("AllChildgrowthMeasures");
                }}
              >
                <ButtonTextMdLine numberOfLines={2}>
                  {t("growthScreenallMeasureHeader")}
                </ButtonTextMdLine>
              </Pressable>
            </FlexColEnd>
          </Flex2>
        </FlexDirRowSpaceStart>

        <ShiftFromTop20>
          <FlexDirRowSpace>
            <Flex2>
              <FlexDirRowSpace alignItems="flex-start">
                <FlexDirColStart>
                  <Heading4Regular>{t("growthScreenwText")}</Heading4Regular>
                  <Heading2>
                    {convertDigits(weight ? weight : "0")}{" "}
                    {t("growthScreenkgText")}
                  </Heading2>
                </FlexDirColStart>

                <FlexDirColStart>
                  <Heading4Regular>{t("growthScreenhText")}</Heading4Regular>
                  <Heading2>
                    {convertDigits(height || "0")} {t("growthScreencmText")}
                  </Heading2>
                </FlexDirColStart>
              </FlexDirRowSpace>
            </Flex2>
            <Flex_5>
              <FlexDirRowEnd>
                <ButtonEditPress
                  onPress={(): any => {
                    const lastmeasure = childmeasures[childmeasures.length - 1];
                    navigation.navigate("AddNewChildgrowth", {
                      headerTitle: t("growthScreeneditNewBtntxt"),
                      editMeasurementDate: lastmeasure.dateToMilis,
                    });
                  }}
                >
                  <ButtonTextMdLine
                    numberOfLines={2}
                    style={styles.buttonTextDecoration}
                  >
                    <Icon name="ic_edit" size={16} color="#000" />
                  </ButtonTextMdLine>
                </ButtonEditPress>
              </FlexDirRowEnd>
            </Flex_5>
          </FlexDirRowSpace>
          {/* <Text>{days+"hi"}</Text>
          <Text>{activeChild.taxonomyData.days_from+"hi"}</Text> */}
          {days < activeChild.taxonomyData.days_from ? (
            <ShiftFromTop20>
              <FDirRowStart>
                <OuterIconRow>
                  <OuterIconLeft>
                    <IconViewAlert>
                      <Icon name="ic_incom" size={24} color="#FFF" />
                    </IconViewAlert>
                  </OuterIconLeft>
                </OuterIconRow>
                <Heading4 style={styles.headingFlexShrink}>
                  {t("noRecentGrowthMeasure")}
                </Heading4>
              </FDirRowStart>
            </ShiftFromTop20>
          ) : null}
          {getCurrentChildAgeInYears(
            DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis()
          ) > 5 ? (
            <ShiftFromTop20>
              <FDirRowStart>
                <OuterIconRow>
                  <OuterIconLeft>
                    <IconViewAlert>
                      <Icon name="ic_incom" size={24} color="#FFF" />
                    </IconViewAlert>
                  </OuterIconLeft>
                </OuterIconRow>
                <Heading4 style={styles.headingFlexShrink}>
                  {t("fiveYearsGreater")}
                </Heading4>
              </FDirRowStart>
            </ShiftFromTop20>
          ) : null}
        </ShiftFromTop20>
      </BannerContainer1>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={(): any => {
          setModalVisible(false);
        }}
        onDismiss={(): any => {
          setModalVisible(false);
        }}
      >
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={(): any => {
                  setModalVisible(false);
                }}
              >
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t("childSetupprematureMessageNext")}
              </Heading4Centerr>
            </ModalPopupContent>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </>
  );
};
export default LastChildMeasure;
