export const addSeparatorToDate = (value: string, separator: '-' | '/') => {
    let outputValue = value.replace(/\D/g, '');

    if (outputValue.length > 3 && outputValue.length < 6) {
        outputValue = `${outputValue.substring(0, 4)}${separator}${outputValue.substring(4, 6)}`;
    } else if (outputValue.length >= 6) {
        outputValue = `${outputValue.substring(0, 4)}${separator}${outputValue.substring(4, 6)}${separator}${outputValue.substring(6, outputValue.length)}`;
    }

    return outputValue;
};
