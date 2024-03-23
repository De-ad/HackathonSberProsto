import { Button, Slider } from '@mui/material';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const businessTypes = [
  { id: 1, title: 'Кафе' },
  { id: 2, title: 'Завод' },
  { id: 3, title: 'Кладбище' }
];
const businessNear = [
  { id: 1, title: 'Кафе' },
  { id: 2, title: 'Завод' },
  { id: 3, title: 'Кладбище' }
];


const InputForm = () => {
  const [rentPrice, setRentPrice] = useState([0, 10000]);
  const [meterPrice, setMeterPrice] = useState([0, 10000]);
  const [area, setAres] = useState([0, 1000]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [floor, setFloor] = useState([0, 10]);

  const handleRentPriceChange = (event, newValue) => {
    setRentPrice(newValue);
  };
  const handleAreaChange = (event, newValue) => {
    setAres(newValue);
  };
  const handleMeterPriceChange = (event, newValue) => {
    setMeterPrice(newValue);
  };
  const handleFloorChange = (event, newValue) => {
    setFloor(newValue);
  };

  return (
    <div>
      <h1>Ввод данных</h1>
      <div>Категории бизнеса</div>
      <Autocomplete
        multiple
        id=""
        options={businessTypes}
        getOptionLabel={(option) => option?.title}
        filterSelectedOptions
        style={{ width: 500, color: 'white' }}
        renderInput={(params) => (
          <TextField
            style={{ width: 500, background: 'white' }}
            {...params}
            label="Категории бизнеса"
            placeholder="Категория бизнеса"
          />
        )}
      />

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
      <Autocomplete
        multiple
        id=""
        options={businessNear}
        getOptionLabel={(option) => option?.title}
        filterSelectedOptions
        style={{ width: 500, color: 'white' }}
        renderInput={(params) => (
          <TextField
            style={{ width: 500, background: 'white' }}
            {...params}
            label="Заведения поблизости (включить)"
            placeholder="Заведения поблизости (включить)"
          />
        )}
      />

      <div>Заведения поблизости (исключить)</div>
      <Autocomplete
        multiple
        id=""
        options={businessNear}
        getOptionLabel={(option) => option?.title}
        filterSelectedOptions
        style={{ width: 500, color: 'white' }}
        renderInput={(params) => (
          <TextField
            style={{ width: 500, background: 'white' }}
            {...params}
            label="Заведения поблизости (исключить)"
            placeholder="Заведения поблизости (исключить)"
          />
        )}
      />

      <div>Площадь помещения</div>
      <Slider
        getAriaLabel={() => ''}
        value={area}
        onChange={handleAreaChange}
        valueLabelDisplay="auto"
        max={1000}
        marks={[0, 100]}
      />

      <div>Этаж</div>
      <Slider
        getAriaLabel={() => ''}
        value={floor}
        onChange={handleFloorChange}
        valueLabelDisplay="auto"
        max={100}
      />

      <Button variant="contained">Найти</Button>
    </div>
  );
};

export default InputForm;
