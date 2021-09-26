import React from "react";
import "./Slider.css";
import { clamp, mapRange, stepClamp } from "./utils";

export interface UntrustedSliderProps {
  defaultValue?: string;
  formatAriaValueText?: (value: number) => string;
  formatValueText?: (value: number) => string;
  inline?: boolean;
  max?: string;
  min?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  step?: string;
  value?: string;
}

const defaultFormatValueText = (value: number) => String(value);

export const UntrustedSlider: React.FC<UntrustedSliderProps> = ({
  onChange,
  formatValueText = defaultFormatValueText,
  formatAriaValueText = formatValueText,
  min: controlledMin = "0",
  max: controlledMax = "100",
  step: controlledStep = "1",
  defaultValue = String(
    Math.round((Number(controlledMax) - Number(controlledMin)) / 2)
  ),
  value: controlledValue,
  inline,
}) => {
  const [internalValue, setInternalValue] = React.useState(
    Number(defaultValue)
  );
  const value = controlledValue ? Number(controlledValue) : internalValue;
  const [min, max, step] = [controlledMin, controlledMax, controlledStep].map(
    Number
  );
  const rootClassName = inline ? "Slider Slider--inline" : "Slider";
  const startXRef = React.useRef(0);
  const sliderTrackRef = React.useRef<HTMLDivElement>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      const { pageX } = event;
      if (sliderRef.current && sliderTrackRef.current && inputRef.current) {
        const sliderTrackRect = sliderTrackRef.current.getBoundingClientRect();

        const relativeValue = clamp(
          startXRef.current,
          sliderTrackRect.left,
          sliderTrackRect.right
        );

        const deltaX = pageX - startXRef.current;
        const next = stepClamp(
          min,
          max,
          step,
          mapRange(
            clamp(
              sliderTrackRect.left,
              sliderTrackRect.right,
              relativeValue + deltaX
            ),
            sliderTrackRect.left,
            sliderTrackRect.right,
            min,
            max
          )
        );

        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(inputRef.current, String(next));
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        setInternalValue(next);
      }
    },
    [max, min, step]
  );

  const handleMouseUp = React.useCallback(
    (event: MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove, false);
      document.removeEventListener("mouseup", handleMouseUp, false);
    },
    [handleMouseMove]
  );

  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, false);
      document.removeEventListener("mouseup", handleMouseUp, false);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback(
      (event) => {
        startXRef.current = event.pageX;
        document.addEventListener("mousemove", handleMouseMove, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      },
      [handleMouseMove, handleMouseUp]
    );

  return (
    <div className={rootClassName}>
      <label className="SliderLabel">
        <span className="SliderLabelText">Home price</span>
        <span className="SliderLabelValue">{formatValueText(value)}</span>
      </label>
      <div className="SliderRange">
        <div className="SliderRangeTrack" ref={sliderTrackRef}>
          <div
            className="SliderRangeTrackProgress"
            style={{
              transform: `translateX(${mapRange(value, min, max, -100, 0)}%)`,
            }}
          ></div>
        </div>
        <div
          className="SliderRangeKnob"
          style={{
            transform: `translateX(${mapRange(value, min, max, -100, 0)}%)`,
          }}
        >
          <div
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={value}
            aria-valuetext={formatAriaValueText(value)}
            className="SliderRangeKnobSlider"
            onMouseDown={handleMouseDown}
            ref={sliderRef}
            role="slider"
            tabIndex={0}
          >
            <div className="SliderRangeKnobSliderCue">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.9928 14L16 9L11.9928 4L11 5.23883L14.0143 9L11 12.7612L11.9928 14ZM6.00716 14L2 9L6.00716 4L7 5.23883L3.98568 9L7 12.7612L6.00716 14Z" />
              </svg>
            </div>
          </div>
          <input ref={inputRef} value={value} onChange={onChange} hidden />
        </div>
      </div>
    </div>
  );
};
