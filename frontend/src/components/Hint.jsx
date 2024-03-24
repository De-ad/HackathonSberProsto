import { useEffect, useState } from 'react';
import './Hint.css';
import Add from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button } from '@mui/material';

const Hint = (props) => {
  const { include, chosenCategories, suggestedCategories } = props;
  const [chosen, setChosen] = useState('');
  const [suggested, setSuggested] = useState('');

  useEffect(() => {
    setChosen(mapArrayToString(chosenCategories));
    setSuggested(mapArrayToString(suggestedCategories));
  }, [chosenCategories, props, suggested]);

  const mapArrayToString = (array) => {
    let temp = array.map((item) => item.title).join(', ');
    return `"${temp}"`;
  };

  if (include) {
    return (
      <div className="suggest-container">
        <div className="suggest-container-text">
          <ErrorOutlineIcon />
          Обычно заведения категорий &quot;{chosenCategories.map((item) => item.title).join(', ')}
          &quot; открываются рядом с &quot;
          {suggestedCategories.map((item) => item.title).join(', ')}&quot;
          <Add
            sx={{
              '&:hover': { color: '#1976d2', backgroundColor: 'white' },
              borderRadius: '24px',
              transition: '0.3s'
            }}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="suggest-container">
        <div className="suggest-container-text">
          <ErrorOutlineIcon />
          Заведения категорий &quot;{chosenCategories.map((item) => item.title).join(', ')}&quot; не
          рекомендуется размещать рядом с &quot;
          {suggestedCategories.map((item) => item.title).join(', ')}&quot;
          <Add
            sx={{
              '&:hover': { color: '#1976d2', backgroundColor: 'white' },
              borderRadius: '24px',
              transition: '0.3s'
            }}
          />
        </div>
      </div>
    );
  }
};

export default Hint;
