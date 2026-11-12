import React, { type PropsWithChildren } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = PropsWithChildren<{
  percent: number;
  radius: number;
  borderWidth: number;
  color?: string;
  shadowColor?: string;
  bgColor?: string;
}>;

export default function ProgressCircle({
  percent, radius, borderWidth, color = '#f00', shadowColor = '#999', bgColor = '#e9e9ef', children,
}: Props) {
  const progress = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
  const strokeRadius = radius - borderWidth / 2;
  const circumference = 2 * Math.PI * strokeRadius;

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        accessible={false}
        style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
      >
        <Circle cx={radius} cy={radius} r={strokeRadius}
          fill={bgColor} stroke={shadowColor} strokeWidth={borderWidth} />
        <Circle cx={radius} cy={radius} r={strokeRadius}
          fill="none" stroke={color} strokeWidth={borderWidth}
          strokeDasharray={[circumference, circumference]}
          strokeDashoffset={circumference * (1 - progress / 100)}
          rotation={-90} origin={`${radius}, ${radius}`} />
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
    alignItems: 'center', justifyContent: 'center',
  },
});
