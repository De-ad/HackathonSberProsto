import { useEffect } from 'react';
import './OutputDetails.css';
import { Button } from '@mui/material';

const OutputDetails = (props) => {
  const { id, lat, lon, link, saturationCoef, address, label, businessNear } = props.currentPoint;

  useEffect(() => {
    console.log(props);
  }, [props]);

  return (
    <div className="outputDetails-container">
      <div>Объявление об аренде: </div>
      <div>Адрес: {address}</div>
      <div style={{ marginBottom: '10px' }}>Категория: {label}</div>
      <Button variant="contained">
        <a href={link} style={{ color: '#fff', textDecoration: 'none' }} target="_blank">
          Перейти к объявлению
        </a>
      </Button>
    </div>
  );
};
export default OutputDetails;
