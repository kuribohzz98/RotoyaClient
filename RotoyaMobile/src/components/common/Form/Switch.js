import React from 'react';
import { View, Text } from 'react-native';
import { Switch } from 'galio-framework';

export default switchField = ({
    input: { onChange, value },
    label,
    color,
    disable,
    labelSize
}) => (
        <View style={{flexDirection: 'row' }}>
            <Text style={{ fontWeight: 'bold', fontSize: labelSize || 16 }}>{label}: </Text>
            <Switch
                value={!!value}
                onChange={value => onChange(value)}
                color={color || 'primary'}
                disable={disable || false}
                initialValue={!!value}
            />
        </View>
    )