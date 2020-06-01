import React from 'react';
import { Checkbox } from 'galio-framework';

export default checkboxField = ({
    input: { onChange, value },
    label,
    iconFamily,
    iconName,
    labelStyle,
    color,
    disabled = false,
    onSubmitSelect
    // initialValue
}) => {
    // if (initialValue) onChange(initialValue);
    return (
        <Checkbox
            label={label}
            iconFamily={iconFamily}
            iconName={iconName}
            labelStyle={labelStyle}
            color={color}
            onChange={(value) => {
                onChange(value);
                onSubmitSelect && setTimeout(() => onSubmitSelect(), 500);
            }}
            disabled={disabled}
            initialValue={value || false}
        />
    )}