import { useEffect } from 'react';
import { Rating } from '@mui/material';
import './ReviewBlock.css';

const ReviewBlock = (props) => {
  const { reviews } = props;
  useEffect(() => {}, [props]);

  return (
    <div className="review-block-container">
      <div> Заведения рядом: </div>
      <div className="review-scroll-container">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <div className="data">
              <div>{review.title} </div>
              <div className="rating">
                <Rating name="read-only" value={review.rating} precision={0.1} readOnly />
                {review.rating}
              </div>
            </div>
            <div className="data">
              <div>{review.reviewCount} отзывов</div>
              <div>{review.address}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewBlock;
