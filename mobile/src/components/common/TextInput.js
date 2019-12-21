import React from 'react';
import { View, Platform, StyleSheet, TextInput } from 'react-native';
import { fonts, colors } from '../../styles';
import { Hoshi } from 'react-native-textinput-effects';
// const RotoyaTextInput = ({
//   type,
//   dark,
//   style,
//   placeholderTextColor,
//   ...restProps
// }) => {
//   const finalStyle = [
//     styles.default,
//     type === 'bordered' && styles.bordered,
//     dark && styles.dark,
//     style && style,
//   ];

//   return (
//     <View style={{ alignSelf: 'stretch', flexDirection: 'column' }}>
//       <TextInput
//         placeholderTextColor={placeholderTextColor || colors.white}
//         underlineColorAndroid="white"
//         {...restProps}
//         style={finalStyle}
//       />
//       {Platform.OS === 'ios' && (
//         <View style={{ height: 0.5, backgroundColor: 'white' }} />
//       )}
//     </View>
//   );
// };

// const HEIGHT = 40;

// const styles = StyleSheet.create({
//   default: {
//     height: HEIGHT,
//     color: 'white',
//     fontFamily: fonts.primaryRegular,
//     ...Platform.select({
//       android: {
//         paddingLeft: 5,
//         opacity: 0.9,
//       },
//     }),
//   },
//   bordered: {
//     borderWidth: 0.5,
//     borderColor: colors.lightGray,
//     borderRadius: 20,
//     paddingHorizontal: 20,
//   },
//   dark: {
//     color: colors.gray,
//   },
//   primary: {
//     borderRadius: HEIGHT / 2,
//     backgroundColor: 'transparent',
//   },
// });

const RotoyaTextInput = ({
  restInput,
  label,
  borderColor,
  borderHeight,
  inputPadding,
  backgroundColor,
  secureTextEntry
}) => {
  return (
    <Hoshi
      restInput={restInput}
      secureTextEntry={secureTextEntry}
      label={label}
      borderColor={borderColor}
      borderHeight={borderHeight}
      inputPadding={inputPadding}
      backgroundColor={backgroundColor}
    />
  )
}

export default RotoyaTextInput;
