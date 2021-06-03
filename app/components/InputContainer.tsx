import React from 'react';
import styled from 'styled-components/native';
const Container = styled.View`
  width: 100%;
`;
const TextInput = styled.TextInput`
  width: 100%;
  height: 160px;
  font-size: 24px;
  flex: 1;
  color: #010101;
  /* margin-left: 10px; */
  background-color: #FFF;
`;
const InputContainer = () => {
  return (
    <Container>
      <TextInput placeholder="What's on your mind?" />
    </Container>
  );
};
export default InputContainer;