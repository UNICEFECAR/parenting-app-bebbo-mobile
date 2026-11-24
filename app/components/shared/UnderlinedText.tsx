import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View, type TextProps} from 'react-native';

type Underline = {left: number; top: number; width: number};

// Android's font-provided underline can overlap the glyphs. Position a line
// below each measured baseline instead, retaining native text layout/scaling.
export default function UnderlinedText({style, onTextLayout, ...props}: TextProps): React.JSX.Element {
  const [lines, setLines] = useState<Underline[]>([]);
  const textStyle = StyleSheet.flatten(style);
  if (Platform.OS !== 'android' || textStyle?.textDecorationLine === 'none') {
    return <Text {...props} style={style} onTextLayout={onTextLayout} />;
  }
  return (
    <View>
      <Text
        {...props}
        style={[style, {textDecorationLine: 'none'}]}
        onTextLayout={event => {
          const next = event.nativeEvent.lines.slice(0, props.numberOfLines || undefined)
            .map(line => ({left: line.x, top: line.y + line.ascender + 1.5, width: line.width}));
          setLines(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
          onTextLayout?.(event);
        }}
      />
      <View pointerEvents="none" accessible={false} style={StyleSheet.absoluteFill}>
        {lines.map((line, index) => (
          <View
            key={index}
            style={{position: 'absolute', ...line, height: 1, backgroundColor: textStyle?.textDecorationColor ?? textStyle?.color ?? '#000'}}
          />
        ))}
      </View>
    </View>
  );
}
