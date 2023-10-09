import React, { useState } from 'react';

function Slider() {
  const [sliderValue, setSliderValue] = useState(10000);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderValue(val);
  };

  return (
    <>
      <input
        type="range"
        min="10000"
        max="100000000"
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <p>Value: {sliderValue}</p>
    </>
  );
}

export default Slider;