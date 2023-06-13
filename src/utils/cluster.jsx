export const checkDistinctElements = (list) => {
    const uniqueSet = new Set(list);
    const res = list.length > 1 && uniqueSet.size > 1;
    return res
}