export const AddSlashToDate = (value) => {
    let outputValue = value.replace(/\D/g, '');

    if (outputValue.length > 1 && outputValue.length < 4) {
        outputValue = `${outputValue.substring(0, 2)}/${outputValue.substring(2, 3)}`;
    } else if (outputValue.length >= 4) {
        outputValue = `${outputValue.substring(0, 2)}/${outputValue.substring(2, 4)}/${outputValue.substring(4, outputValue.length)}`;
        outputValue = outputValue.substring(0, 10);
    }

    return outputValue;
}
