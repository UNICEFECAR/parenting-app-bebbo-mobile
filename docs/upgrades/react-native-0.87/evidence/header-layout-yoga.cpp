#include <yoga/Yoga.h>
#include <algorithm>
#include <cmath>
#include <iostream>
int main() {
  int cases = 0;
  std::cout << "height,width,textHeight,direction,flex,headerHeight,contentHeight\n";
  for (float height : {480.f, 800.f}) for (float width : {320.f, 430.f})
  for (float textHeight : {30.f, 60.f, 90.f}) for (auto direction : {YGDirectionLTR, YGDirectionRTL})
  for (float flex : {1.f, 0.f}) {
    auto root = YGNodeNew(), header = YGNodeNew(), title = YGNodeNew(), body = YGNodeNew();
    YGNodeStyleSetWidth(root, width); YGNodeStyleSetHeight(root, height);
    YGNodeStyleSetFlexDirection(root, YGFlexDirectionColumn);
    YGNodeStyleSetFlexDirection(header, YGFlexDirectionRow);
    YGNodeStyleSetFlexGrow(header, flex); YGNodeStyleSetFlexShrink(header, flex);
    if (flex == 0) YGNodeStyleSetFlexBasisAuto(header); else YGNodeStyleSetFlexBasis(header, 0);
    YGNodeStyleSetMinHeight(header, 50);
    YGNodeStyleSetFlex(title, 4); YGNodeStyleSetPadding(title, YGEdgeVertical, 10);
    auto text = YGNodeNew(); YGNodeStyleSetHeight(text, textHeight);
    YGNodeInsertChild(title, text, 0); YGNodeInsertChild(header, title, 0);
    YGNodeStyleSetFlex(body, 1); YGNodeInsertChild(root, header, 0); YGNodeInsertChild(root, body, 1);
    YGNodeCalculateLayout(root, width, height, direction);
    auto actual = YGNodeLayoutGetHeight(header), available = YGNodeLayoutGetHeight(body);
    auto expected = std::max(50.f, textHeight + 20);
    if (flex == 0 && (std::abs(actual - expected) > .01 || std::abs(available - (height-expected)) > .01)) return 1;
    if (flex == 1 && actual <= expected) return 2;
    std::cout << height << ',' << width << ',' << textHeight << ',' << (direction == YGDirectionLTR ? "ltr" : "rtl")
      << ',' << flex << ',' << actual << ',' << available << '\n';
    YGNodeFreeRecursive(root); cases++;
  }
  std::cerr << cases << " real RN Yoga layout cases passed\n";
}
