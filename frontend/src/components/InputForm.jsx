import { Button, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getBusinessCategories, getMinMaxValues, getHint, getPlaces } from '../service/dataService';
import BusinessMap from './BusinessMap';
import './InputForm.css';
import Hint from './Hint';

const InputForm = () => {
  const [rentPrice, setRentPrice] = useState([0, 100]);
  const [meterPrice, setMeterPrice] = useState([0, 100]);
  const [area, setArea] = useState([0, 100]);
  const [minMaxValues, setMinMaxValues] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [floor, setFloor] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [businessCategoriesInclude, setBusinessCategoriesInclude] = useState([]);
  const [businessCategoriesExclude, setBusinessCategoriesExclude] = useState([]);
  const [points, setPoints] = useState([]);
  const [suggestedIncludeCategories, setSuggestedIncludeCategories] = useState([]);
  const [suggestedExcludeCategories, setSuggestedExcludeCategories] = useState([]);

  const handleBusinessInput = (event, newValue) => {
    setSelectedCategories(newValue);
    handleGetHint();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const minMax = await getMinMaxValues();
        setMinMaxValues(minMax);
        const business = await getBusinessCategories();
        setBusinessCategories(business);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGetHint = () => {
    const fetchData = async () => {
      try {
        const temp = await getHint(selectedCategories);
        setSuggestedIncludeCategories(temp[0].categories);
        setSuggestedExcludeCategories(temp[1].categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  };

  const handleSend = () => {
    const fetchData = async () => {
      try {
        const temp = await getPlaces(
          businessCategories,
          rentPrice,
          area,
          floor,
          meterPrice,
          businessCategoriesInclude,
          businessCategoriesExclude
        );
        setPoints(temp);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  };

  if (minMaxValues.length == 0 || businessCategories.length == 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="root-container">
      <div className="input-container">
        <h1>Ввод данных</h1>
        <div>Категории бизнеса</div>
        <Autocomplete
          multiple
          id=""
          options={businessCategories}
          getOptionLabel={(option) => option?.title}
          filterSelectedOptions
          style={{ width: 500, color: 'white' }}
          onChange={(event, value) => handleBusinessInput(value)}
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
          onChange={(event, value) => setRentPrice(value)}
          valueLabelDisplay="auto"
          min={minMaxValues.rentPrice[0]}
          max={minMaxValues.rentPrice[1]}
        />

        <div>Цена за метр</div>
        <Slider
          getAriaLabel={() => ''}
          value={meterPrice}
          onChange={(event, value) => setMeterPrice(value)}
          valueLabelDisplay="auto"
          min={minMaxValues.meterPrice[0]}
          max={minMaxValues.meterPrice[1]}
        />

        <div>Заведения поблизости (включить)</div>
        <Autocomplete
          multiple
          id=""
          options={businessCategories}
          getOptionLabel={(option) => option?.title}
          filterSelectedOptions
          style={{ width: 500, color: 'white' }}
          aria-describedby="placement-popper"
          onChange={(event, value) => setBusinessCategoriesInclude(value)}
          renderInput={(params) => (
            <TextField
              style={{ width: 500, background: 'white' }}
              {...params}
              label="Заведения поблизости (включить)"
              placeholder="Заведения поблизости (включить)"
            />
          )}
        />
        {suggestedIncludeCategories.length != 0 && (
          <Hint
            include={true}
            chosenCategories={businessCategories}
            suggestedCategories={suggestedIncludeCategories}
          />
        )}

        <div>Заведения поблизости (исключить)</div>
        <Autocomplete
          multiple
          id=""
          options={businessCategories}
          getOptionLabel={(option) => option?.title}
          filterSelectedOptions
          style={{ width: 500, color: 'white' }}
          onChange={(event, value) => setBusinessCategoriesExclude(value)}
          renderInput={(params) => (
            <TextField
              style={{ width: 500, background: 'white' }}
              {...params}
              label="Заведения поблизости (исключить)"
              placeholder="Заведения поблизости (исключить)"
            />
          )}
        />
        {suggestedIncludeCategories.length != 0 && (
          <Hint
            include={false}
            chosenCategories={businessCategories}
            suggestedCategories={suggestedExcludeCategories}
          />
        )}

        <div>Площадь помещения</div>
        <Slider
          getAriaLabel={() => ''}
          value={area}
          onChange={(event, value) => setArea(value)}
          valueLabelDisplay="auto"
          min={minMaxValues.area[0]}
          max={minMaxValues.area[1]}
        />

        <div>Этаж</div>
        <Slider
          getAriaLabel={() => ''}
          value={floor}
          onChange={(event, value) => setFloor(value)}
          valueLabelDisplay="auto"
          min={minMaxValues.floor[0]}
          max={minMaxValues.floor[1]}
        />

        <Button variant="contained" onClick={handleSend}>
          Найти
        </Button>
      </div>

      <BusinessMap points={points} />
    </div>
  );
};

export default InputForm;
