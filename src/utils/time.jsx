export const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export function timestampToYYYYMMDD(timestamp) {
    var date = new Date(timestamp);

    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Tháng được đánh số từ 0 đến 11
    var day = ('0' + date.getDate()).slice(-2);

    return year + '/' + month + '/' + day;
}

export function YYYYMMDDToTimestamp(dateString) {
    var parts = dateString.split('/');
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Tháng được đánh số từ 0 đến 11
    var day = parseInt(parts[2], 10);

    var date = new Date(year, month, day);

    return date.getTime();
}
