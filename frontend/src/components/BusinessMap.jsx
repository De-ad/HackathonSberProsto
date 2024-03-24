import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useState, useEffect } from 'react';
import OutputDetails from './OutputDetails';
import ReviewBlock from './ReviewBlock';
import { calculateSaturation } from '../utils/calculateColorSaturation';

const BusinessMap = (props) => {
  const [currentPoint, setCurrentPoint] = useState();
  const [points, setPoints] = useState(props.points);

  useEffect(() => {
    setPoints(props.points);
  }, [props.points]);

  const handleCurrentPointChange = (data) => {
    setCurrentPoint(data);
  };

  return (
    <div>
      <YMaps>
        <Map defaultState={{ center: [59.93, 30.31], zoom: 9 }} width="40vw" height="40vh">
          {!(points.length === 0) &&
            points.map((point) => (
              <Placemark
                key={point.id}
                defaultGeometry={[point.lat, point.lon]}
                options={{
                  iconColor:
                    currentPoint === point
                      ? 'rgba(255, 0, 0, 1)'
                      : calculateSaturation(point.saturationCoef)
                }}
                onClick={() => handleCurrentPointChange(point)}
              />
            ))}
        </Map>
      </YMaps>
      {currentPoint && <OutputDetails currentPoint={currentPoint} />}
      {currentPoint && <ReviewBlock reviews={currentPoint.businesses} />}
    </div>
  );
};
export default BusinessMap;
