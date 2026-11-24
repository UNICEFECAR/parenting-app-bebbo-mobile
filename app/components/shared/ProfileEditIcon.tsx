import React from 'react';
import Svg, {Path} from 'react-native-svg';

// Original ic_edit outline from assets/iconConfig/config.json, rendered without
// Text's font metrics. The padded viewBox keeps the 16px pencil clear of clipping.
export default function ProfileEditIcon() {
  return (
    <Svg width={16} height={20} viewBox="-84 -125 1000 1250" accessible={false}>
      <Path
        d="M59 1000A59 59 0 0 1 0 940L1 680A60 60 0 0 1 13 644L463 48A120 120 0 0 1 543 1 121 121 0 0 1 633 25L784 139A121 121 0 0 1 807 308L357 904A58 58 0 0 1 326 926L75 998A62 62 0 0 1 59 1000ZM560 32A88 88 0 0 0 489 67L39 663A28 28 0 0 0 33 680L32 941A27 27 0 0 0 43 963 26 26 0 0 0 68 967L318 895A26 26 0 0 0 332 885H332L782 289A89 89 0 0 0 800 223 88 88 0 0 0 765 164L614 50A89 89 0 0 0 560 32ZM717 417A16 16 0 0 1 708 414L389 173A16 16 0 0 1 408 147L727 389A16 16 0 0 1 717 418ZM342 914A15 15 0 0 1 332 911L13 670A16 16 0 0 1 32 644L351 885A16 16 0 0 1 354 908 16 16 0 0 1 342 914Z"
        fill="#000"
      />
    </Svg>
  );
}
