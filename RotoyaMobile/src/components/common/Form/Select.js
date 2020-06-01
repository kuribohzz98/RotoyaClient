import React from 'react';
import { View, Text } from 'react-native';
import Select from '../Select';

export default selectField = ({
    input: { onChange, value },
    label,
    labelSize,
    textSize,
    options,
    disabled,
    color,
    width,
    row
}) => (
        <View style={{ flexDirection: row ? 'row' : 'column' }}>
            <Text
                style={row ? {
                    alignSelf: 'flex-end',
                    fontWeight: 'bold',
                    fontSize: labelSize || 16
                } : {
                        fontWeight: 'bold',
                        fontSize: labelSize || 16,
                        marginBottom: 10
                    }}
            >{label}:  </Text>
            <Select
                color={color}
                defaultValue={value || 0}
                options={options}
                textStyle={{ fontSize: textSize || 16 }}
                dropdownTextStyle={{ fontSize: textSize || 16 }}
                onSelect={(index, value) => onChange(value)}
                disabled={disabled}
                style={{ width: width || 100 }}
                dropdownStyle={{ marginTop: 8, marginLeft: -16, width: width || 100 }}
                defaultText={value ? value : "Please select..."}
            />
        </View >
    )