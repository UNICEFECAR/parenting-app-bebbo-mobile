import {type PressableProps} from 'react-native';

/** Preserve caller roles/states while exposing the actual native disabled state. */
export function buttonAccessibility(props: PressableProps): Pick<PressableProps, 'accessibilityRole' | 'accessibilityState'> {
  return {
    accessibilityRole: props.accessibilityRole ?? 'button',
    accessibilityState: {
      ...props.accessibilityState,
      disabled: props.disabled ?? props.accessibilityState?.disabled,
    },
  };
}
