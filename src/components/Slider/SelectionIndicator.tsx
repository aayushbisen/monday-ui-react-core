import React, { useMemo } from "react";
import debounce from "lodash/debounce";
import TextField from "../TextField/TextField";
import { useSliderActions, useSliderSelection } from "./SliderContext";
import { InfixKind } from "./SliderConstants";
import VibeComponentProps from "../../types/VibeComponentProps";

const VALUE_UPDATE_DELAY = 300;

function getCurrentLabel(isPostfix: boolean, ranged: boolean, value: number | number[], valueText: string | string[]) {
  if (!ranged) {
    return [value as number, valueText as string];
  }
  if (isPostfix) {
    return [(value as number[])[1], (valueText as string[])[1]];
  }
  return [(value as number[])[0], (valueText as string[])[0]];
}

function parseValue(valueText: string) {
  return valueText.replace(/\D/g, "");
}

export interface SelectionIndicatorProps extends VibeComponentProps {
  kind?: InfixKind;
  key?: InfixKind;
}

const SelectionIndicator: React.FC<SelectionIndicatorProps> = ({ kind = InfixKind.PREFIX }) => {
  const isPostfix = kind === InfixKind.POSTFIX;
  const { ranged, value, valueText } = useSliderSelection();
  const [, currentTextValue] = getCurrentLabel(isPostfix, ranged, value, valueText);
  const { changeThumbValue } = useSliderActions();
  const handleChange = useMemo(
    () =>
      debounce(newValueText => {
        const newValue = parseValue(newValueText);
        const thumbIndex = isPostfix ? 1 : 0;
        changeThumbValue(newValue, thumbIndex, true);
      }, VALUE_UPDATE_DELAY),
    [changeThumbValue, isPostfix]
  );
  // @ts-ignore TODO TS-migration TextField not converted yet
  return <TextField onChange={handleChange} value={currentTextValue} />;
};

export default SelectionIndicator;
