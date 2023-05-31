export const areFormElementEqual = (prevProps, nextProps) => {
    return JSON.stringify(prevProps.item) == JSON.stringify(nextProps.item);
};