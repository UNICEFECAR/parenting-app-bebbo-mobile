import React, {useEffect, useRef} from 'react';
import {FlatList, type FlatListProps, I18nManager} from 'react-native';

// Content can arrive after a horizontal list has mounted. In RTL, explicitly
// position that new content at its logical beginning once it has a native size.
export default function HorizontalContentList<Item>(props: FlatListProps<Item>) {
  const list = useRef<FlatList<Item>>(null);
  const positioned = useRef(false);

  useEffect(() => {
    if (!props.data?.length) positioned.current = false;
  }, [props.data?.length]);

  return (
    <FlatList
      {...props}
      ref={list}
      horizontal
      onContentSizeChange={(width, height) => {
        if (
          I18nManager.isRTL &&
          props.data?.length &&
          width > 0 &&
          !positioned.current
        ) {
          list.current?.scrollToOffset({offset: 0, animated: false});
          positioned.current = true;
        }
        props.onContentSizeChange?.(width, height);
      }}
    />
  );
}
