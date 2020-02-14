import React from 'react';
import { View, Text } from 'react-native';
import { Radio } from 'galio-framework';

export default RadioField = ({
    input: { value, onChange },
    label = '',
    labelSize,
    labelComponents = [],
    color = 'primary',
    colorInner
}) => (
        <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontWeight: 'bold', fontSize: labelSize || 16 }}>{label}: </Text>
            <View>
                {
                    labelComponents.map((labelComponent, index) => {
                        let labelTemp = labelComponent;
                        if (!index) {
                            labelTemp = labelTemp + ' (to day)';
                        }
                        return (
                            <Radio
                                label={labelTemp}
                                color={color}
                                radioInnerStyle={{ backgroundColor: colorInner }}
                                flexDirection="row"
                                // onChange={() =>  onChange(labelComponent) || null}
                                initialValue={value || false}
                            />
                        )
                    })
                }
            </View>
        </View>
    )