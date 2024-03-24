import { useEffect, useState } from 'react';
import './Hint.css';
import Icon from '@mui/material/Icon';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
        <ErrorOutlineIcon />
        {`Обычно заведения категорий ${chosen} открываются рядом с ${suggested}`}
      </div>
    );
  } else {
    return (
      <div className="suggest-container">
        <ErrorOutlineIcon />
        {`Заведения категорий ${chosen} не рекомендуется размещать рядом с ${suggested}`}
      </div>
    );
  }
};

export default Hint;
