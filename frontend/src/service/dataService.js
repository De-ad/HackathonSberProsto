import axios from 'axios';

const BASE_URL = 'http://localhost:8080/business/';

export const getMinMaxValues = async () => {
  try {
    const response = await axios.get(BASE_URL + 'params');
    return response.data.suggestions;
  } catch (error) {
    console.error('Error fetching min-max values:', error);
    throw error;
  }
};

export const getBusinessCategories = async () => {
  try {
    const response = await axios.get(BASE_URL + 'categories');
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching business categories:', error);
    throw error;
  }
};

export const getMetroStations = async () => {
    try {
      const response = await axios.get(BASE_URL + 'metro-stations');
      return response.data.categories;
    } catch (error) {
      console.error('Error fetching metro stations:', error);
      throw error;
    }
  };

export const getHint = async (businessCategories) => {
  try {
    const response = await axios.post(BASE_URL + 'suggest-categories', {
      businessCategories
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hint:', error);
    throw error;
  }
};

export const getPlaces = async (
  businessCategories,
metroStations,
  area,
  floor,
  meterPrice,
  businessNearInclude,
  businessNearExclude
) => {
  try {
    const response = await axios.post(BASE_URL + 'full-suggest', {
      meterPrice,
      metroStations,
      businessCategories,
      area,
      businessNearInclude,
      businessNearExclude,
      floor
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};
