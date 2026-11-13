import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import ActionSheet, {
  ScrollView,
  type ActionSheetProps,
  type ActionSheetRef,
} from 'react-native-actions-sheet';

export type AppActionSheetRef = {
  show: () => void;
  hide: () => void;
  isOpen: () => boolean;
  // False means another dismissal already owns the next action, or the screen
  // unmounted. Callers must not present a second picker/dialog in those cases.
  hideAndWait: () => Promise<boolean>;
};

const styles = StyleSheet.create({scroll: {flexGrow: 0}});

const AppActionSheet = forwardRef<AppActionSheetRef, ActionSheetProps>(
  ({children, onClose, onBeforeClose, ...props}, forwardedRef) => {
    const sheet = useRef<ActionSheetRef>(null);
    const closing = useRef(false);
    const completion = useRef<((closed: boolean) => void) | null>(null);
    const {height} = useWindowDimensions();

    useEffect(
      () => () => {
        completion.current?.(false);
        completion.current = null;
      },
      [],
    );

    useImperativeHandle(
      forwardedRef,
      () => ({
        show: () => sheet.current?.show(),
        isOpen: () => sheet.current?.isOpen() ?? false,
        hide: () => {
          if (sheet.current?.isOpen() && !closing.current) {
            closing.current = true;
            sheet.current.hide();
          }
        },
        hideAndWait: () => {
          if (!sheet.current || closing.current) return Promise.resolve(false);
          if (!sheet.current.isOpen()) return Promise.resolve(true);
          closing.current = true;
          return new Promise<boolean>(resolve => {
            completion.current = resolve;
            sheet.current?.hide();
          });
        },
      }),
      [],
    );

    return (
      <ActionSheet
        {...props}
        ref={sheet}
        onBeforeClose={(...args) => {
          closing.current = true;
          onBeforeClose?.(...args);
        }}
        onClose={(...args) => {
          closing.current = false;
          completion.current?.(true);
          completion.current = null;
          onClose?.(...args);
        }}>
        <ScrollView
          style={[styles.scroll, {maxHeight: height * 0.85}]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </ActionSheet>
    );
  },
);

export default AppActionSheet;
