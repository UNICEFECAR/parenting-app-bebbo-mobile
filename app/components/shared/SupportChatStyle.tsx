import styled from 'styled-components/native';
import { FlexCol } from './FlexBoxStyle';
import { botBubbleContainerColor } from '@styles/style';
const ChatContainer = styled.View`
  width: 100%;
  height: 100%;
  paddingLeft: 10px;
  paddingRight: 10px;
  position:relative;
  z-index:1;
`;
export default ChatContainer;

export const ChatBgImage = styled.View`
    width: 100%;
    height: 100%;
    position: absolute;
    background-color:#dbe9f6;
`;
export const BotImage = styled.View`
    height: 36px;
    width: 36px;
    border-radius:100px;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    margin-left: 5px;
`;

export const BotBubbleContainer = styled(FlexCol)`
  background-color: ${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
`;
export const BotBubbleTextContainer = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: ${botBubbleContainerColor};
    padding: 15px;
    padding-top: 17px;
    padding-bottom: 17px;
`;

export const UserBubbleContainer = styled.View`
    flex:1;
    justify-content: flex-end;
    align-items: flex-end;
`;
export const UserBubbleTextContainer = styled.View`
    background-color:${(props:any):any => props.theme?.colors?.PRIMARY_COLOR};
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 40px;
    margin-left: 100px;
    padding-top: 17px;
    padding-bottom: 17px;
    width:auto;
    min-width:160px;
`;
export const OptionBubbleContainer = styled.View`
    flex:1;
    margin-bottom: 10px;
    margin-left: 55px;
`;
export const OptionBubblePressable = styled.Pressable`
    justify-content: center;
    align-items: center;
    background-color: ${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
    padding: 15px;
    border-radius: 4px;
    border-width: 2px;
    border-color: ${(props:any):any => props.theme?.colors?.PRIMARY_COLOR};
    padding-top: 17px;
    padding-bottom: 17px;
`;
export const ActionBubbleContainer = styled.View`
    flex:1;
    flex-direction: row;
    margin-left: 65px;
    margin-right: 10px;
`;
export const ActionBubblePressable = styled.Pressable`
    flex-direction: row;
    flex:1;
    align-items: center;
    background-color: ${(props:any):any => props.theme?.colors?.CHAT_ACTION_BG_COLOR};
    padding: 4px;
    padding-right: 10px;
    border-radius: 100px;
    margin-bottom: 10px;
    border-width: 2px;
    border-color: ${(props:any):any => props.theme?.colors?.PRIMARY_COLOR};
`;
export const ActionBubbleIcon = styled.View`
    height: 40px;
    width: 40px;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    background-color: ${(props:any):any => props.theme?.colors?.CHAT_ACTION_ICON};
    border-radius: 100px;
`;