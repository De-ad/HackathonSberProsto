import { Autocomplete, Button, MenuItem, OutlinedInput, Select, Slider } from '@mui/material';
import { useState } from 'react';

const InputForm = () => {
  const [rentPrice, setRentPrice] = useState([0, 10000]);
  const [meterPrice, setMeterPrice] = useState([0, 10000]);
  const [area, setAres] = useState([0,1000]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [floor, setFloor] = useState([0,100]);

  const handleRentPriceChange = (event, newValue) => {
     setRentPrice(newValue);
  }
  const handleAreaChange = (event, newValue) => {
    setAres(newValue);
 }
  const handleMeterPriceChange = (event, newValue) => {
    setMeterPrice(newValue);
 }
 const handleFloorChange = (event, newValue) => {
  setFloor(newValue);
}

 const business = [
  'Кафе',
  'Завод',
  'Кладбище'
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

  return (
    <div>
      <h1>Ввод данных</h1>
      <div>Категории бизнеса</div>
      
      <div>Цена аренды за месяц</div>
      <Slider
        getAriaLabel={() => ''}
        value={rentPrice}
        onChange={handleRentPriceChange}
        valueLabelDisplay="auto"
        max={1000000}
      />

      <div>Цена за метр</div>
      <Slider
        getAriaLabel={() => ''}
        value={meterPrice}
        onChange={handleMeterPriceChange}
        valueLabelDisplay="auto"
        max={1000000}
      />
      
      <div>Заведения поблизости (включить)</div>
        <Select
          labelId=""
          id=""
          multiple
          value={businessCategories}
          onChange={setBusinessCategories}
          input={<OutlinedInput label="BusinessCategories" />}
          MenuProps={MenuProps}
        >
          {business.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      <div>Заведения поблизости (исключить)</div>
        <Select
            labelId=""
            id=""
            multiple
            value={businessCategories}
            onChange={setBusinessCategories}
            input={<OutlinedInput label="BusinessCategories" />}
            MenuProps={MenuProps}
          >
            {business.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
      <div>Площадь помещения</div>
      <Slider
        getAriaLabel={() => ''}
        value={area}
        onChange={handleAreaChange}
        valueLabelDisplay="auto"
        max={1000}
      />

      <div>Этаж</div>
      <Slider
        getAriaLabel={() => ''}
        value={floor}
        onChange={handleFloorChange}
        valueLabelDisplay="auto"
        max={100}
      />
      <Button>Найти</Button>
    </div>
  );
};

export default InputForm;
