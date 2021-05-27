import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styled from 'styled-components/native';

// const CheckboxContainer = styled.View`
//   display: inline-block;
//   vertical-align: middle;
// `

// const Icon = styled.Image`
//   fill: none;
//   stroke: white;
//   stroke-width: 2px;
// `
// // Hide checkbox visually but remain accessible to screen readers.
// // Source: https://polished.js.org/docs/#hidevisually
// const HiddenCheckbox = styled.TextInput`
//   border: 0;
//   clip: rect(0 0 0 0);
//   clippath: inset(50%);
//   height: 1px;
//   margin: -1px;
//   overflow: hidden;
//   padding: 0;
//   position: absolute;
//   white-space: nowrap;
//   width: 1px;
// `

// const StyledCheckbox = styled.View<{ checked: boolean }>`
//   display: inline-block;
//   width: 16px;
//   height: 16px;
//   background: ${(props) => (props.checked ? 'salmon' : 'papayawhip')}
//   border-radius: 3px;
//   transition: all 150ms;

//   ${HiddenCheckbox}:focus + & {
//     box-shadow: 0 0 0 3px pink;
//   }

//   ${Icon} {
//     visibility: ${(props) => (props.checked ? 'visible' : 'hidden')}
//   }
// `


interface IProps {
    label: string;
    extralabel?: string;
    goToPrivacy?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    checkedValue: boolean;
  }
  
  const CheckBox :React.FC<IProps>= ({label,extralabel,goToPrivacy,checkedValue}) => {
      const [checked,setChecked] = useState(checkedValue);
      let checkedbox = true;
      const togglefun = () => {

      }
      useEffect(() => {
          console.log("effect ",checked);
      },[checked])
    return (
        <>
        <Pressable
        onPress={() => {
          console.log("pressed123--",checkedbox);
        //   (checked===true) ? setChecked(false) : setChecked(true);
            setChecked(prevchecked => !prevchecked);
            // checkedbox = !checkedbox;
          console.log("after123--",checkedbox);
        //   setChecked(checkedbox);
        }}>
            <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center' }}>
            <View style={{
              padding: 1, 
              width: 25, 
              height: 25, 
              backgroundColor: "#fff",
              borderColor: '#000',
              borderWidth:1,
              borderStyle:'solid'
            }}>
              {
                checked
                  ?
                  (<View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                      {/* <Text>Checked</Text> */}
                      <Image style={{width: 22,height: 22,resizeMode:'contain'}} source={ require( '../assets/tick_old.jpg') } />
                  </View>)
                  :
                  (<View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                      {/* <Text>UNChecked</Text> */}
                    </View>)
              }
          </View>
          <Text style={{ fontSize: 18,paddingLeft: 15,color: '#000' }}>
            {label}
            {extralabel != 'null' ? <Text style={{ fontWeight: "bold" }} onPress={()=>goToPrivacy()}>{extralabel}</Text> : null}
          </Text>
        </View>
        </Pressable>
        {/* // <CheckboxContainer className={className}>
        //     <HiddenCheckbox checked={checked} {...props} />
        //     <StyledCheckbox checked={checked}>
        //     <Icon viewBox="0 0 24 24">
        //         <polyline points="20 6 9 17 4 12" />
        //     </Icon>
        //     </StyledCheckbox>
        // </CheckboxContainer> */}
        </>
    );
  
    // return content;
  };
  


  export default CheckBox;
