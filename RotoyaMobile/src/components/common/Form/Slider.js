import React from 'react';
import { View, Text } from 'react-native';
import { Slider } from 'react-native-elements';

export default sliderField = ({
    input: { onChange, value },
    label,
    labelSize,
    disabled,
    thumbTintColor,
    minimumTrackTintColor,
    maximumTrackTintColor,
    step,
    maximumValue,
    minimumValue,
    unit
}) => (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: labelSize || 16 }}>{label}: </Text>
                <Text style={{ fontSize: labelSize || 16 }}>{value || 0}{"  " + unit || ""}</Text>
            </View>
            <Slider
                maximumValue={maximumValue || 2}
                thumbTintColor={thumbTintColor || "#436fb5"}
                minimumTrackTintColor={minimumTrackTintColor || "#222f45"}
                maximumTrackTintColor={maximumTrackTintColor || "#8cb3f5"}
                onValueChange={value => onChange(value)}
                step={step || 1}
                disabled={disabled || false}
                value={+value}
                minimumValue={minimumValue || 0}
            />
        </View>
    )