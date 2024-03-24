import { Button, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  getBusinessCategories,
  getMinMaxValues,
  getHint,
  getPlaces,
  getMetroStations
} from '../service/dataService';
import BusinessMap from './BusinessMap';
import './InputForm.css';
import Hint from './Hint';

const InputForm = () => {
  const [meterPrice, setMeterPrice] = useState([0, 10000]);
  const [allMetroStations, setAllMetroStations] = useState([]);
  const [area, setArea] = useState([0, 10000]);
  const [minMaxValues, setMinMaxValues] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [floor, setFloor] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [businessCategoriesInclude, setBusinessCategoriesInclude] = useState([]);
  const [businessCategoriesExclude, setBusinessCategoriesExclude] = useState([]);
  const [points, setPoints] = useState([]);
  const [suggestedIncludeCategories, setSuggestedIncludeCategories] = useState([]);
  const [suggestedExcludeCategories, setSuggestedExcludeCategories] = useState([]);
  const [metroStations, setMetroStations] = useState([]);
  const [error, setError] = useState(false);

  const handleBusinessInput = (event, newValue) => {
    setSelectedCategories(newValue);
    if (newValue.length != 0) {
      setError(false);
    }
    handleGetHint();
  };

  const checkBusinessLength = () => {
    if (selectedCategories.length == 0 || !selectedCategories) {
      setError(true);
      return;
    }
    setError(false);
  };

  const handleCategoriesAdd = (categories) => {
    let temp = [...categories, ...businessCategoriesInclude];
    setBusinessCategoriesInclude(temp);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const minMax = await getMinMaxValues();
        setMinMaxValues(minMax);
        const business = await getBusinessCategories();
        setBusinessCategories(business);
        const metro = await getMetroStations();
        setAllMetroStations(metro);
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
        setSuggestedIncludeCategories(temp[0]);
        setSuggestedExcludeCategories(temp[1]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  };

  const handleSend = () => {
    if (selectedCategories.length == 0 || !selectedCategories) {
      setError(true);
      return;
    }
    setError(false);
    const fetchData = async () => {
      try {
        const temp = await getPlaces(
          selectedCategories,
          metroStations,
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
        <div>
          Категории бизнеса <span style={{ color: 'red' }}>*</span>
        </div>
        <Autocomplete
          multiple
          id=""
          options={businessCategories}
          getOptionLabel={(option) => option?.title}
          filterSelectedOptions
          style={{ width: 500, color: 'white' }}
          value={selectedCategories}
          aria-describedby="placement-popper"
          onChange={(event, value) => handleBusinessInput(event, value)}
          renderInput={(params) => (
            <TextField
              style={{ width: 500, background: 'white' }}
              {...params}
              placeholder="Категория бизнеса"
            />
          )}
        />
        {error && <div style={{ color: 'red' }}>Введите хотя бы одну категорию данных</div>}

        <div>Станция метро</div>
        <Autocomplete
          id=""
          options={allMetroStations}
          getOptionLabel={(option) => option?.title}
          filterSelectedOptions
          style={{ width: 500, color: 'white' }}
          onChange={(event, value) => setMetroStations(value)}
          renderInput={(params) => (
            <TextField
              style={{ width: 500, background: 'white' }}
              {...params}
              placeholder="Станция метро"
            />
          )}
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
          value={businessCategoriesInclude}
          aria-describedby="placement-popper"
          onChange={(event, value) => setBusinessCategoriesInclude(value)}
          renderInput={(params) => (
            <TextField
              style={{ width: 500, background: 'white' }}
              {...params}
              placeholder="Заведения поблизости (включить)"
            />
          )}
        />
        {suggestedIncludeCategories.length != 0 && (
          <Hint
            include={true}
            chosenCategories={selectedCategories}
            suggestedCategories={suggestedIncludeCategories}
            onCategoriesAdd={handleCategoriesAdd}
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
              placeholder="Заведения поблизости (исключить)"
            />
          )}
        />
        {suggestedIncludeCategories.length != 0 && (
          <Hint
            include={false}
            chosenCategories={businessCategories}
            suggestedCategories={suggestedExcludeCategories}
            onCategoriesAdd={handleCategoriesAdd}
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

        <Button sx={{ width: 'min-content' }} variant="contained" onClick={handleSend}>
          Найти
        </Button>
      </div>

      <BusinessMap points={points} />
    </div>
  );
};

export default InputForm;
