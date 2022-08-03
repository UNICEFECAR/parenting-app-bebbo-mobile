import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import TabScreenHeader from '@components/TabScreenHeader';
import iframe from '@native-html/iframe-plugin';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import RenderImage from '../../services/RenderImage';
import { addSpaceToHtml } from '../../services/Utils';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const Aboutus = ({navigation }: Props) => {
  const themeContext = useContext(ThemeContext);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const { t } = useTranslation();
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const aboutusdata = useAppSelector(
    (state: any) => state.utilsData.aboutus.body,
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  return (
    <>
      <View style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <View
          style={{
            flexDirection: 'column',
            paddingBottom: 15,
            // flex: 1, bottom padding is coming blue due to this
            backgroundColor: "#FFF",
          }}>
          <View
            style={{
              flexDirection: 'row',
              maxHeight: 50,
            }}>
            <TabScreenHeader
              title={t('aboutUsScreenheaderTitle')}
              headerColor={headerColor}
              textColor="#FFF"
              setProfileLoading={setProfileLoading}
            />
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10, paddingTop: 20 }}>
            {aboutusdata != "" ?
              <HTML
                source={{ html: addSpaceToHtml(aboutusdata) }}
                baseFontStyle={{ fontSize: 16, color: '#000' }}
                ignoredStyles={['color', 'font-size', 'font-family']}
                tagsStyles={{
                  p: { marginBottom: 15, marginTop: 0, textAlign: 'left' },
                  h1: { marginBottom: 0, marginTop: 10, textAlign: 'left' },
                  h2: { marginBottom: 15, marginTop: 0, textAlign: 'left' },
                  h3: { marginBottom: 15, marginTop: 0, textAlign: 'left' },
                  h4: { marginBottom: 15, marginTop: 0, textAlign: 'left' },
                  h5: { marginBottom: 15, marginTop: 0, textAlign: 'left' },
                  h6: { marginBottom: 15, marginTop: 0, textAlign: 'left' },
                  span: { marginBottom: 15, marginTop: 0, textAlign: 'left' },
                  br: { height: 0 },
                  iframe: { maxWidth: '100%', height: 200 }
                }}
                renderers={{
                  iframe,
                  img: (attribs: any) => {
                    const imagePath: any = attribs.src;
                    console.log(imagePath, "..imagePath");
                    if (imagePath != "" && imagePath != null && imagePath != undefined) {
                      let itemnew: any = {
                        cover_image: {
                          url: imagePath
                        }
                      };
                      return (
                        <RenderImage key={imagePath + "/" + Math.random()} uri={imagePath} itemnew={itemnew} toggleSwitchVal={toggleSwitchVal} />

                      );
                    }
                  },
                }}
                WebView={WebView}
                renderersProps={{
                  iframe: { webViewProps: { allowsFullscreenVideo: true } }
                }}
              />
              : null
            }
          </ScrollView>
        </View>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};
export default Aboutus;
