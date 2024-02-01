import styled from 'styled-components/native';
const TextInputML = styled.TextInput`
    text-align: ${(props:any):any => props.theme.isRTL ? 'right' : 'left'};
`;

export default TextInputML;