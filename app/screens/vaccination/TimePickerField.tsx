import React from "react";
import { Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTime } from "luxon";
import Icon, { IconViewBorder } from "@components/shared/Icon";
import { FormDateAction, FormDateText, FormInputBoxWithoutLine, FormInputGroup } from "@components/shared/ChildSetupStyle";
import { formatStringTime } from "../../services/Utils";

type Props = {
    value: DateTime | number | null;
    placeholder: string;
    locale: string;
    minimumDate?: Date;
    maximumDate?: Date;
    showPicker: boolean;
    iosVisible: boolean;
    onPress: () => void;
    onAndroidChange: (event: any, date?: Date) => void;
    onIOSConfirm: (date: Date) => void;
    onIOSCancel: () => void;
    iconName?: string;
    is24Hour?: boolean;
};

const TimePickerField = ({
    value,
    placeholder,
    locale,
    minimumDate,
    maximumDate,
    showPicker,
    iosVisible,
    onPress,
    onAndroidChange,
    onIOSConfirm,
    onIOSCancel,
    iconName = "ic_time",
    is24Hour = false,
}: Props) => {
    const pickerDate =
        value instanceof DateTime
            ? value.toJSDate()
            : new Date(value ?? Date.now());
    return (
        <FormInputGroup onPress={onPress}>
            <FormInputBoxWithoutLine>
                <FormDateText>
                    <Text>
                        {value
                            ? formatStringTime(
                                value instanceof DateTime
                                    ? value.toMillis()
                                    : value
                            )
                            : placeholder}
                    </Text>

                    {Platform.OS === "android" ? (
                        showPicker && (
                            <DateTimePicker
                                testID="timePicker"
                                mode="time"
                                display="spinner"
                                locale={locale}
                                value={pickerDate}
                                is24Hour={is24Hour}
                                minimumDate={minimumDate}
                                maximumDate={maximumDate}
                                onChange={onAndroidChange}
                            />
                        )
                    ) : (
                        <DateTimePickerModal
                            isVisible={iosVisible}
                            mode="time"
                            locale={locale}
                            date={pickerDate}
                            minimumDate={minimumDate}
                            maximumDate={maximumDate}
                            onConfirm={onIOSConfirm}
                            onCancel={onIOSCancel}
                        />
                    )}
                </FormDateText>

                <FormDateAction>
                    <IconViewBorder>
                        <Icon
                            name={iconName}
                            size={20}
                            color="#000"
                        />
                    </IconViewBorder>
                </FormDateAction>
            </FormInputBoxWithoutLine>
        </FormInputGroup>
    );
};

export default React.memo(TimePickerField);