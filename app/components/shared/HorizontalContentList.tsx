import React, {useEffect, useRef} from 'react';
import {FlatList, type FlatListProps, I18nManager} from 'react-native';

// Content can arrive after a horizontal list has mounted. In RTL, explicitly
// position that new content at its logical beginning once it has a native size.
export default function HorizontalContentList<Item>(props: FlatListProps<Item>) {
  const list = useRef<FlatList<Item>>(null);
  const positioned = useRef<string | undefined>(undefined);
  const contentKey = JSON.stringify(
    Array.from(props.data ?? [], (item, index) =>
      props.keyExtractor ? props.keyExtractor(item, index) : String(index),
    ),
  );

  useEffect(() => {
    if (!props.data?.length) positioned.current = undefined;
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
          positioned.current !== contentKey
        ) {
          list.current?.scrollToOffset({offset: 0, animated: false});
          positioned.current = contentKey;
        }
        props.onContentSizeChange?.(width, height);
      }}
    />
  );
}
