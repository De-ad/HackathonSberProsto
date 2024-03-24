import { useEffect, useState } from 'react';
import './Hint.css';
import Add from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Hint = (props) => {
  const { include, chosenCategories, suggestedCategories, onCategoriesAdd } = props;
  const [visibility, setVisibility] = useState(true);

  useEffect(() => {
    console.log(chosenCategories);
    console.log(suggestedCategories);
  }, [props]);

  const handleCategoriesAdd = () => {
    onCategoriesAdd(suggestedCategories);
    setVisibility(false);
  };

  if (include) {
    return (
      visibility && (
        <div className="suggest-container">
          <div className="suggest-container-text">
            <ErrorOutlineIcon />
            Обычно заведения категорий &quot;{chosenCategories.map((item) => item.title).join(', ')}
            &quot; открываются рядом с &quot;
            {suggestedCategories.map((item) => item.title).join(', ')}&quot;
            <button style={{ all: 'initial', color: 'white' }} onClick={handleCategoriesAdd}>
              <Add
                sx={{
                  '&:hover': { color: '#1976d2', backgroundColor: 'white' },
                  borderRadius: '24px',
                  transition: '0.3s'
                }}
              />
            </button>
          </div>
        </div>
      )
    );
  } else {
    return (
      <div></div>
      //   <div className="suggest-container">
      //     <div className="suggest-container-text">
      //       <ErrorOutlineIcon />
      //       Заведения категорий &quot;{chosenCategories.map((item) => item.title).join(', ')}&quot; не
      //       рекомендуется размещать рядом с &quot;
      //       {suggestedCategories.map((item) => item.title).join(', ')}&quot;
      //       <Add
      //         sx={{
      //           '&:hover': { color: '#1976d2', backgroundColor: 'white' },
      //           borderRadius: '24px',
      //           transition: '0.3s'
      //         }}
      //       />
      //     </div>
      //   </div>
    );
  }
};

export default Hint;
