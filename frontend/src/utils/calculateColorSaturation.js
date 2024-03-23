export const calculateSaturation = (saturationCoefficient) => {
  let r = Math.round(200 - 200 * saturationCoefficient);
  let b = Math.round(200 - 200 * saturationCoefficient);
  return `rgba(${r}, 255, ${b}, 1)`;
};
