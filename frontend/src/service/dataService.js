import axios from 'axios';

const BASE_URL = '/';


export const getMinMaxValues = () => {
  axios.get(BASE_URL + 'getMinMaxValues').then((r) => {
    console.log(r);
    return r.data;
  });
};

export const getBusinessCategories = () => {
  axios.get(BASE_URL + 'getBusinessCategories').then((r) => {
    console.log(r);
    return r.data;
  });
};

export const getHint = (businessCategories) => {
  axios
    .post(BASE_URL + 'hint', {
      businessCategories
    })
    .then((r) => {
      console.log(r);
      return r.data;
    });
};

export const getPlaces = (
  businessCategories,
  rentPrice,
  area,
  floor,
  businessNearInclude,
  businessNearExclude
) => {
  axios
    .post(BASE_URL + 'places', {
      businessCategories,
      rentPrice,
      area,
      floor,
      businessNearInclude,
      businessNearExclude
    })
    .then((r) => {
      console.log(r);
      return r.data;
    });
};
