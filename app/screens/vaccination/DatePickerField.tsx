import React from "react";
import { Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTime } from "luxon";
import { FormDateAction, FormDateText, FormInputBoxWithoutLine, FormInputGroup } from "@components/shared/ChildSetupStyle";
import { formatStringDate } from "../../services/Utils";
import Icon from "@components/shared/Icon";
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
    calendarIcon?: string;
};

const DatePickerField = ({
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
    calendarIcon = "ic_calendar",
}: Props) => {
    const rawDate =
        value instanceof DateTime
            ? value.toJSDate()
            : new Date(value ?? Date.now());

    const pickerDate =
        minimumDate && rawDate < minimumDate
            ? minimumDate
            : rawDate;
            console.log("minimumDate", minimumDate);
            console.log("minimumDate ISO", minimumDate?.toISOString());
            console.log("Now ISO", new Date().toISOString());
            console.log("pickerDate", pickerDate);
    return (
        <FormInputGroup onPress={onPress}>
            <FormInputBoxWithoutLine>
                <FormDateText>
                    <Text>
                        {value
                            ? formatStringDate(
                                value instanceof DateTime
                                    ? value
                                    : DateTime.fromMillis(value)
                            )
                            : placeholder}
                    </Text>
                    {Platform.OS === "android" ? (
                        showPicker && (
                            <DateTimePicker
                                testID="datePicker"
                                mode="date"
                                value={pickerDate}
                                locale={locale}
                                display="spinner"
                                minimumDate={minimumDate}
                                maximumDate={maximumDate}
                                onChange={onAndroidChange}
                            />
                        )
                    ) : (
                        <DateTimePickerModal
                            isVisible={iosVisible}
                            mode="date"
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
                    <Icon
                        name={calendarIcon}
                        size={20}
                        color="#000"
                    />
                </FormDateAction>
            </FormInputBoxWithoutLine>
        </FormInputGroup>
    );
};

export default React.memo(DatePickerField);